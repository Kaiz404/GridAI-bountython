"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Generate some sample price history data
const generatePriceData = (currentPrice: number, days = 30) => {
  const data = []
  let price = currentPrice * 0.85 // Start a bit lower than current price

  for (let i = days; i >= 0; i--) {
    // Random price fluctuation between -3% and +3%
    const change = Math.random() * 0.06 - 0.03
    price = price * (1 + change)

    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: Number.parseFloat(price.toFixed(2)),
    })
  }

  return data
}

interface PriceChartProps {
  tokenSymbol: string
  currentPrice: number
}

export function PriceChart({ tokenSymbol, currentPrice }: PriceChartProps) {
  const priceData = React.useMemo(() => generatePriceData(currentPrice), [currentPrice])

  return (
    <Card className="w-full h-full p-4 bg-[#2a2a2a] border-[#3a3a3a]">
      <h3 className="text-lg font-medium text-gray-200 mb-4">{tokenSymbol} Price History</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#aaa" }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis tick={{ fill: "#aaa" }} domain={["dataMin", "dataMax"]} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "1px solid #444" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

