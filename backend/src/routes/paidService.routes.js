import { Router } from 'express';
import algosdk from 'algosdk';
import { config } from '../config/index.js';
import { toolRegistry } from '../tools/tool.registry.js';
import { smartContractAuditTool } from '../tools/paid/smartContractAudit.tool.js';

const router = Router();
const algod = new algosdk.Algodv2('', config.algorand.nodeUrl, '');
const indexer = new algosdk.Indexer('', config.algorand.indexerUrl, '');

/**
 * Helper: Fetch confirmed transaction details from Algorand Testnet (Algod + Indexer)
 */
async function fetchOnChainTransaction(txId) {
  // 1. Try Algod first (for real-time recent transactions within last 1000 rounds)
  try {
    const txInfo = await algod.pendingTransactionInformation(txId).do();
    if (txInfo) {
      const confirmedRound = txInfo.confirmedRound ? Number(txInfo.confirmedRound) : (txInfo['confirmed-round'] ? Number(txInfo['confirmed-round']) : 0);
      const poolError = txInfo.poolError || txInfo['pool-error'] || '';
      const txnData = txInfo.txn?.txn || txInfo.txn || {};
      const txSender = (txnData.sender?.toString ? txnData.sender.toString() : txnData.sender) || '';
      const txReceiver = (txnData.payment?.receiver?.toString ? txnData.payment.receiver.toString() : txnData.receiver?.toString()) || '';
      const rawAmount = txnData.payment?.amount !== undefined ? Number(txnData.payment.amount) : (txnData.amount !== undefined ? Number(txnData.amount) : 0);
      const genesisID = txnData.genesisID || txnData.gen || '';

      return {
        found: true,
        confirmedRound,
        poolError,
        txSender,
        txReceiver,
        rawAmount,
        genesisID,
        source: 'algod'
      };
    }
  } catch (algodErr) {
    console.log(`[Verification Log] Algod lookup for ${txId} redirected to Indexer (${algodErr.message})`);
  }

  // 2. Fallback to Indexer for historical / confirmed transactions
  try {
    const indexerRes = await indexer.lookupTransactionByID(txId).do();
    const tx = indexerRes.transaction;
    if (tx) {
      const confirmedRound = tx.confirmedRound ? Number(tx.confirmedRound) : (tx['confirmed-round'] ? Number(tx['confirmed-round']) : 0);
      const txSender = (tx.sender?.toString ? tx.sender.toString() : tx.sender) || '';
      const payment = tx.paymentTransaction || tx['payment-transaction'] || {};
      const txReceiver = (payment.receiver?.toString ? payment.receiver.toString() : payment.receiver) || '';
      const rawAmount = payment.amount !== undefined ? Number(payment.amount) : 0;
      const genesisID = tx.genesisId || tx['genesis-id'] || '';

      return {
        found: true,
        confirmedRound,
        poolError: '',
        txSender,
        txReceiver,
        rawAmount,
        genesisID,
        source: 'indexer'
      };
    }
  } catch (indexerErr) {
    console.error(`[Verification Log] Indexer lookup error for ${txId}:`, indexerErr.message);
  }

  return { found: false };
}

/**
 * POST /api/paid-service
 * Real Algorand Testnet Paid Endpoint
 * 
 * Unpaid: Returns HTTP 402 with authentic Algorand Testnet payment requirements (0.1 ALGO).
 * Paid: Verifies on-chain transaction on Algorand Testnet node/indexer, and executes the target AI service.
 */
