"use client";

import DashboardCard from "@/components/DashboardCard";
import { getGrids, createGrid } from "@/lib/db_actions/grid";

const initializeAgent = async () => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: "HI THERE",
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to initialize agent");
    }
  } catch (err: any) {
    console.error("Error initializing agent:", err);
  }
};

// // Initialize agent when the provider mounts
// useEffect(() => {
//   initializeAgent();
// }, []);

export default function Home() {
  return (
    <div className="flex w-full min-h-[calc(100vh-81px)] items-center justify-center flex-col">
      <div className="flex w-[95%] bg-blue-500 items-center justify-center">
        <DashboardCard />
        <button
          className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-2 px-4 border border-blue-400 rounded shadow"
          onClick={async () => {
            initializeAgent();
          }}
        >
          Create grid
        </button>
      </div>
    </div>
  );
}
