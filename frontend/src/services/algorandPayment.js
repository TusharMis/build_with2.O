import algosdk from 'algosdk';
import { walletService } from './wallet.js';
import { api } from './api.js';

const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const DEFAULT_RECEIVER = 'ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA';
const REQUIRED_AMOUNT_MICRO_ALGOS = 100000n; // 0.1 ALGO = 100,000 microAlgos
const ESTIMATED_FEE_MICRO_ALGOS = 1000n; // 0.001 ALGO

/**
 * Custom Error Classes for Clean Error Classification
 */
export class InsufficientBalanceError extends Error {
  constructor(currentBalance, requiredBalance) {
    super(`Insufficient Balance: Your account has ${currentBalance.toFixed(4)} ALGO, but requires at least ${requiredBalance.toFixed(4)} ALGO (0.1 ALGO service fee + 0.001 ALGO network fee) on Algorand Testnet.`);
    this.name = 'InsufficientBalanceError';
    this.code = 'INSUFFICIENT_BALANCE';
    this.currentBalance = currentBalance;
    this.requiredBalance = requiredBalance;
  }
}

export class PaymentCancelledError extends Error {
  constructor(details = 'Transaction was rejected or cancelled by the user.') {
    super(`Payment Cancelled: ${details}`);
    this.name = 'PaymentCancelledError';
    this.code = 'PAYMENT_CANCELLED';
  }
}

export class SubmissionFailedError extends Error {
  constructor(reason) {
    super(`Payment Failed: Unable to broadcast transaction to Algorand Testnet node. ${reason}`);
    this.name = 'SubmissionFailedError';
    this.code = 'SUBMISSION_FAILED';
  }
}

export class VerificationFailedError extends Error {
  constructor(reason) {
    super(`Verification Failed: ${reason}`);
    this.name = 'VerificationFailedError';
    this.code = 'VERIFICATION_FAILED';
  }
}

export class SettlementFailedError extends Error {
  constructor(reason) {
    super(`Settlement Failed: ${reason}`);
    this.name = 'SettlementFailedError';
    this.code = 'SETTLEMENT_FAILED';
  }
}

/**
 * Real Algorand Testnet Payment Service
 * Handles on-chain 0.1 ALGO transaction creation, signing, broadcast, and backend verification.
 */
export class AlgorandPaymentService {
  constructor() {
    this.algod = new algosdk.Algodv2('', ALGOD_SERVER, '');
  }

