"use client";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import Image from "next/image";
import type { IGrid } from "@/lib/database/models/grid.model";
import { addressToLogoMap } from "@/lib/tokenLogos";
import { addressToSymbolMap } from "@/lib/tokenSymbols";
import { useState } from "react";
import { toast } from "sonner";

interface GridSummaryProps {
  grid: IGrid;
}

export function TokenSummary({ grid }: GridSummaryProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(grid.targetTokenId)
      .then(() => {
        setIsCopied(true);
        toast.success("Token address copied to clipboard");

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy token address");
      });
  };

  return (
    <Card className="w-full p-6 bg-[#2a2a2a] border-[#3a3a3a]">
      <div>
        <div className="w-16 h-16 bg-transparent rounded-full relative flex-shrink-0">
          <Image
            src={addressToLogoMap[grid.targetTokenId] || "/placeholder.svg"}
            alt={`${grid.sourceTokenId} logo`}
            className="object-contain rounded-full"
            fill
            sizes="64px"
            priority
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-gray-200">
            {grid.targetTokenAmount
              ? `${(grid.targetTokenAmount / 10).toFixed(3)} (${
                  grid.targetTokenSymbol
                })`
              : `0 (${grid.targetTokenSymbol})`}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-sm text-gray-400 truncate max-w-[300px] bg-[#333333] px-3 py-1 rounded-md flex-1">
              {grid.targetTokenId}
            </div>
            <button
              className="flex items-center justify-center p-2 text-gray-300 hover:text-blue-400 bg-[#333333] hover:bg-[#3a3a3a] rounded-md transition-colors"
              onClick={handleCopy}
              title="Copy token address"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Total Value */}
        <MetricCard
          title="Total Value"
          value={grid.currentValue ? `$${grid.currentValue}` : "$0"}
          icon={DollarSign}
        />

        {/* ROI
        <MetricCard
          title="ROI"
          value={`${token.roi >= 0 ? "+" : ""}${token.roi}%`}
          icon={TrendingUp}
          valueColor={token.roi >= 0 ? "text-green-500" : "text-red-500"}
        /> */}

        {/* Amount Owned */}
        <MetricCard
          title="Total Buys"
          value={grid.totalBuys ? `${grid.totalBuys}` : 0}
          icon={ShoppingCart}
        />

        {/* Amount Owned */}
        <MetricCard
          title="Total Sells"
          value={grid.totalSells ? `${grid.totalSells}` : 0}
          icon={ShoppingCart}
        />
      </div>
    </Card>
  );
}
