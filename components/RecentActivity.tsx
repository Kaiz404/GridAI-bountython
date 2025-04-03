import { ScrollArea } from "@/components/ui/scroll-area"
import { ActivityCard } from "./ActivityCard"

interface Transaction {
  id: number
  type: "buy" | "sell"
  amount: number
  item: string
  date: string
  time: string
}

interface RecentActivityProps {
  transactions: Transaction[]
  limit?: number
}

export function RecentActivity({ transactions, limit = 4 }: RecentActivityProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium text-gray-300">Recent Activity</h3>
      </div>
      <ScrollArea className="flex-1 w-full pr-4">
        <div className="space-y-3">
          {transactions.slice(0, limit).map((transaction) => (
            <ActivityCard key={transaction.id} {...transaction} compact={true} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