  /**
   * Executes full on-chain 0.1 ALGO payment flow on Algorand Testnet
   * @param {Object} params
   * @param {string} params.receiverAddress - Recipient address
   * @param {string} params.serviceId - Target service ('contract_audit')
   * @param {string} params.query - User prompt query
   * @param {Function} [params.onStateChange] - Callback for UI state transitions
   */
  async executePayment({ receiverAddress = DEFAULT_RECEIVER, serviceId = 'contract_audit', query, onStateChange }) {
    const notifyState = (state, details = {}) => {
      console.log(`[Payment Flow State] ${state}`, details);
      if (onStateChange) onStateChange(state, details);
    };

    // Step 1: Check connected account
    notifyState('CHECKING_WALLET');
    const activeAccount = walletService.activeAccount;
    if (!activeAccount?.address) {
      throw new Error('No Algorand Testnet wallet connected. Please connect or create a demo wallet.');
    }

    // Step 2: Query real on-chain balance to verify funds
    notifyState('CHECKING_BALANCE');
    const balanceInfo = await walletService.getAccountBalance(activeAccount.address);
    const requiredTotal = Number(REQUIRED_AMOUNT_MICRO_ALGOS + ESTIMATED_FEE_MICRO_ALGOS) / 1e6; // 0.101 ALGO

    if (balanceInfo.algoBalance < requiredTotal) {
      notifyState('PAYMENT_FAILED', { code: 'INSUFFICIENT_BALANCE' });
      throw new InsufficientBalanceError(balanceInfo.algoBalance, requiredTotal);
    }

    // Step 3: Preparing Transaction
    notifyState('PREPARING_TRANSACTION');
    let suggestedParams;
    try {
      suggestedParams = await this.algod.getTransactionParams().do();
      suggestedParams.fee = 1000n;
      suggestedParams.flatFee = true;
    } catch (spErr) {
      notifyState('PAYMENT_FAILED', { code: 'SUBMISSION_FAILED' });
      throw new SubmissionFailedError(`Could not fetch network parameters from Algorand Testnet node: ${spErr.message}`);
    }

    const noteBytes = new Uint8Array(Buffer.from(`x402-payment-${serviceId}-${Date.now()}`));

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: activeAccount.address,
      receiver: receiverAddress || DEFAULT_RECEIVER,
      amount: REQUIRED_AMOUNT_MICRO_ALGOS, // 0.1 ALGO
      note: noteBytes,
      suggestedParams
    });

    // Step 4: Waiting for Wallet Approval / Signing
    notifyState('WAITING_FOR_APPROVAL');
    let signedBlob;

    try {
      if (activeAccount.sk) {
        // Demo Keypair client-side signing
        const signed = algosdk.signTransaction(txn, activeAccount.sk);
        signedBlob = signed.blob;
      } else if (activeAccount.signer) {
        // Browser wallet / Extension signing
        const signedTxns = await activeAccount.signer.signTransactions([txn.toByte()]);
        if (!signedTxns || !signedTxns[0]) {
          throw new PaymentCancelledError('User rejected or cancelled the transaction in the wallet.');
        }
        signedBlob = signedTxns[0];
      } else {
        throw new Error('Active wallet does not have signing capabilities.');
      }
    } catch (signErr) {
      notifyState('PAYMENT_FAILED', { code: 'PAYMENT_CANCELLED' });
      if (signErr instanceof PaymentCancelledError) throw signErr;
      throw new PaymentCancelledError(signErr.message);
    }

    // Step 5: Transaction Submitted to Algorand Testnet
    notifyState('TRANSACTION_SUBMITTED', { txId: txn.txID() });
    let txId;
    try {
      const sendResult = await this.algod.sendRawTransaction(signedBlob).do();
      txId = sendResult.txId || txn.txID();
      console.log(`[Payment Log] Transaction broadcasted to Algorand Testnet with ID: ${txId}`);
    } catch (broadcastErr) {
      notifyState('PAYMENT_FAILED', { code: 'SUBMISSION_FAILED' });
      throw new SubmissionFailedError(broadcastErr.message || 'Transaction was rejected by the Algorand node pool.');
    }

    // Step 6: Verifying Settlement on Algorand Testnet
    notifyState('VERIFYING_PAYMENT', { txId });
    let confirmedTx;
    try {
      confirmedTx = await algosdk.waitForConfirmation(this.algod, txId, 4);
    } catch (confErr) {
      notifyState('PAYMENT_FAILED', { code: 'SETTLEMENT_FAILED' });
      throw new SettlementFailedError(`Transaction confirmation timed out on Algorand Testnet: ${confErr.message}`);
    }

    const confirmedRound = confirmedTx.confirmedRound ? Number(confirmedTx.confirmedRound) : (confirmedTx['confirmed-round'] ? Number(confirmedTx['confirmed-round']) : null);
    
    if (!confirmedRound || confirmedRound <= 0) {
      notifyState('PAYMENT_FAILED', { code: 'SETTLEMENT_FAILED' });
      throw new SettlementFailedError('Transaction is not confirmed on Algorand Testnet.');
    }

    console.log(`[Payment Log] Transaction confirmed on Algorand Testnet in round: #${confirmedRound}`);

    // Step 7: Send Proof to Backend to Unlock AI Service
    notifyState('UNLOCKING_SERVICE', { txId, confirmedRound });
    let backendRes;
    try {
      backendRes = await api.callPaidService({
        serviceId,
        query,
        txId,
        sender: activeAccount.address
      });
    } catch (netErr) {
      notifyState('PAYMENT_FAILED', { code: 'VERIFICATION_FAILED' });
      throw new VerificationFailedError(`Could not communicate with verification backend: ${netErr.message}`);
    }

    if (!backendRes.isSuccess || !backendRes.data.paymentVerified) {
      const errReason = backendRes.data?.error || 'On-chain verification could not be validated by the backend.';
      notifyState('PAYMENT_FAILED', { code: 'VERIFICATION_FAILED' });
      throw new VerificationFailedError(errReason);
    }

    // Step 8: Payment Confirmed & Service Unlocked
    notifyState('PAYMENT_CONFIRMED', {
      txId,
      confirmedRound,
      result: backendRes.data.result,
      settlement: backendRes.data.settlement
    });

    return {
      success: true,
      txId,
      confirmedRound,
      settlement: backendRes.data.settlement,
      result: backendRes.data.result
    };
  }
}

export const algorandPaymentService = new AlgorandPaymentService();
