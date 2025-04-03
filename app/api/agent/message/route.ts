import { NextResponse } from "next/server";
import { sendMessageToAgent } from "@/lib/agents/gridAgent";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    
    const streamIterator = await sendMessageToAgent(message);
    
    // Process the stream to collect responses
    const responseChunks = [];

    let agentResponse = "";
    
    for await (const chunk of streamIterator) {
      // console.log("Received chunk:", chunk);
      if (chunk.event === "on_chat_model_end") {
        agentResponse += chunk.data.output["content"];
      } 
    }
    
    return NextResponse.json({ agentResponse });
  } catch (error: any) {
    console.error("Error in agent message API:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred processing your message" },
      { status: 500 }
    );
  }
}