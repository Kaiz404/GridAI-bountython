"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChatContainer } from "./ChatContainer"
import { TokenSummary } from "./TokenSummary"
import { PriceChart } from "./PriceChart"
import { TokenForm } from "./TokenForm"
import type { TokenInfo } from "./CryptoActivity"
import { RecentActivity } from "./RecentActivity"

interface TokenModalProps {
  isOpen: boolean
  onClose: () => void
  token: TokenInfo | null
}

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

export function TokenModal({ isOpen, onClose, token }: TokenModalProps) {
  if (!token) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] min-w-[90vw] h-[90vh] p-0 bg-[#1a1a1a] border-[#3a3a3a] overflow-auto">
        <div className="flex h-full">
          {/* Left side - Chat (30%) */}
          <div className="w-[30%] h-full border-r border-[#3a3a3a] overflow-hidden">
            <ChatContainer />
          </div>

          {/* Right side - Token details (70%) */}
          <div className="w-[70%] h-full flex flex-col overflow-hidden p-2">
            <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
              {/* Token Summary */}
              <TokenSummary token={token} />

              {/* Price Chart and Form */}
              <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
                {/* Price Chart */}
                <div className="w-full lg:w-[60%]">
                  <PriceChart tokenSymbol={token.token_symbol} currentPrice={token.price_in_usd} />
                </div>

                {/* Token Form */}
                <div className="w-full lg:w-[40%]">
                  <TokenForm tokenSymbol={token.token_symbol} />
                </div>
              </div>
              <RecentActivity transactions={sampleData.transactions}/>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

