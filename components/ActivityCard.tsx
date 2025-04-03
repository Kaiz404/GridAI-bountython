import { Card } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface ActivityCardProps {
  id: number
  type: "buy" | "sell"
  amount: number
  item: string
  date: string
  time: string
  compact?: boolean
}

export function ActivityCard({ id, type, amount, item, date, time, compact = false }: ActivityCardProps) {
  return (
    <Card
      key={id}
      className={`p-3 bg-[#333333] border-[#444444] hover:bg-[#3a3a3a] transition-colors`}
    >
      <div className="flex items-center">
        <div
          className={`p-2 rounded-full mr-4 ${type === "buy" ? "bg-blue-500/20" : "bg-green-500/20"}`}
        >
          {type === "buy" ? (
            <ArrowDown className={`h-${compact ? "4" : "5"} w-${compact ? "4" : "5"} text-blue-500`} />
          ) : (
            <ArrowUp className={`h-${compact ? "4" : "5"} w-${compact ? "4" : "5"} text-green-500`} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-200">{item}</span>
            <span className={`font-semibold ${type === "buy" ? "text-blue-500" : "text-green-500"}`}>
              {type === "buy" ? "-" : "+"} ${amount}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">{date}</span>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

