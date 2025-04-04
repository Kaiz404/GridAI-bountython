"use client";
import { IGrid } from "@/lib/database/models/grid.model";
import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import { addressToLogoMap } from "@/lib/tokenLogos";
import { addressToSymbolMap } from "@/lib/tokenSymbols";

interface CryptoActivityCardProps extends IGrid {
  onClick?: () => void;
}

export function CryptoActivity(grid: CryptoActivityCardProps) {
  const randomValue = (Math.random() * 10).toFixed(1);

  return (
    <div
      className="w-full rounded-xl px-4 py-3 flex justify-between items-center font-semibold hover:cursor-pointer
      bg-[#333333] border-[#444444] hover:bg-[#3a3a3a] transition-colors"
      onClick={grid.onClick}
    >
      {/* token name and amt owned in USD */}
      <div className="w-[40%] h-full flex items-center gap-4 py-2">
        <div className="w-12 h-12 bg-transparent rounded-full relative flex-shrink-0">
          <Image
            src={addressToLogoMap[grid.targetTokenId] || "/placeholder.svg"}
            alt={`${grid.sourceTokenId} logo`}
            className="object-contain rounded-full"
            fill
            sizes="64px"
            priority
          />
        </div>
        <div className="flex-col h-full w-full justify-center flex gap-2">
          <p className="text-base md:text-lg text-gray-200">
            {`${grid.targetTokenSymbol} Token`}
          </p>
          <div className="w-fit h-full flex gap-2 text-gray-400 items-center justify-center">
            <p className="text-sm md:text-base">
              {grid.currentPrice
                ? `$${grid.currentPrice?.toFixed(3)}`
                : "No data yet"}
            </p>

            <div
              className={`py-1 px-2 rounded-xl text-sm ${
                parseFloat(randomValue) > 5
                  ? "text-green-400 bg-green-300/20"
                  : grid.currentValue < grid.quantityInvested
                  ? "text-red-500 bg-red-400/20 bg-opacity-20"
                  : "text-gray-500 bg-gray-500 bg-opacity-20"
              }`}
            >
              <span className="flex items-center">
                {parseFloat(randomValue) > 5 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {randomValue}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* token price and token owned */}
      <div className="flex-col h-full w-fit justify-center flex gap-2 text-base md:text-lg items-end p-1">
        <p className="text-gray-200">
          {grid.targetTokenAmount
            ? `${(grid.targetTokenAmount / 10).toFixed(2)}`
            : "No data yet"}
        </p>
        <p className="text-gray-400 text-sm md:text-base">
          {`Current grid level: ${
            grid.currentGridIndex ? grid.currentGridIndex : 0
          }`}
        </p>
      </div>
    </div>
  );
}
