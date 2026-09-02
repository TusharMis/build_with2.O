import algosdk from 'algosdk';
import { toClientAvmSigner } from '@x402/avm';

const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const INDEXER_SERVER = 'https://testnet-idx.algonode.cloud';
const PERSISTED_ACCOUNT_KEY = 'algorand_persisted_demo_account';
const SESSION_STATE_KEY = 'algorand_wallet_session_active';

/**
 * Algorand Testnet Wallet Service
 * 
 * Key Principles:
 * 1. Demo accounts are saved in localStorage and remain persistent across page reloads & disconnects.
 * 2. `disconnect()` only sets the UI/session to inactive; it NEVER deletes the persisted account.
 * 3. `connectWithDemoAccount()` always reuses the existing persisted account if one exists.
 * 4. `purgePersistedAccount()` is the only deliberate destructive action that deletes the stored account.
 * 5. All balances are queried live from the Algorand Testnet Algonode API (microAlgos / 1e6).
 */
export class AlgorandWalletService {
  constructor() {
    this.algod = new algosdk.Algodv2('', ALGOD_SERVER, '');
    this.indexer = new algosdk.Indexer('', INDEXER_SERVER, '');
    this.activeAccount = null; // { address, signer, sk, mnemonic, type, createdAt }
    this.initializeSession();
  }

  /**
   * Initializes the session on startup / page reload
   */
  initializeSession() {
    try {
      const persisted = this.getPersistedAccount();
      if (!persisted) return null;

      // Check if session was explicitly disconnected
      const sessionActive = localStorage.getItem(SESSION_STATE_KEY);
      // Default to active if persisted account exists
      if (sessionActive !== 'false') {
        this.activeAccount = persisted;
        localStorage.setItem(SESSION_STATE_KEY, 'true');
        return this.activeAccount;
      }
    } catch (err) {
      console.warn('Could not initialize wallet session:', err);
    }
    return null;
  }

  /**
   * Reads and reconstructs the persisted account from localStorage without overwriting
   */
  getPersistedAccount() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const raw = localStorage.getItem(PERSISTED_ACCOUNT_KEY);
      if (!raw) return null;

