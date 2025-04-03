"use client"
import { Card } from "@/components/ui/card"
import { DashboardMetrics } from "./DashboardMetrics"
import { RecentActivity } from "./RecentActivity"
import { ChatContainer } from "./ChatContainer"
import { ActiveGrids } from "./ActiveGrids"
import type { TokenInfo } from "./CryptoActivity"

// Sample data
const sampleData = {
  profitLoss: 12.45, // percentage
  totalSells: 1245,
  totalBuys: 876,
  transactions: [
    { id: 1, type: "buy" as const, amount: 250, item: "Product A", date: "2023-03-15", time: "14:30" },
    { id: 2, type: "sell" as const, amount: 350, item: "Product B", date: "2023-03-15", time: "15:45" },
    { id: 3, type: "buy" as const, amount: 120, item: "Product C", date: "2023-03-14", time: "09:15" },
    { id: 4, type: "sell" as const, amount: 500, item: "Product D", date: "2023-03-14", time: "11:30" },
    { id: 5, type: "sell" as const, amount: 200, item: "Product E", date: "2023-03-13", time: "16:20" },
    { id: 6, type: "buy" as const, amount: 180, item: "Product F", date: "2023-03-13", time: "10:45" },
    { id: 7, type: "sell" as const, amount: 320, item: "Product G", date: "2023-03-12", time: "13:10" },
  ],
}

const sampleTokens: TokenInfo[] = [
  {
    name: "Wrapped Ether",
    address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    roi: 3.7,
    price_in_usd: 2312,
    amount_owned: 500,
    value_usd: 1156000,
    token_logo: "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
    token_symbol: "WETH",
  },
  {
    name: "Bitcoin",
    address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    roi: -2.3,
    price_in_usd: 43250,
    amount_owned: 12,
    value_usd: 519000,
    token_logo: "https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
    token_symbol: "BTC",
  },
  {
    name: "Polygon",
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    roi: 8.2,
    price_in_usd: 0.58,
    amount_owned: 150000,
    value_usd: 87000,
    token_logo: "https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
    token_symbol: "MATIC",
  },
  {
    name: "Chainlink",
    address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
    roi: 5.1,
    price_in_usd: 13.42,
    amount_owned: 3500,
    value_usd: 46970,
    token_logo: "https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png",
    token_symbol: "LINK",
  },
  {
    name: "Uniswap",
    address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
    roi: -1.8,
    price_in_usd: 7.25,
    amount_owned: 5200,
    value_usd: 37700,
    token_logo: "https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png",
    token_symbol: "UNI",
  },
]

export default function DashboardCard() {
  return (
    <div className="w-full h-[850px] p-6 flex gap-6 bg-[#1a1a1a] dark">
      {/* Left side - Chat (30%) */}
      <Card className="w-[30%] h-full p-4 flex flex-col bg-[#2a2a2a] border-[#3a3a3a]">
        <ChatContainer />
      </Card>

      {/* Right side - Dashboard and Scrollable Cards (70%) */}
      <div className="w-[70%] h-full flex flex-col gap-6">
        {/* Dashboard Card */}
        <Card className="w-full h-1/2 p-4 bg-[#2a2a2a] border-[#3a3a3a] flex flex-col">
          <h2 className="text-xl font-semibold text-gray-200">Dashboard</h2>

          {/* Metrics Grid */}
          <DashboardMetrics
            profitLoss={sampleData.profitLoss}
            totalSells={sampleData.totalSells}
            totalBuys={sampleData.totalBuys}
          />

          {/* Recent Activity - Fixed height to prevent overflow */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <RecentActivity transactions={sampleData.transactions} />
          </div>
        </Card>

        {/* Transaction History */}
        <ActiveGrids />
      </div>
    </div>
  )
}

