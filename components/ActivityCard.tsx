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
  gridId, // Reference to the Grid
  side,
  inputToken, // Token being traded (input token)
  outputToken, // Token being received (output token)
  inputTokenId,
  outputTokenId,
  inputAmount,
  outputAmount,
  gridLevel,
  executedAt,
  transactionHash,
  profit,
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
            <span className="font-medium text-gray-200">
              {side === "BUY" ? `Bought ${inputToken}` : `Sold ${inputToken}`}
            </span>
            <span
              className={`font-semibold ${
                side === "BUY" ? "text-blue-500" : "text-green-500"
              }`}
            >
              {side === "BUY" ? "-" : "+"} ${inputAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-400">
              {executedAt
                ? new Date(executedAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Loading..."}
            </span>
            <a
              href={`https://solscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
            >
              View Txn: {transactionHash?.slice(0, 6)}...
              {transactionHash?.slice(-4)}
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
