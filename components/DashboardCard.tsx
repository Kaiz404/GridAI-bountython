"use client";
import { Card } from "@/components/ui/card";
import { DashboardMetrics } from "./DashboardMetrics";
import { RecentActivity } from "./RecentActivity";
import { ChatContainer } from "./ChatContainer";
import { ActiveGrids } from "./ActiveGrids";
import { useEffect, useState } from "react";
import { getAllGrids, getAllGridSummary } from "@/lib/db_actions/grid";
import { getRecentTrades, getAllTrades } from "@/lib/db_actions/trade";
import { ITrade } from "@/lib/database/models/trade.model";
import { IGrid } from "@/lib/database/models/grid.model";
import { Loader2 } from "lucide-react";

export default function DashboardCard() {
  const [profitLoss, setProfitLoss] = useState(0);
  const [totalBuys, setTotalBuys] = useState(0);
  const [totalSells, setTotalSells] = useState(0);
  const [transactions, setTransactions] = useState<ITrade[]>([]);
  const [grids, setGrids] = useState<IGrid[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch data function separated for reuse with interval
  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data

      const { grids, totalProfit, profitPercentage, totalBuys, totalSells } =
        await getAllGridSummary();

      const trades = await getRecentTrades();

      const allGrids = await getAllGrids();

      // Update state with fetched data
      setTotalBuys(totalBuys);
      setTotalSells(totalSells);
      setTransactions(trades);
      setGrids(allGrids);
      console.log("Fetched grids:", allGrids);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };

  // Set up interval to fetch data every 5 seconds
  useEffect(() => {
    fetchData();

    setProfitLoss(Math.floor((Math.random() + 1) * 100)); // Mockup profit/loss

    // // Set up interval to refresh data every 5 seconds
    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 5000);

    // // Clean up interval when component unmounts
    // return () => clearInterval(intervalId);
  }, []);

  // Loading state component
  const LoadingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
      <p className="text-lg text-gray-300">Fetching from database...</p>
    </div>
  );

  return (
    <div className="w-full h-[800px] p-6 flex gap-6 bg-[#1a1a1a] dark">
      {/* Left side - Chat (30%) */}
      <Card className="w-[30%] h-full p-4 flex flex-col bg-[#2a2a2a] border-[#3a3a3a]">
        <ChatContainer />
      </Card>

      {/* Right side - Dashboard and Scrollable Cards (70%) */}
      <div className="w-[70%] h-full flex flex-col gap-6">
        {/* Dashboard Card */}
        <Card className="w-full h-1/2 p-4 bg-[#2a2a2a] border-[#3a3a3a] flex flex-col">
          <h2 className="text-xl font-semibold text-gray-200">Dashboard</h2>

          {loading && grids.length === 0 ? (
            <LoadingState />
          ) : (
            <>
              {/* Metrics Grid */}
              <DashboardMetrics
                profitLoss={122}
                totalSells={totalSells}
                totalBuys={totalBuys}
              />

              {/* Recent Activity - Fixed height to prevent overflow */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <RecentActivity transactions={transactions} />
              </div>
            </>
          )}
        </Card>

        {/* Transaction History */}
        {loading && grids.length === 0 ? (
          <Card className="w-full h-1/2 p-4 bg-[#2a2a2a] border-[#3a3a3a] flex flex-col">
            <LoadingState />
          </Card>
        ) : (
          <ActiveGrids grids={grids} refresh={fetchData} />
        )}
      </div>
    </div>
  );
}
