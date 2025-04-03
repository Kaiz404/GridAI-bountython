import * as dotenv from "dotenv";

dotenv.config();

// Token interface definitions
interface QuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps: number;
}

interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  outAmount: string;
}

/**
 * Get a swap quote from Jupiter API
 */
export default async function getJupiterQuote(params: QuoteParams): Promise<QuoteResponse> {
  try {
    const baseUrl = "https://api.jup.ag/swap/v1";
    const url = new URL(`${baseUrl}/quote`);
    
    // Add search parameters
    url.searchParams.append("inputMint", params.inputMint);
    url.searchParams.append("outputMint", params.outputMint);
    url.searchParams.append("amount", params.amount.toString());
    url.searchParams.append("slippageBps", params.slippageBps.toString());
    url.searchParams.append("restrictIntermediateTokens", "true");

    // Fetch the quote from Jupiter API
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: QuoteResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
}

// Common token addresses for convenience
export const TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  // Add more tokens as needed
};


// Example function to get a quote
async function exampleQuoteUsage() {
    // Define quote parameters
    const quoteParams = {
      inputMint: TOKENS.SOL,
      outputMint: TOKENS.USDC,
      amount: 10000000, // 0.01 SOL
      slippageBps: 100, // 1% slippage
    };
  
    try {
      // Call the quote function
      const quote = await getJupiterQuote(quoteParams);
      
      // Log the response
      console.log("Quote Response:");
      console.log(JSON.stringify(quote, null, 2));
      
      // Display the expected output amount
      if (quote.outAmount) {
        const outAmount = quote.outAmount;
        console.log(`Expected output: ${outAmount} USDC (in smallest units)`);
        
        // Convert to human-readable format (USDC has 6 decimals)
        const readableAmount = Number(outAmount) / 1_000_000;
        console.log(`Expected output: ${readableAmount} USDC`);
      }
      
      return quote;
    } catch (error) {
      console.error("Failed to get quote:", error);
      throw error;
    }
  }
  
  // Run the example
  exampleQuoteUsage().catch(console.error);