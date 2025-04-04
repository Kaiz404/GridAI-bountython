"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChatContainer } from "./ChatContainer";
import { TokenSummary } from "./TokenSummary";
import { PriceChart } from "./PriceChart";
import { TokenForm } from "./TokenForm";
import type { TokenInfo } from "./CryptoActivity";
import { RecentActivity } from "./RecentActivity";
import DexChart from "./DexChart";
import { IGrid } from "@/lib/database/models/grid.model";
import { addressToSymbolMap } from "@/lib/tokenSymbols";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getRecentTrades } from "@/lib/db_actions/trade";

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  grid: IGrid | null;
}

// const sampleData = {
//   profitLoss: 12.45, // percentage
//   totalSells: 1245,
//   totalBuys: 876,
//   transactions: [
//     {
//       id: 1,
//       type: "buy" as const,
//       amount: 250,
//       item: "Product A",
//       date: "2023-03-15",
//       time: "14:30",
//     },
//     {
//       id: 2,
//       type: "sell" as const,
//       amount: 350,
//       item: "Product B",
//       date: "2023-03-15",
//       time: "15:45",
//     },
//     {
//       id: 3,
//       type: "buy" as const,
//       amount: 120,
//       item: "Product C",
//       date: "2023-03-14",
//       time: "09:15",
//     },
//     {
//       id: 4,
//       type: "sell" as const,
//       amount: 500,
//       item: "Product D",
//       date: "2023-03-14",
//       time: "11:30",
//     },
//     {
//       id: 5,
//       type: "sell" as const,
//       amount: 200,
//       item: "Product E",
//       date: "2023-03-13",
//       time: "16:20",
//     },
//     {
//       id: 6,
//       type: "buy" as const,
//       amount: 180,
//       item: "Product F",
//       date: "2023-03-13",
//       time: "10:45",
//     },
//     {
//       id: 7,
//       type: "sell" as const,
//       amount: 320,
//       item: "Product G",
//       date: "2023-03-12",
//       time: "13:10",
//     },
//   ],
// };

export function TokenModal({ isOpen, onClose, grid }: TokenModalProps) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TokenInfo[]>([]);

  // Fetch data function separated for reuse with interval
  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data
      const trades = await getRecentTrades();
      // Update state with fetched data
      setTransactions(trades);
      console.log("Fetched trades:", trades);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };

  // Set up interval to fetch data every 5 seconds
  useEffect(() => {
    // Fetch data immediately when component mounts
    fetchData();

    // Set up interval to refresh data every 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (!grid) {
    return null; // or a loading state
  }

  // Loading state component
  const LoadingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
      <p className="text-lg text-gray-300">Fetching from database...</p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] min-w-[90vw] h-[90vh] p-0 bg-[#1a1a1a] border-[#3a3a3a] overflow-auto">
        <div className="flex h-full">
          {/* Left side - Chat (30%) */}
          <div className="w-[30%] h-[800px] border-[#3a3a3a] overflow-hidden mt-8 ml-8">
            <ChatContainer />
          </div>

          {/* Right side - Token details (70%) */}
          <div className="w-[70%] h-full flex flex-col overflow-hidden p-2">
            <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
              {/* Token Summary */}
              <TokenSummary grid={grid} />

              {/* Price Chart and Form */}
              <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
                {/* Price Chart */}
                <div className="w-full lg:w-[70%] p-2 bg-[#2a2a2a] border-[#3a3a3a] border rounded-lg ">
                  <DexChart
                    tokenAddress={grid?.targetTokenId}
                    height={600}
                    width="100%"
                    theme="dark"
                    interval="1D"
                  />
                </div>

                {/* Token Form */}
                <div className="w-full lg:w-[30%]">
                  <TokenForm
                    tokenSymbol={
                      addressToSymbolMap[grid?.targetTokenId || "USDC"] ||
                      "USDC"
                    }
                  />
                </div>
              </div>

              {loading && transactions.length === 0 ? (
                <LoadingState />
              ) : (
                <>
                  {/* Recent Activity - Fixed height to prevent overflow */}
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    <RecentActivity transactions={transactions} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
