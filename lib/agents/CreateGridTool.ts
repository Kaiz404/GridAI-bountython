import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "solana-agent-kit";
import { createGrid as dbCreateGrid } from "../db_actions/grid";

/**
 * A LangChain tool that allows creating grid trading configurations
 */
export class CreateGridTool extends Tool {
  name = "create_grid";
  description = `Create a new grid trading configuration with specified parameters.
  
  This tool sets up a grid trading strategy between SOL and a target token with buy/sell orders at
  equally distributed price levels across the specified range.
  
  Inputs (input is a JSON string):
  targetTokenId: string - The token mint address for the target token, e.g. "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" for USDC (required)
  upperLimit: number - Upper price limit for the grid (required)
  lowerLimit: number - Lower price limit for the grid (required) 
  gridCount: number - Number of grid levels to create (minimum 2) (required)
  quantityInvested: number - Amount of SOL to invest in this grid (required)
  
  Example: 
  {
    "targetTokenId": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "upperLimit": 130,
    "lowerLimit": 100,
    "gridCount": 10,
    "quantityInvested": 0.05
  }`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);
      
      // Extract parameters
      const { targetTokenId, upperLimit, lowerLimit, gridCount, quantityInvested } = parsedInput;
      
      // Validate required parameters
      if (!targetTokenId) {
        return JSON.stringify({
          status: "error",
          message: "targetTokenId is required"
        });
      }
      
      if (typeof upperLimit !== 'number' || typeof lowerLimit !== 'number') {
        return JSON.stringify({
          status: "error",
          message: "upperLimit and lowerLimit must be numbers"
        });
      }
      
      if (upperLimit <= lowerLimit) {
        return JSON.stringify({
          status: "error",
          message: "upperLimit must be greater than lowerLimit"
        });
      }
      
      if (typeof gridCount !== 'number' || gridCount < 2) {
        return JSON.stringify({
          status: "error",
          message: "gridCount must be a number of at least 2"
        });
      }
      
      if (typeof quantityInvested !== 'number' || quantityInvested <= 0) {
        return JSON.stringify({
          status: "error",
          message: "quantityInvested must be a positive number"
        });
      }

      // Calculate grid levels
      const levels: Record<number, number> = {};
      const stepSize = (upperLimit - lowerLimit) / (gridCount - 1);

      for (let i = 0; i < gridCount; i++) {
        const price = lowerLimit + (stepSize * i);
        levels[i] = parseFloat(price.toFixed(6));
      }

      const sourceTokenId = "So11111111111111111111111111111111111111112"; // SOL

      // Create grid configuration
      const gridConfig = {
        sourceTokenId,
        targetTokenId,
        upperLimit,
        lowerLimit,
        gridCount,
        quantityInvested,
        levels
      };

      // Create the grid in the database
      const result = await dbCreateGrid(gridConfig);
      
      // Return success response
      return JSON.stringify({
        status: "success",
        message: "Grid trading strategy created successfully",
        grid: {
          id: result._id,
          sourceToken: "SOL",
          targetToken: targetTokenId,
          upperLimit,
          lowerLimit,
          gridCount,
          quantityInvested,
          gridLevels: Object.keys(levels).length,
          lowestPrice: lowerLimit,
          highestPrice: upperLimit
        }
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: `Failed to create grid strategy: ${error.message}`,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}