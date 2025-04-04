"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CryptoActivity } from "./CryptoActivity";
import { TokenModal } from "./TokenModal";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { getAllGrids } from "@/lib/db_actions/grid";
import { IGrid } from "@/lib/database/models/grid.model";
import { addressToLogoMap } from "@/lib/tokenLogos";
import { addressToSymbolMap } from "@/lib/tokenSymbols";

export function ActiveGridsCard() {
  const [selectedGrid, setSelectedGrid] = useState<IGrid | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State to store the input value

  const [grids, setGrids] = useState<IGrid[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch data function separated for reuse with interval
  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data
      const allGrids = await getAllGrids();
      // Update state with fetched data
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
    // Set up interval to refresh data every 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Loading state component
  const LoadingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
      <p className="text-lg text-gray-300">Fetching from database...</p>
    </div>
  );

  const handleTokenClick = (grid: IGrid) => {
    setSelectedGrid(grid);
    setIsModalOpen(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update the input value state
  };

  const handleCreateNewGrid = () => {
    // _id: { type: String, required: true },
    // sourceTokenSymbol: { type: String, required: true },
    // targetTokenSymbol: { type: String, required: true },
    // sourceTokenId: { type: String, required: true },
    // targetTokenId: { type: String, required: true },
    // upperLimit: { type: Number, required: true },
    // lowerLimit: { type: Number, required: true },
    // gridCount: { type: Number, required: true },
    // quantityInvested: { type: Number, required: true },
    // levels: { type: Object, default: {} },
    // totalBuys: { type: Number, default: 0 },
    // totalSells: { type: Number, default: 0 },
    // profit: { type: Number, default: 0 }, // Total profit in percentage
    // currentValue: { type: Number, default: 0 },
    // currentPrice: { type: Number, default: null },
    // currentGridIndex: { type: Number, default: null },
    // sourceTokenAmount: { type: Number, default: null },
    // targetTokenAmount: { type: Number, default: null },
    // createdAt: { type: Number, default: Date.now },
    // updatedAt: { type: Number, default: Date.now }

    const newGrid: IGrid = {
      sourceTokenSymbol: "SOL",
      targetTokenSymbol: addressToSymbolMap[inputValue] || "Unknown",
      sourceTokenId: "So11111111111111111111111111111111111111112",
      targetTokenId: inputValue,
      upperLimit: 0,
      lowerLimit: 0,
      gridCount: 0,
      quantityInvested: 0,
    };

    setSelectedGrid(newGrid);
    setIsModalOpen(true);
    console.log("Create New Grid with Token ID:", inputValue); // Log the input value
    // Add your logic here for creating a new grid
  };

  return (
    <>
      <Card className="w-full h-1/2 p-6 bg-[#2a2a2a] border-[#3a3a3a] overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 h-full p-4">
            <h2 className="text-xl font-semibold text-gray-200">
              Active Grids
            </h2>

            <form
              className="space-y-4 w-[25%]"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full gap-4 items-center">
                <Input
                  id="amount"
                  type="text"
                  placeholder={`Enter Token ID`}
                  className="bg-[#333333] border-[#444444] w-full text-white"
                  value={inputValue} // Bind the input value to state
                  onChange={handleInputChange} // Handle input changes
                />
                <Button
                  className="flex-1 bg-blue-600/80 hover:bg-blue-700 w-fit text-white"
                  onClick={handleCreateNewGrid} // Handle button click
                >
                  Create New Grid
                </Button>
              </div>
            </form>
          </div>
          <ScrollArea className="flex-1 w-full pr-4 h-full">
            <div className="h-full">
              {loading && grids.length === 0 ? (
                <Card className="w-full h-1/2 p-4 bg-[#2a2a2a] border-[#3a3a3a] flex flex-col">
                  <LoadingState />
                </Card>
              ) : (
                <div className="grid-cols-2 grid gap-6 h-full">
                  {grids.map((grid) => (
                    <CryptoActivity
                      key={grid._id}
                      {...grid}
                      onClick={() => handleTokenClick(grid)}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <TokenModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          grid={selectedGrid}
        />
      </Card>
    </>
  );
}
