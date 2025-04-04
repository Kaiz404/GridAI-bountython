"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CryptoActivity } from "./CryptoActivity";
import { useState } from "react";
import { TokenModal } from "./TokenModal";
import { IGrid } from "@/lib/database/models/grid.model";

interface ActiveGridsProps {
  grids: IGrid[];
}

export function ActiveGrids({ grids }: ActiveGridsProps) {
  const [selectedGrid, setSelectedGrid] = useState<IGrid | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTokenClick = (grid: IGrid) => {
    setSelectedGrid(grid);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="w-full h-1/2 p-6 bg-[#2a2a2a] border-[#3a3a3a] overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-200">
              Active Grids
            </h2>
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
