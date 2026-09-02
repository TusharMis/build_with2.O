/**
 * x402 Protocol Types and Header Standards for Algorand Testnet
 * 
 * Standard HTTP 402 Payment Required response payload specifications
 * compatible with @x402-avm and GoPlausible Facilitator.
 */

export const X402_HEADERS = {
  PAYMENT_REQUIRED: '402 Payment Required',
  AUTH_HEADER: 'WWW-Authenticate',
  PAYMENT_TOKEN: 'X-Payment',
  PAYMENT_RESPONSE: 'X-Payment-Response',
};

/**
 * Creates an x402 payment challenge specification
 * @param {Object} options
 * @param {string} options.serviceId
 * @param {string} options.serviceName
 * @param {number} options.costAlgo
 * @param {number} options.costMicroAlgos
 * @param {string} options.recipient
 * @param {string} options.facilitatorUrl
 * @param {string} options.network
 */
export function createPaymentChallenge({
  serviceId,
  serviceName,
  costAlgo,
  costMicroAlgos,
  recipient,
  facilitatorUrl,
  network = 'testnet'
}) {
  const nonce = `x402_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    version: '1.0',
    protocol: 'x402',
    network: `algorand:${network}`,
    service: {
      id: serviceId,
      name: serviceName,
      cost: costAlgo,
      costMicroAlgos: costMicroAlgos,
      currency: 'ALGO'
    },
    payment: {
      recipient,
      amount: costMicroAlgos, // in microAlgos
      assetId: 0, // 0 represents native ALGO
      facilitator: facilitatorUrl,
      nonce,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min validity
    },
    instructions: {
      step1: 'Sign an Algorand Testnet payment transaction transferring the exact amount to recipient.',
      step2: 'Submit signed transaction or proof to the GoPlausible Facilitator or include signed txId in X-Payment header.',
      step3: 'Retry the request with the x402 payment header.'
    }
  };
}
