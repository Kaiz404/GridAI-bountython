import { Keypair, VersionedTransaction, Connection } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";

dotenv.config();

// Required interfaces
interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  outAmount: string;
}

interface ExecuteResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
  computeUnitLimit?: number;
  prioritizationType: {
    computeBudget: {
      microLamports: number;
      estimatedMicroLamports: number;
    };
  };
  dynamicSlippageReport: {
    slippageBps: number;
    otherAmount: number;
    simulatedIncurredSlippageBps: number;
    amplificationRatio: string;
    categoryName: string;
    heuristicMaxSlippageBps: number;
  };
  simulationError: string | null;
}

/**
 * Execute a swap transaction using Jupiter API
 * @param quote The quote response from Jupiter
 * @param walletPrivateKey Base58-encoded private key for the wallet
 * @returns Transaction signature if successful
 */
export default async function executeJupiterSwap(
  quote: QuoteResponse,
  walletPrivateKey: string
): Promise<string> {
  try {
    // Verify we have a valid quote
    if (!quote.outAmount) {
      throw new Error("No outAmount found in quote response");
    }

    // Create wallet from private key
    const secretKey = bs58.decode(walletPrivateKey);
    const wallet = Keypair.fromSecretKey(secretKey);
    console.log("Using wallet public key:", wallet.publicKey.toBase58());

    // Get swap transaction
    const executeResponse = await buildSwapTransaction(
      quote,
      wallet.publicKey.toBase58()
    );

    if (executeResponse.simulationError !== null) {
      throw new Error(`Swap simulation failed: ${executeResponse.simulationError}`);
    }

    console.log("Swap transaction built successfully");

    // Set up connection to Solana
    const connection = new Connection(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
      "confirmed"
    );

    // Process and send the transaction
    const signature = await sendSwapTransaction(
      executeResponse.swapTransaction,
      wallet,
      connection
    );

    return signature;
  } catch (error) {
    console.error("Failed to execute swap:", error);
    throw error;
  }
}

/**
 * Build the swap transaction using Jupiter API
 */
async function buildSwapTransaction(
  quoteResponse: QuoteResponse,
  userPublicKey: string
): Promise<ExecuteResponse> {
  try {
    const baseUrl = "https://api.jup.ag/swap/v1";
    const response = await fetch(`${baseUrl}/swap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        dynamicComputeUnitLimit: true, // Estimate compute units dynamically
        dynamicSlippage: true, // Estimate slippage dynamically
        // Priority fee optimization
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: 1000000, // Cap fee at 0.001 SOL
            global: false, // Use local fee market for better estimation
            priorityLevel: "veryHigh", // veryHigh === 75th percentile for better landing
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ExecuteResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error building transaction:", error);
    throw error;
  }
}

/**
 * Send the swap transaction to the Solana network
 */
async function sendSwapTransaction(
  swapTransactionBase64: string, 
  wallet: Keypair, 
  connection: Connection
): Promise<string> {
  // 1. Deserialize the transaction from base64 format
  const transactionBinary = Buffer.from(swapTransactionBase64, "base64");
  const transaction = VersionedTransaction.deserialize(transactionBinary);

  // 2. Sign the transaction with the wallet
  transaction.sign([wallet]);

  // 3. Serialize the transaction back to binary format
  const signedTransactionBinary = transaction.serialize();

  // 4. Send the transaction to the Solana network with optimized parameters
  console.log("Sending transaction to Solana network...");
  const signature = await connection.sendRawTransaction(signedTransactionBinary, {
    maxRetries: 2, // Increase retries for better chance of landing
    skipPreflight: true, // Skip preflight checks to avoid false negatives
  });

  // 5. Log transaction info
  console.log(`Transaction sent with signature: ${signature}`);
  console.log(`Check transaction status at: https://solscan.io/tx/${signature}/`);

  // 6. Confirm the transaction
  const confirmation = await connection.confirmTransaction(
    signature,
    "processed" // Use "processed" instead of "confirmed" for faster initial confirmation
  );

  if (confirmation.value.err) {
    console.error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
    throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
  } else {
    console.log(`Transaction successful: https://solscan.io/tx/${signature}/`);
  }

  return signature;
}

import getJupiterQuote from "./getQuote"; // Import the getJupiterQuote function

// Example usage of the executeJupiterSwap function
async function executeSwapExample() {
  try {
    // 1. First get a quote (assuming you have the getJupiterQuote function)
    const quote = await getJupiterQuote({
      inputMint: "So11111111111111111111111111111111111111112", // SOL
      outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      amount: 10000000, // 0.01 SOL
      slippageBps: 100, // 1% slippage
    });
    
    console.log("Quote received:", quote);
    
    // 2. Make sure you have your private key in .env file
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Please set SOLANA_PRIVATE_KEY in your .env file");
    }
    
    // 3. Execute the swap with the quote and private key
    const txSignature = await executeJupiterSwap(quote, privateKey);
    
    console.log("Swap completed successfully!");
    console.log(`Transaction: https://solscan.io/tx/${txSignature}`);
    
    return txSignature;
  } catch (error) {
    console.error("Swap execution failed:", error);
    throw error;
  }
}

// Run the example
executeSwapExample().catch(console.error);