import { NextResponse, NextRequest } from "next/server";
import { getAgentInstance } from "@/lib/agents/gridAgent";

// Add a flag to track initialization status
let isInitializing = false;
let initializationError: string | null = null;

// const agent = getAgentInstance();


export async function POST(request: NextRequest) {
  try {
    // If already initializing, return status
    if (isInitializing) {
      return NextResponse.json(
        { status: "initializing", message: "Agent initialization is in progress" },
        { status: 202 }
      );
    }

    // You can now extract data from the request body if needed
    
    
      const body = await request.json();
      const messages = body.messages ?? [];
    
    isInitializing = true;
    
    // Get the agent instance (will create if it doesn't exist)
    console.log("Initializing agent instance...");
    console.log = console.log.bind(console); // Force immediate flushing
    await getAgentInstance();
    
    isInitializing = false;
    initializationError = null;

    return new Response("Agent initialized successfully", { status: 200 });
    
  } catch (error: any) {
    isInitializing = false;
    initializationError = error.message || "Failed to initialize agent";
    console.error("Error initializing agent:", error);
    
    return NextResponse.json(
      { status: "error", message: initializationError },
      { status: 500 }
    );
  }
}