      const data = JSON.parse(raw);
      if (data.mnemonic) {
        const secretKey = algosdk.mnemonicToSecretKey(data.mnemonic);
        const skBase64 = Buffer.from(secretKey.sk).toString('base64');
        const signer = toClientAvmSigner(skBase64);
        const address = secretKey.addr.toString();

        return {
          address,
          signer,
          sk: secretKey.sk,
          mnemonic: data.mnemonic,
          type: data.type || 'demo',
          createdAt: data.createdAt
        };
      } else if (data.skArray) {
        const skBytes = new Uint8Array(data.skArray);
        const address = algosdk.encodeAddress(skBytes.slice(32));
        const skBase64 = Buffer.from(skBytes).toString('base64');
        const signer = toClientAvmSigner(skBase64);
        const mnemonic = algosdk.secretKeyToMnemonic(skBytes);

        return {
          address,
          signer,
          sk: skBytes,
          mnemonic,
          type: data.type || 'demo',
          createdAt: data.createdAt
        };
      }
    } catch (err) {
      console.warn('Error reading persisted account:', err);
    }
    return null;
  }

  /**
   * Connects to demo account: Reuses existing persisted account if available,
   * otherwise creates a new one and persists it.
   */
  connectWithDemoAccount() {
    // Check if an account already exists in localStorage
    const existing = this.getPersistedAccount();
    if (existing) {
      this.activeAccount = existing;
      localStorage.setItem(SESSION_STATE_KEY, 'true');
      return this.activeAccount;
    }

    // No account exists -> generate fresh keypair and persist
    return this.generateAndPersistFreshAccount();
  }

  /**
   * Generates a fresh Algorand Testnet demo account and persists it in localStorage
   */
  generateAndPersistFreshAccount() {
    const account = algosdk.generateAccount();
    const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    const skBase64 = Buffer.from(account.sk).toString('base64');
    const signer = toClientAvmSigner(skBase64);
    const address = account.addr.toString();

    this.activeAccount = {
      address,
      signer,
      sk: account.sk,
      mnemonic,
      type: 'demo',
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(PERSISTED_ACCOUNT_KEY, JSON.stringify({
        address,
        mnemonic,
        skArray: Array.from(account.sk),
        type: 'demo',
        createdAt: this.activeAccount.createdAt
      }));
      localStorage.setItem(SESSION_STATE_KEY, 'true');
    }

    return this.activeAccount;
  }

  /**
   * Imports a 25-word mnemonic passphrase and persists it as the demo account
   */
  importAndPersistMnemonic(mnemonic) {
    const cleanMnemonic = mnemonic.trim();
    const secretKey = algosdk.mnemonicToSecretKey(cleanMnemonic);
    const skBase64 = Buffer.from(secretKey.sk).toString('base64');
    const signer = toClientAvmSigner(skBase64);
    const address = secretKey.addr.toString();

    this.activeAccount = {
      address,
      signer,
      sk: secretKey.sk,
      mnemonic: cleanMnemonic,
      type: 'imported',
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(PERSISTED_ACCOUNT_KEY, JSON.stringify({
        address,
        mnemonic: cleanMnemonic,
        skArray: Array.from(secretKey.sk),
        type: 'imported',
        createdAt: this.activeAccount.createdAt
      }));
      localStorage.setItem(SESSION_STATE_KEY, 'true');
    }

    return this.activeAccount;
  }

  /**
   * Connect browser injected wallet (Kibisis / Pera Web / Defly / ARC-0027)
   */
  async connectBrowserWallet() {
    if (typeof window !== 'undefined' && window.algorand) {
      const enableRes = await window.algorand.enable();
      const accounts = enableRes.accounts || [];
      if (!accounts.length) {
        throw new Error('No accounts selected in browser wallet.');
      }
      const address = typeof accounts[0] === 'string' ? accounts[0] : accounts[0].address;

      const signer = {
        address,
        signTransactions: async (txns, indexesToSign) => {
          const base64Txns = txns.map(t => Buffer.from(t).toString('base64'));
          const signed = await window.algorand.signTxns({ txns: base64Txns, indexesToSign });
          return signed.map(s => s ? new Uint8Array(Buffer.from(s, 'base64')) : null);
        }
      };

      this.activeAccount = { address, signer, type: 'browser' };
      localStorage.setItem(SESSION_STATE_KEY, 'true');
      return this.activeAccount;
    }

    throw new Error('No Algorand browser wallet extension (such as Kibisis or Pera Web) detected. Please use Demo Account or Import Passphrase.');
  }

  /**
   * Disconnects the active wallet UI session.
   * NOTE: This does NOT delete the persisted demo account from localStorage!
   */
  disconnect() {
    this.activeAccount = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(SESSION_STATE_KEY, 'false');
    }
  }

  /**
   * Deliberate destructive action: Deletes the persisted demo account from localStorage.
   */
  purgePersistedAccount() {
    this.activeAccount = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(PERSISTED_ACCOUNT_KEY);
      localStorage.setItem(SESSION_STATE_KEY, 'false');
    }
  }

  /**
   * Queries real live ALGO balance from Algorand Testnet node
   * @param {string} [address]
   */
  async getAccountBalance(address) {
    const targetAddr = address || this.activeAccount?.address;
    if (!targetAddr) return { algoBalance: 0, minBalance: 0, exists: false };

    try {
      const accountInfo = await this.algod.accountInformation(targetAddr).do();
      const rawAmount = accountInfo.amount ? Number(accountInfo.amount) : 0;
      const algoBalance = rawAmount / 1e6; // 1 ALGO = 1,000,000 microAlgos
      const rawMinBalance = accountInfo.minBalance 
        ? Number(accountInfo.minBalance) 
        : (accountInfo['min-balance'] ? Number(accountInfo['min-balance']) : 100000);

      return {
        algoBalance,
        minBalance: rawMinBalance / 1e6,
        exists: true,
        raw: accountInfo
      };
    } catch (err) {
      // On Algorand, unfunded accounts return 404 until funded with test ALGO
      return {
        algoBalance: 0,
        minBalance: 0.1,
        exists: false,
        unfunded: true
      };
    }
  }

  /**
   * Queries live Algorand Testnet node status
   */
  async getNetworkStatus() {
    try {
      const status = await this.algod.status().do();
      const lastRound = status.lastRound 
        ? Number(status.lastRound) 
        : (status['last-round'] ? Number(status['last-round']) : null);
      return {
        network: 'Algorand Testnet',
        isOnline: true,
        lastRound,
        nodeUrl: ALGOD_SERVER
      };
    } catch (err) {
      return {
        network: 'Algorand Testnet',
        isOnline: false,
        lastRound: null,
        error: err.message
      };
    }
  }

  createGenericSigner(address) {
    return {
      address,
      signTransactions: async () => {
        throw new Error('Read-only wallet session. Reconnect with a signing-capable wallet.');
      }
    };
  }

  getSigner() {
    return this.activeAccount?.signer || null;
  }
}

export const walletService = new AlgorandWalletService();
