import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface TokenFormProps {
  tokenSymbol: string
}

export function TokenForm({ tokenSymbol }: TokenFormProps) {
  return (
    <Card className="w-full h-full p-4 bg-[#2a2a2a] border-[#3a3a3a]">
      <h3 className="text-lg font-medium text-gray-200 mb-4">Manage {tokenSymbol}</h3>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Upper Limit</Label>
          <Input
            id="amount"
            type="number"
            placeholder={`Enter Grid Upper Limmit`}
            className="bg-[#333333] border-[#444444]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Lower Limit</Label>
          <Input id="price" type="number" placeholder="Enter Grid Lower Limit" className="bg-[#333333] border-[#444444]" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Grid Number</Label>
          <Input id="price" type="number" placeholder="Enter Number of Grids" className="bg-[#333333] border-[#444444]" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Current SOL Invested</Label>
          <Input id="notes" placeholder="Enter SOL Amount" className="bg-[#333333] border-[#444444]" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">Adjust</Button>
        </div>
      </form>
    </Card>
  )
}

