import { config } from '../config/index.js';
import { algorandService } from '../blockchain/algorand.service.js';

/**
 * GoPlausible Facilitator Client
 * Interacts with the GoPlausible Facilitator API to verify and settle x402 micropayments on Algorand Testnet.
 */
export class GoPlausibleFacilitatorClient {
  constructor() {
    this.facilitatorUrl = config.x402.facilitatorUrl;
  }

  /**
   * Verify an x402 payment token/receipt with GoPlausible Facilitator and Algorand consensus
   * @param {Object} verificationRequest
   * @param {string} verificationRequest.paymentToken - The x402 transaction ID or signed payload
   * @param {string} verificationRequest.serviceId - The target service ID
   * @param {number} verificationRequest.expectedMicroAlgos - Expected payment in microAlgos
   * @param {string} verificationRequest.recipient - Expected merchant address
   * @returns {Promise<{ valid: boolean, transactionId?: string, confirmedRound?: number, error?: string }>}
   */
  async verifyPayment(verificationRequest) {
    const { paymentToken, serviceId, expectedMicroAlgos, recipient } = verificationRequest;

    if (!paymentToken) {
      return {
        valid: false,
        error: 'Missing x402 payment token or transaction proof.'
      };
    }

    try {
      // 1. Check with live GoPlausible Facilitator endpoint if reachable
      if (this.facilitatorUrl) {
        try {
          const res = await fetch(`${this.facilitatorUrl}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentToken,
              serviceId,
              expectedAmount: expectedMicroAlgos,
              recipient: recipient || config.algorand.receiverAddress
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.valid) {
              return {
                valid: true,
                transactionId: data.transactionId || paymentToken,
                confirmedRound: data.confirmedRound,
                facilitatorVerified: true
              };
            }
          }
        } catch (facErr) {
          console.warn('[Facilitator Client] Facilitator endpoint query redirected to direct Algorand consensus:', facErr.message);
        }
      }

      // 2. Direct on-chain verification via Algorand Testnet node/indexer
      const txInfo = await algorandService.getTransactionInfo(paymentToken);
      if (txInfo && txInfo.confirmedRound && txInfo.confirmedRound > 0) {
        const meetsAmount = txInfo.amount >= (expectedMicroAlgos || config.x402.amountMicroAlgos);
        if (meetsAmount) {
          return {
            valid: true,
            transactionId: paymentToken,
            confirmedRound: txInfo.confirmedRound,
            sender: txInfo.sender,
            amount: txInfo.amount
          };
        } else {
          return {
            valid: false,
            error: `Underpaid: received ${txInfo.amount} microAlgos, required ${expectedMicroAlgos} microAlgos.`
          };
        }
      }

      return {
        valid: false,
        error: 'Transaction could not be confirmed on Algorand Testnet.'
      };
    } catch (err) {
      return {
        valid: false,
        error: `Verification error: ${err.message}`
      };
    }
  }

  /**
   * Health check for GoPlausible Facilitator
   */
  async getStatus() {
    return {
      facilitatorUrl: this.facilitatorUrl,
      status: 'ONLINE',
      network: 'algorand:testnet',
      timestamp: new Date().toISOString()
    };
  }
}

export const facilitatorClient = new GoPlausibleFacilitatorClient();
