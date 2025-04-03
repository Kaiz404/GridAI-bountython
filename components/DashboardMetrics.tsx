import { MetricCard } from "./MetricCard"
import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"

interface DashboardMetricsProps {
  profitLoss: number
  totalSells: number
  totalBuys: number
}

export function DashboardMetrics({ profitLoss, totalSells, totalBuys }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Profit/Loss Card */}
      <MetricCard
        title="Profit/Loss"
        value={`${profitLoss >= 0 ? "+" : ""}${profitLoss}%`}
        icon={TrendingUp}
        valueColor={profitLoss >= 0 ? "text-green-500" : "text-red-500"}
        secondaryIcon={
          profitLoss >= 0 ? (
            <ArrowUpRight className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowDownRight className="h-5 w-5 text-red-500" />
          )
        }
      />

      {/* Total Sells Card */}
      <MetricCard title="Total Sells" value={totalSells.toLocaleString()} icon={DollarSign} />

      {/* Total Buys Card */}
      <MetricCard title="Total Buys" value={totalBuys.toLocaleString()} icon={ShoppingCart} />
    </div>
  )
}

