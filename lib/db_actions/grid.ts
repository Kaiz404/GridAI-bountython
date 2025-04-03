'use server';

import dbConnect from "../database";
import Grid, { IGrid } from "../database/models/grid.model";
import { Types } from "mongoose";

export async function createGrid(
  gridData: Omit<IGrid, "_id" | "totalBuys" | "totalSells" | "currentValue" | "levels" | 
    "currentPrice" | "currentGridIndex" | "sourceTokenAmount" | "targetTokenAmount" | 
    "createdAt" | "updatedAt"> & 
  { levels?: Record<string, number> }
): Promise<IGrid> {
  await dbConnect();
  
  // Calculate grid levels if not provided
  if (!gridData.levels || Object.keys(gridData.levels).length === 0) {
    const levels: Record<number, number> = {};
    const { upperLimit, lowerLimit, gridCount } = gridData;
    
    const step = (upperLimit - lowerLimit) / gridCount;
    
    for (let i = 0; i <= gridCount; i++) {
      const price = lowerLimit + (step * i);
      levels[i] = price;
    }
    
    gridData.levels = levels;
  }
  
  const grid = await Grid.create({
    _id: new Types.ObjectId().toString(), // Generate a string ID
    ...gridData,
    totalBuys: 0,
    totalSells: 0,
    currentValue: 0,
    currentPrice: null,
    currentGridIndex: null,
    sourceTokenAmount: null,
    targetTokenAmount: null
    // createdAt and updatedAt will be handled by the schema
  });
  
  return grid.toObject();
}

export async function getGridById(id: string): Promise<IGrid | null> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  
  const grid = await Grid.findById(id);
  return grid ? grid.toObject() : null;
}

export async function getGrids(
  options: {
    active?: boolean;
    limit?: number;
    skip?: number;
    sort?: { [key: string]: 1 | -1 };
  } = {}
): Promise<IGrid[]> {
  await dbConnect();
  
  const { active, limit = 100, skip = 0, sort = { _id: -1 } } = options;
  
  // Build query
  const query: { active?: boolean } = {};
  if (active !== undefined) {
    query.active = active;
  }
  
  const grids = await Grid.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  return grids.map(grid => grid.toObject());
}

export async function updateGrid(
  id: string,
  updateData: Partial<Omit<IGrid, "_id">>
): Promise<IGrid | null> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  
  const grid = await Grid.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
  
  return grid ? grid.toObject() : null;
}

export async function deleteGrid(id: string): Promise<boolean> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  
  const result = await Grid.findByIdAndDelete(id);
  return !!result;
}

export async function updateGridCurrentPrice(
  id: string,
  currentPrice: number
): Promise<IGrid | null> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  
  // Get the grid to find the appropriate grid index
  const grid = await Grid.findById(id);
  
  if (!grid) {
    return null;
  }
  
  // Find the current grid index based on price
  let currentGridIndex: number | null = null;
  
  const levels = Object.entries(grid.levels)
    .map(([key, value]) => ({ index: parseInt(key), price: value }))
    .sort((a, b) => a.price - b.price);
  
  for (let i = 0; i < levels.length - 1; i++) {
    if (currentPrice >= levels[i].price && currentPrice < levels[i + 1].price) {
      currentGridIndex = levels[i].index;
      break;
    }
  }
  
  // Update the grid with the new price and index
  const updatedGrid = await Grid.findByIdAndUpdate(
    id,
    { 
      $set: { 
        currentPrice,
        currentGridIndex
      } 
    },
    { new: true }
  );
  
  return updatedGrid ? updatedGrid.toObject() : null;
}

export async function activateGrid(id: string): Promise<IGrid | null> {
  return updateGrid(id, { active: true });
}

export async function deactivateGrid(id: string): Promise<IGrid | null> {
  return updateGrid(id, { active: false });
}

export async function updateGridProfit(
  id: string,
  profitAmount: number
): Promise<IGrid | null> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  
  const grid = await Grid.findByIdAndUpdate(
    id,
    { $inc: { totalProfit: profitAmount } },
    { new: true }
  );
  
  return grid ? grid.toObject() : null;
}

export async function incrementGridTrades(
  id: string, 
  { buys = 0, sells = 0 }: { buys?: number, sells?: number }
): Promise<IGrid | null> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  
  const updateObj: { totalBuys?: number, totalSells?: number } = {};
  
  if (buys > 0) {
    updateObj.totalBuys = buys;
  }
  
  if (sells > 0) {
    updateObj.totalSells = sells;
  }
  
  const grid = await Grid.findByIdAndUpdate(
    id,
    { $inc: updateObj },
    { new: true }
  );
  
  return grid ? grid.toObject() : null;
}

export async function getActiveGridsCount(): Promise<number> {
  await dbConnect();
  return Grid.countDocuments({ active: true });
}

export async function getTotalProfitAcrossGrids(): Promise<number> {
  await dbConnect();
  
  const result = await Grid.aggregate([
    { $group: { _id: null, totalProfit: { $sum: "$totalProfit" } } }
  ]);
  
  return result.length > 0 ? result[0].totalProfit : 0;
}