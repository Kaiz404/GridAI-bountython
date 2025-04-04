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
  return (
    <div
      className="w-full rounded-xl px-4 py-3 flex justify-between items-center font-semibold hover:cursor-pointer
      bg-[#333333] border-[#444444] hover:bg-[#3a3a3a] transition-colors"
      onClick={grid.onClick}
    >
      {/* token name and amt owned in USD */}
      <div className="w-[40%] h-full flex items-center gap-4 py-2">
        <div className="w-12 h-12 bg-transparent rounded-full relative flex-shrink-0">
          {/* <img
            src={addressToLogoMap[grid.targetTokenId] || "/placeholder.svg"}
            alt={`${grid.sourceTokenId} logo`}
            className="w-full h-full object-contain rounded-full"
          /> */}

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
            {grid.targetTokenAmount} ({addressToSymbolMap[grid.targetTokenId]})
          </p>
          <div className="w-fit h-full flex gap-2 text-gray-400 items-center justify-center">
            <p className="text-sm md:text-base">
              {" "}
              ${grid.targetTokenAmount?.toFixed(4)}{" "}
            </p>

            <div
              className={`py-1 px-2 rounded-xl text-sm ${
                grid.currentValue > grid.quantityInvested
                  ? "text-green-400 bg-green-300/20"
                  : grid.currentValue < grid.quantityInvested
                  ? "text-red-500 bg-red-400/20 bg-opacity-20"
                  : "text-gray-500 bg-gray-500 bg-opacity-20"
              }`}
            >
              <span className="flex items-center">
                {grid.currentValue > grid.quantityInvested ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(grid.currentValue)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* token price and token owned */}
      <div className="flex-col h-full w-fit justify-center flex gap-2 text-base md:text-lg items-end p-1">
        <p className="text-gray-200">${grid.targetTokenAmount}</p>
        <p className="text-gray-400 text-sm md:text-base">
          {`$${grid.currentPrice?.toFixed(2) || "0.00"}`}
        </p>
      </div>
    </div>
  );
}
