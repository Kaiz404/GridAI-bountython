import { Tool } from "langchain/tools";
import { getGrids } from "../db_actions/grid";

/**
 * A LangChain tool that allows fetching grid trading configurations
 */
export class GetGridsTool extends Tool {
  name = "get_grids";
  description = `Fetch existing grid trading configurations.
  
  This tool retrieves information about grid trading strategies that have been created.
  
  Inputs (input is a JSON string):
  limit: number - Optional limit on the number of results (default: 100)
  
  Example: 
  {
    "limit": 10
  }`;

  constructor() {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input || "{}");
      
      // Extract parameters
      const { active, limit } = parsedInput;
      
      const options: {
        limit?: number;
      } = {};
      
      if (limit !== undefined && typeof limit === 'number') {
        options.limit = limit;
      }

      // Fetch grids from database
      const grids = await getGrids(options);
      
      // Format the response
      const formattedGrids = grids.map(grid => ({
        id: grid._id,
        sourceToken: grid.sourceTokenId,
        targetToken: grid.targetTokenId,
        upperLimit: grid.upperLimit,
        lowerLimit: grid.lowerLimit,
        gridCount: grid.gridCount,
        quantityInvested: grid.quantityInvested,
        totalBuys: grid.totalBuys,
        totalSells: grid.totalSells,
        currentValue: grid.currentValue,
        currentPrice: grid.currentPrice,
        profit: grid.totalSells - grid.totalBuys,
        createdAt: new Date(grid.createdAt).toISOString()
      }));
      
      // Return success response
      return JSON.stringify({
        status: "success",
        count: formattedGrids.length,
        grids: formattedGrids
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: `Failed to fetch grid strategies: ${error.message}`,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}