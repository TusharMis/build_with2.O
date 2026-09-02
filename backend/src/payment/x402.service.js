import { x402ResourceServer, HTTPFacilitatorClient } from '@x402/core/server';
import { ExactAvmScheme } from '@x402/avm/exact/server';
import { ALGORAND_TESTNET_CAIP2 } from '@x402/avm';
import { encodePaymentRequiredHeader } from '@x402/core/http';
import { config } from '../config/index.js';

export const AVM_TESTNET_NETWORKS = [
  'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
  ALGORAND_TESTNET_CAIP2, // 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe'
];

/**
 * Real x402 Payment Service using official @x402/core & @x402/avm
 * with GoPlausible Facilitator on Algorand Testnet.
 */
export class X402PaymentService {
  constructor() {
    this.facilitatorUrl = config.x402.facilitatorUrl;
    this.receiverAddress = config.algorand.receiverAddress;
    this.defaultPrice = config.x402.price;
    this.defaultAssetId = config.x402.assetId;

    this.facilitatorClient = new HTTPFacilitatorClient({ url: this.facilitatorUrl });
    this.server = new x402ResourceServer(this.facilitatorClient);
    this.isInitialized = false;

    // Register AVM Exact scheme for Algorand Testnet
    const avmScheme = new ExactAvmScheme();
    for (const net of AVM_TESTNET_NETWORKS) {
      this.server.register(net, avmScheme);
    }
  }

  /**
   * Initializes facilitator connectivity and supported network kinds
   */
  async initialize() {
    if (this.isInitialized) return;
    try {
      console.log(`[x402 Server] Connecting to GoPlausible Facilitator at ${this.facilitatorUrl}...`);
      await this.server.initialize();
      this.isInitialized = true;
      console.log(`[x402 Server] Successfully initialized with GoPlausible Facilitator for Algorand Testnet!`);
    } catch (err) {
      console.error(`[x402 Server] Initialization warning:`, err.message);
    }
  }

  /**
   * Builds official x402 payment requirements for a paid service
   * @param {Object} options
   */
  async buildRequirements(options = {}) {
    await this.initialize();

    const price = options.price || this.defaultPrice;
    const asset = options.assetId || this.defaultAssetId;
    const network = options.network || AVM_TESTNET_NETWORKS[0];
    const payTo = options.payTo || this.receiverAddress;

    console.log(`[x402 Log] Payment requirements generated for service:`, {
      network,
      payTo,
      price,
      asset,
    });

    const accepts = await this.server.buildPaymentRequirements({
      scheme: 'exact',
      network,
      payTo,
      price: String(price),
      asset: String(asset),
    });

    const paymentRequiredResponse = {
      x402Version: 2,
      accepts,
    };

    const header = encodePaymentRequiredHeader(accepts);

    return {
      response: paymentRequiredResponse,
      header,
      accepts,
    };
  }

  /**
   * Verifies and settles a submitted x402 payment payload via GoPlausible Facilitator
   * @param {Object} paymentPayload - The x402 payment payload submitted by client
   * @param {Object} paymentRequirements - The matching requirement specification
   */
  async verifyAndSettle(paymentPayload, paymentRequirements) {
    await this.initialize();

    console.log(`[x402 Log] Payment submitted for verification:`, {
      x402Version: paymentPayload?.x402Version,
      network: paymentRequirements?.network,
      payTo: paymentRequirements?.payTo,
      amount: paymentRequirements?.amount,
      asset: paymentRequirements?.asset,
    });

    try {
      // Step 1: Send payment info to GoPlausible Facilitator for verification
      const verifyResult = await this.server.verifyPayment(paymentPayload, paymentRequirements);
      console.log(`[x402 Log] Facilitator verification result:`, verifyResult);

      if (!verifyResult || !verifyResult.isValid) {
        return {
          success: false,
          verified: false,
          settled: false,
          error: verifyResult?.invalidReason || 'Facilitator payment verification failed.',
          details: verifyResult,
        };
      }

      // Step 2: Settle the verified payment with Facilitator & broadcast to Algorand Testnet
      console.log(`[x402 Log] Initiating settlement on Algorand Testnet via Facilitator...`);
      let settleResult;
      try {
        settleResult = await this.server.settlePayment(paymentPayload, paymentRequirements);
        console.log(`[x402 Log] Settlement result:`, settleResult);
      } catch (settleErr) {
        console.error(`[x402 Log] Settlement error:`, settleErr);
        // If settlement throws or returns partial, capture details
        return {
          success: false,
          verified: true,
          settled: false,
          error: `Verification passed but settlement failed: ${settleErr.message}`,
        };
      }

      const txId = settleResult?.transactionId || settleResult?.txId || settleResult?.details?.txId;
      console.log(`[x402 Log] Algorand transaction ID:`, txId);

      return {
        success: true,
        verified: true,
        settled: true,
        transactionId: txId,
        settlement: settleResult,
      };
    } catch (err) {
      console.error(`[x402 Log] Verification exception:`, err);
      return {
        success: false,
        verified: false,
        settled: false,
        error: err.message,
      };
    }
  }
}

export const x402PaymentService = new X402PaymentService();
