"use client";

import { ChatWindow } from "@/components/ChatWindow";
import Hero from "@/components/hero";

const initializeAgent = async () => {
  try {
    const response = await fetch("/api/agent/initialize", {
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
    <div>
      <Hero />
    </div>
  );
}
