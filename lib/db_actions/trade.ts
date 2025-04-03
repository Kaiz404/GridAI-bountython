import dbConnect from "../database";
import Trade, { ITrade, Side } from "../database/models/trade.model";
import { Types } from "mongoose";

export async function createTrade(
  tradeData: Omit<ITrade, "_id" | "createdAt" | "updatedAt">
): Promise<ITrade> {
  await dbConnect();
  const trade = await Trade.create(tradeData);
  return trade.toObject();
}

export async function getTradeById(id: string): Promise<ITrade | null> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  
  const trade = await Trade.findById(id);
  return trade ? trade.toObject() : null;
}

export async function getTradesByGridId(
  gridId: string,
  options: {
    limit?: number;
    skip?: number;
    sort?: { [key: string]: 1 | -1 };
  } = {}
): Promise<ITrade[]> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(gridId)) {
    return [];
  }
  
  const { limit = 100, skip = 0, sort = { createdAt: -1 } } = options;
  
  const trades = await Trade.find({ gridId })
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  return trades.map(trade => trade.toObject());
}

export async function updateTrade(
  id: string,
  updateData: Partial<Omit<ITrade, "_id" | "createdAt" | "updatedAt">>
): Promise<ITrade | null> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  
  const trade = await Trade.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
  
  return trade ? trade.toObject() : null;
}

export async function deleteTrade(id: string): Promise<boolean> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  
  const result = await Trade.findByIdAndDelete(id);
  return !!result;
}

export async function getTradeSummaryByGridId(gridId: string): Promise<{
  totalBuys: number;
  totalSells: number;
  totalProfit: number;
}> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(gridId)) {
    return { totalBuys: 0, totalSells: 0, totalProfit: 0 };
  }
  
  const [buys, sells, profitResult] = await Promise.all([
    Trade.countDocuments({ gridId, side: Side.BUY }),
    Trade.countDocuments({ gridId, side: Side.SELL }),
    Trade.aggregate([
      { $match: { gridId: new Types.ObjectId(gridId), profit: { $exists: true, $ne: null } } },
      { $group: { _id: null, totalProfit: { $sum: "$profit" } } }
    ])
  ]);
  
  const totalProfit = profitResult.length > 0 ? profitResult[0].totalProfit : 0;
  
  return {
    totalBuys: buys,
    totalSells: sells,
    totalProfit
  };
}

export async function getRecentTrades(
  limit: number = 10
): Promise<ITrade[]> {
  await dbConnect();
  
  const trades = await Trade.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('gridId', 'inputToken outputToken');
  
  return trades.map(trade => trade.toObject());
}