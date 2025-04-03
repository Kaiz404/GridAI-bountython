import { model, models, Schema, Model, Types } from "mongoose";

export enum Side {
  BUY = "BUY",
  SELL = "SELL"
}

export interface ITrade {
  _id: string;
  gridId: Types.ObjectId | string; // Reference to the Grid
  side: Side;
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  outputAmount: number;
  gridLevel: number;
  executedAt?: Date;
  transactionHash?: string; // If you're using blockchain
  profit?: number; // For SELL trades, calculated profit
  createdAt: Date;
  updatedAt: Date;
}

const tradeSchema = new Schema<ITrade>(
  {
    gridId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Grid', 
      required: true 
    },
    side: { 
      type: String, 
      enum: Object.values(Side), 
      required: true 
    },
    inputToken: { 
      type: String, 
      required: true 
    },
    outputToken: { 
      type: String, 
      required: true 
    },
    inputAmount: { 
      type: Number, 
      required: true 
    },
    outputAmount: { 
      type: Number, 
      required: true 
    },
    gridLevel: { 
      type: Number, 
      required: true 
    },
    executedAt: { 
      type: Date 
    },
    transactionHash: { 
      type: String 
    },
    profit: { 
      type: Number 
    },
  },
  { 
    timestamps: true 
  }
);

// Index for faster queries
tradeSchema.index({ gridId: 1, createdAt: -1 });
tradeSchema.index({ status: 1 });

const Trade: Model<ITrade> = models.Trade || model<ITrade>('Trade', tradeSchema);

export default Trade;