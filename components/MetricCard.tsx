import type React from "react"
import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  valueColor?: string
  secondaryIcon?: React.ReactNode
}

export function MetricCard({ title, value, icon: Icon, valueColor = "text-gray-200", secondaryIcon }: MetricCardProps) {
  return (
    <Card className="bg-[#333333] border-[#444444] p-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{title}</span>
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
          {secondaryIcon && <div className="ml-2">{secondaryIcon}</div>}
        </div>
      </div>
    </Card>
  )
}

