"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BarChartIcon as ChartGrid, Info, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

export default function LearnMoreCard() {
  return (
    <Card className="w-full h-1/2 bg-[#2a2a2a] border-[#3a3a3a] overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <ChartGrid className="w-6 h-6 mr-2 text-emerald-400" />
            <h2 className="text-2xl font-bold text-gray-100">Grid Trading Fundamentals</h2>
          </div>

          <Separator className="my-4 bg-gray-700" />

          <section className="mb-6">
            <div className="flex items-center mb-3">
              <Info className="w-5 h-5 mr-2 text-blue-400" />
              <h3 className="text-xl font-semibold text-gray-200">What is Grid Trading?</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-3">
              Grid trading is an automated trading strategy that places buy and sell orders at predetermined price
              levels, creating a grid of orders across a specific price range. This strategy aims to profit from market
              volatility and price oscillations within a defined range.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Unlike trend-following strategies, grid trading works best in sideways or ranging markets where prices
              bounce between support and resistance levels.
            </p>
          </section>

          <section className="mb-6">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
              <h3 className="text-xl font-semibold text-gray-200">How Grid Trading Works</h3>
            </div>
            <ol className="list-decimal list-inside text-gray-300 leading-relaxed space-y-2">
              <li>Define a price range with upper and lower boundaries</li>
              <li>Divide the range into multiple price levels (the grid)</li>
              <li>Place buy orders at levels below the current price</li>
              <li>Place sell orders at levels above the current price</li>
              <li>When buy orders are filled, new sell orders are placed at higher levels</li>
              <li>When sell orders are filled, new buy orders are placed at lower levels</li>
            </ol>
            <div className="bg-[#333333] p-4 rounded-md mt-4 border border-[#444444]">
              <p className="text-gray-200 italic">
                <span className="font-semibold text-emerald-400">Example:</span> If you set a grid between $90-$110 with
                5 levels, orders would be placed at $90, $95, $100, $105, and $110. As the price moves within this
                range, the strategy buys low and sells high automatically.
              </p>
            </div>
          </section>

          <section className="mb-6">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
              <h3 className="text-xl font-semibold text-gray-200">Benefits of Grid Trading</h3>
            </div>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
              <li>Profits from market volatility without predicting direction</li>
              <li>Works well in sideways/ranging markets where other strategies struggle</li>
              <li>Fully automated once set up</li>
              <li>Provides consistent small profits over time</li>
              <li>Reduces emotional trading decisions</li>
              <li>Dollar-cost averages your position</li>
            </ul>
          </section>

          <section className="mb-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-400" />
              <h3 className="text-xl font-semibold text-gray-200">Risks and Limitations</h3>
            </div>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
              <li>Underperforms in strong trending markets</li>
              <li>Risk of loss if price moves outside the grid range</li>
              <li>Requires sufficient capital to fund multiple grid levels</li>
              <li>Trading fees can eat into profits with frequent transactions</li>
              <li>Opportunity cost during strong market trends</li>
            </ul>
          </section>

          <Separator className="my-4 bg-gray-700" />

          <div className="bg-[#333333] p-4 rounded-md border border-[#444444]">
            <p className="text-gray-200 text-sm">
              <span className="font-semibold text-amber-400">Pro Tip:</span> Start with wider grids and fewer levels
              when learning. As you gain experience, you can optimize by adjusting grid density and range based on
              historical volatility of the asset.
            </p>
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}

