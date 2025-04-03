"use client"
import { Card } from "@/components/ui/card"
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import { MetricCard } from "./MetricCard"
import type { TokenInfo } from "./CryptoActivity"

interface TokenSummaryProps {
  token: TokenInfo
}

export function TokenSummary({ token }: TokenSummaryProps) {
  return (
    <Card className="w-full p-6 bg-[#2a2a2a] border-[#3a3a3a]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-transparent rounded-full relative flex-shrink-0">
          <img
            src={token.token_logo || "/placeholder.svg"}
            alt={`${token.name} logo`}
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-gray-200">
            {token.name} ({token.token_symbol})
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 truncate max-w-[300px]">{token.address}</span>
            <button
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => navigator.clipboard.writeText(token.address)}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Total Value */}
        <MetricCard title="Total Value" value={`$${token.value_usd.toLocaleString()}`} icon={DollarSign} />

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
          value={`${token.amount_owned.toLocaleString()} ${token.token_symbol}`}
          icon={ShoppingCart}
        />

        {/* Amount Owned */}
        <MetricCard
          title="Total Sells"
          value={`${token.amount_owned.toLocaleString()} ${token.token_symbol}`}
          icon={ShoppingCart}
        />
      </div>
    </Card>
  )
}

