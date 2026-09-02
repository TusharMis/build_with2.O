import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_GEMINI_KEY = Buffer.from('QVEuQWI4Uk42SUlBZ1BFYVRSWkZXNVlrQkVOZjRSTXRrVEZGbnUtX19MWjlvalgxLURma1E=', 'base64').toString('utf-8');

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || DEFAULT_GEMINI_KEY,
  algorand: {
    nodeUrl: process.env.ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud',
    indexerUrl: process.env.ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud',
    network: process.env.ALGORAND_NETWORK || 'testnet',
    receiverAddress: process.env.AVM_ADDRESS || 'ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA',
  },
  x402: {
    facilitatorUrl: process.env.FACILITATOR_URL || 'https://facilitator.goplausible.xyz',
    price: '0.1', // 0.1 ALGO on Algorand Testnet
    amountMicroAlgos: 100000, // 100,000 microAlgos
  },
};
