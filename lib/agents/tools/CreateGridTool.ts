import { Tool } from "langchain/tools";
import { Types } from "mongoose";
import dbConnect from "../../database";
import { IGrid } from "../../database/models/grid.model";
import Grid from "../../database/models/grid.model";
import { createGrid } from "@/lib/db_actions/grid";
import { addressToSymbolMap } from "@/lib/tokenSymbols";
import { addressToLogoMap } from "@/lib/tokenLogos";

/**
 * A LangChain tool that creates a new grid trading configuration
 */
export class CreateGridTool extends Tool {
  name = "create_grid";
  description = `Create a new grid trading strategy.
  
  This tool creates a new grid trading configuration for automated trading between a range of prices.
  
  Inputs (JSON string with the following properties):
  - sourceTokenId: string - The token ID to sell (e.g. "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"), the user does not need to fill this in, by default it is solana "So11111111111111111111111111111111111111112"
  - targetTokenId: string - The token ID to buy (e.g. "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  - upperLimit: number - The upper price limit for the grid
  - lowerLimit: number - The lower price limit for the grid
  - gridCount: number - The number of grid levels to create
  - quantityInvested: number - The amount of source token to invest in this grid
  - active: boolean - Whether the grid should be active immediately
  - currentPrice: number - The current price of the target token in terms of the source token
  
  Example input:
  {
    "sourceTokenId": "So11111111111111111111111111111111111111112",
    "targetTokenId": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "upperLimit": 100,
    "lowerLimit": 90,
    "gridCount": 10,
    "quantityInvested": 1000,
    "active": true,
    "currentPrice": 95
  }`;

  constructor() {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      // Parse the input JSON
      const parsedInput = JSON.parse(input);
      
      // Validate required fields
      const requiredFields = [
        "targetTokenId", "upperLimit", 
        "lowerLimit", "gridCount", "quantityInvested", "currentPrice"
      ];
      
      for (const field of requiredFields) {
        if (parsedInput[field] === undefined) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate numeric fields
      const numericFields = ["upperLimit", "lowerLimit", "gridCount", "quantityInvested", "currentPrice"];
      for (const field of numericFields) {
        if (isNaN(Number(parsedInput[field]))) {
          throw new Error(`Field ${field} must be a number`);
        }
      }

      // Validate grid constraints
      if (parsedInput.upperLimit <= parsedInput.lowerLimit) {
        throw new Error("Upper limit must be greater than lower limit");
      }
      
      if (parsedInput.gridCount <= 0) {
        throw new Error("Grid count must be greater than 0");
      }

      // Set default source token ID to Solana if not provided
      const sourceTokenId = parsedInput.sourceTokenId || "So11111111111111111111111111111111111111112";
      
      // Get token symbols from address map or use defaults
      const sourceTokenSymbol = addressToSymbolMap[sourceTokenId] || "SOL";
      const targetTokenSymbol = addressToSymbolMap[parsedInput.targetTokenId] || "Unknown";

      // Create the grid
      const createdGrid = await createGrid({
        sourceTokenId: sourceTokenId,
        targetTokenId: parsedInput.targetTokenId,
        sourceTokenSymbol: sourceTokenSymbol,
        targetTokenSymbol: targetTokenSymbol,
        upperLimit: Number(parsedInput.upperLimit),
        lowerLimit: Number(parsedInput.lowerLimit),
        gridCount: Number(parsedInput.gridCount),
        quantityInvested: Number(parsedInput.quantityInvested),
        currentPrice: Number(parsedInput.currentPrice),
        profit: 0, // Initialize profit as 0
        levels: parsedInput.levels || {} // Ensure levels is an object if not provided
      });

      // Return success response
      return JSON.stringify({
        status: "success",
        message: "Grid trading strategy created successfully",
        gridId: createdGrid._id,
        details: {
          sourceTokenId: createdGrid.sourceTokenId,
          sourceTokenSymbol: createdGrid.sourceTokenSymbol,
          targetTokenId: createdGrid.targetTokenId,
          targetTokenSymbol: createdGrid.targetTokenSymbol,
          upperLimit: createdGrid.upperLimit,
          lowerLimit: createdGrid.lowerLimit,
          gridCount: createdGrid.gridCount,
          levels: Object.keys(createdGrid.levels || {}).length
        }
      });
    } catch (error: any) {
      // Return error response
      return JSON.stringify({
        status: "error",
        message: `Failed to create grid: ${error.message}`,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}