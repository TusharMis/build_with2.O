import { x402Client } from '@x402/core/client';
import { ExactAvmScheme } from '@x402/avm/exact/client';

/**
 * Real Frontend x402 Client Implementation
 * Integrates @x402/core & @x402/avm with Algorand Testnet.
 */
export const x402PaymentClient = {
  /**
   * Constructs and cryptographically signs an x402 payment payload for Algorand Testnet
   * @param {Object} paymentRequiredResponse - The 402 response from backend ({ x402Version, accepts })
   * @param {Object} walletSigner - The ClientAvmSigner from walletService
   */
  async createPaymentPayload(paymentRequiredResponse, walletSigner) {
    if (!walletSigner) {
      throw new Error('No Algorand wallet connected to sign the x402 payment.');
    }

    if (!paymentRequiredResponse || !paymentRequiredResponse.accepts) {
      throw new Error('Invalid x402 payment requirements received from server.');
    }

    console.log('[x402 Client] Initializing x402Client with ExactAvmScheme...');
    const client = new x402Client();
    const avmScheme = new ExactAvmScheme(walletSigner);
    client.register('algorand:*', avmScheme);

    console.log('[x402 Client] Creating and signing payment group with fee-payer...');
    const paymentPayload = await client.createPaymentPayload({
      x402Version: paymentRequiredResponse.x402Version || 2,
      accepts: paymentRequiredResponse.accepts
    });

    console.log('[x402 Client] Payment payload generated successfully:', paymentPayload);

    return {
      paymentPayload,
      paymentRequirements: paymentPayload.accepted || paymentRequiredResponse.accepts[0]
    };
  }
};
