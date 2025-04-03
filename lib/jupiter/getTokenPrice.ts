/**
 * Gets prices for the specified token IDs from Jupiter API
 * @param tokenIds Array of token mint addresses to fetch prices for
 * @returns Token price data or null if request fails
 */
export async function getTokenPrices(tokenIds: string[]): Promise<any> {
    try {
      // Join token IDs with commas for the API parameter
      const tokenIdsParam = tokenIds.join(',');
      
      // Make API request
      const priceResponse = await fetch(
        `https://api.jup.ag/price/v2?ids=${tokenIdsParam}`
      );
      
      // Check if the response is OK
      if (!priceResponse.ok) {
        throw new Error(`API returned ${priceResponse.status}: ${priceResponse.statusText}`);
      }
      
      // Parse the JSON response
      const priceData = await priceResponse.json();
      
      return {
        success: true,
        data: priceData,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Error fetching token prices:', error.message);
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
  
// // Example usage (commented out to prevent top-level await error):

// async function example() {
//   const prices = await getTokenPrices([
//     'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',  // JUPITER COIN 
//     'So11111111111111111111111111111111111111112'   // SOLANA COIN  
//   ]);
//   console.log(JSON.stringify(prices, null, 2));
// }

// // Run the example if needed
// example();
