"use client";
import { Card } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { MetricCard } from "./MetricCard";
import Image from "next/image";
import type { TokenInfo } from "./CryptoActivity";
import type { IGrid } from "@/lib/``database/models/grid.model";
import { addressToLogoMap } from "@/lib/tokenLogos";
import { addressToSymbolMap } from "@/lib/tokenSymbols";

interface GridSummaryProps {
  grid: IGrid;
}

export function TokenSummary({ grid }: GridSummaryProps) {
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
            {grid.targetToken} ({addressToSymbolMap[grid.targetTokenId]})
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 truncate max-w-[300px]">
              {grid.targetTokenId}
            </span>
            <button
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => navigator.clipboard.writeText(grid.targetTokenId)}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Total Value */}
        <MetricCard
          title="Total Value"
          value={`$${grid.currentValue}`}
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
          value={`${grid.totalBuys}`}
          icon={ShoppingCart}
        />

        {/* Amount Owned */}
        <MetricCard
          title="Total Sells"
          value={`${grid.totalSells}`}
          icon={ShoppingCart}
        />
      </div>
    </Card>
  );
}
