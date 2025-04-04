import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ITrade } from "@/lib/database/models/trade.model";
import { Types } from "mongoose";

// interface ActivityCardProps {
//   id: number
//   type: "buy" | "sell"
//   amount: number
//   item: string
//   date: string
//   time: string
//   compact?: boolean
// }

export function ActivityCard({
  _id,
  side,
  inputAmount,
  inputToken,
  executedAt,
  transactionHash,
  compact = false,
}: ITrade & { compact?: boolean }) {
  return (
    <Card
      key={_id}
      className={`p-3 bg-[#333333] border-[#444444] hover:bg-[#3a3a3a] transition-colors`}
    >
      <div className="flex items-center">
        <div
          className={`p-2 rounded-full mr-4 ${
            side === "BUY" ? "bg-blue-500/20" : "bg-green-500/20"
          }`}
        >
          {side === "BUY" ? (
            <ArrowDown
              className={`h-${compact ? "4" : "5"} w-${
                compact ? "4" : "5"
              } text-blue-500`}
            />
          ) : (
            <ArrowUp
              className={`h-${compact ? "4" : "5"} w-${
                compact ? "4" : "5"
              } text-green-500`}
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-200">{inputToken}</span>
            <span
              className={`font-semibold ${
                side === "BUY" ? "text-blue-500" : "text-green-500"
              }`}
            >
              {side === "BUY" ? "-" : "+"} ${inputAmount}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">
              {executedAt?.toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-400">{`nhttps://solscan.io/tx/${transactionHash}`}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
