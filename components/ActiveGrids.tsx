"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CryptoActivity } from "./CryptoActivity";
import { useState } from "react";
import { TokenModal } from "./TokenModal";
import { IGrid } from "@/lib/database/models/grid.model";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ActiveGridsProps {
  grids: IGrid[];
  refresh: () => void;
}

export function ActiveGrids({ grids, refresh }: ActiveGridsProps) {
  const [selectedGrid, setSelectedGrid] = useState<IGrid | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTokenClick = (grid: IGrid) => {
    setSelectedGrid(grid);
    setIsModalOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      // Add a slight delay to make the refresh animation visible
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <>
      <Card className="w-full h-1/2 p-6 bg-[#2a2a2a] border-[#3a3a3a] overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 mr-5">
            <h2 className="text-xl font-semibold text-gray-200">
              Active Grids
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 w-9 rounded-full bg-[#333333] text-gray-200 hover:bg-[#444444] hover:text-white"
              title="Refresh grids"
            >
              <RefreshCcw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <ScrollArea className="flex-1 w-full pr-4">
            <div className="grid-cols-2 grid gap-6">
              {grids.map((grid) => (
                <CryptoActivity
                  key={grid._id}
                  {...grid}
                  onClick={() => handleTokenClick(grid)}
                />
              ))}
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