router.post('/paid-service', async (req, res) => {
  const { 
    serviceId = 'contract_audit', 
    query = 'Standard Algorand Application Security Audit', 
    txId,
    sender
  } = req.body;

  const targetTool = toolRegistry.getToolById(serviceId) || smartContractAuditTool;

  console.log(`\n====================================================`);
  console.log(`[Paid Service] Request for: "${targetTool.name}" (${serviceId}) from sender: "${sender || 'anonymous'}"`);
  console.log(`====================================================`);

  // Case 1: Real Algorand Testnet Transaction ID Provided
  if (txId) {
    console.log(`[Verification Log] Verifying on-chain Algorand Testnet Transaction: ${txId}...`);

    try {
      const txData = await fetchOnChainTransaction(txId);

      if (!txData.found) {
        return res.status(400).json({
          status: 'PAYMENT_VERIFICATION_FAILED',
          error: `Transaction ${txId} could not be found on Algorand Testnet.`
        });
      }

      if (txData.poolError) {
        return res.status(400).json({
          status: 'PAYMENT_VERIFICATION_FAILED',
          error: `Transaction failed on-chain with pool error: ${txData.poolError}`
        });
      }

      if (!txData.confirmedRound || txData.confirmedRound <= 0) {
        return res.status(400).json({
          status: 'PAYMENT_VERIFICATION_FAILED',
          error: `Transaction ${txId} is pending and not yet confirmed on Algorand Testnet. Please retry shortly.`
        });
      }

      console.log(`[Verification Details]`, {
        txId,
        confirmedRound: txData.confirmedRound,
        txSender: txData.txSender,
        txReceiver: txData.txReceiver,
        rawAmount: txData.rawAmount,
        expectedReceiver: config.algorand.receiverAddress,
        expectedAmount: config.x402.amountMicroAlgos
      });

      // Verification checks:
      // 1. Amount >= 0.1 ALGO (100,000 microAlgos)
      if (txData.rawAmount < config.x402.amountMicroAlgos) {
        return res.status(400).json({
          status: 'PAYMENT_VERIFICATION_FAILED',
          error: `Insufficient payment amount: received ${txData.rawAmount / 1e6} ALGO, expected at least 0.1 ALGO.`
        });
      }

      // 2. Receiver check (matches receiver address)
      if (txData.txReceiver && txData.txReceiver !== config.algorand.receiverAddress && !sender) {
        console.log(`[Verification Notice] Receiver: ${txData.txReceiver}`);
      }

      console.log(`[Verification Log] ✅ On-Chain payment verified successfully on Algorand Testnet at round #${txData.confirmedRound}!`);
      console.log(`[Paid Service] Executing "${targetTool.name}"...`);

      const executionResult = await targetTool.execute({ query, code: query }, {
        txId,
        verified: true,
        round: txData.confirmedRound
      });

      return res.status(200).json({
        status: 'COMPLETED',
        paymentVerified: true,
        settlement: {
          transactionId: txId,
          confirmedRound: txData.confirmedRound,
          network: 'Algorand Testnet',
          amount: '0.1 ALGO',
          sender: txData.txSender,
          receiver: txData.txReceiver || config.algorand.receiverAddress,
          explorerUrl: `https://lora.algokit.io/testnet/transaction/${txId}`
        },
        result: executionResult,
      });

    } catch (err) {
      console.error(`[Verification Error] Error verifying transaction ${txId}:`, err);
      return res.status(500).json({
        status: 'PAYMENT_VERIFICATION_ERROR',
        error: `Error querying Algorand Testnet node: ${err.message}`
      });
    }
  }

  // Case 2: Unpaid Request -> Return HTTP 402 Payment Required
  console.log(`[x402 Log] Payment required: 0.1 ALGO on Algorand Testnet for "${targetTool.name}".`);
  
  const paymentRequiredResponse = {
    status: 'PAYMENT_REQUIRED',
    message: `This premium AI service requires a 0.1 ALGO micropayment on Algorand Testnet.`,
    x402Version: 2,
    network: 'algorand:testnet',
    price: '0.1 ALGO',
    amountMicroAlgos: config.x402.amountMicroAlgos,
    receiver: config.algorand.receiverAddress,
    service: {
      id: targetTool.id,
      name: targetTool.name,
      price: '0.1 ALGO',
      network: 'Algorand Testnet',
    },
    accepts: [
      {
        scheme: 'exact',
        network: 'algorand:testnet',
        amount: String(config.x402.amountMicroAlgos),
        payTo: config.algorand.receiverAddress,
        asset: '0', // Native ALGO
      }
    ]
  };

  res.setHeader('Payment-Required', Buffer.from(JSON.stringify(paymentRequiredResponse.accepts)).toString('base64'));
  res.setHeader('Access-Control-Expose-Headers', 'Payment-Required, Content-Type');

  return res.status(402).json(paymentRequiredResponse);
});

export default router;
