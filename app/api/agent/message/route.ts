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
    
    for await (const chunk of streamIterator) {
      if ("agent" in chunk && chunk.agent.messages && chunk.agent.messages.length > 0) {
        responseChunks.push({
          content: chunk.agent.messages[0].content || "",
          type: "message"
        });
      } else if ("tools" in chunk) {
        responseChunks.push({
          content: JSON.stringify(chunk),
          type: "tool"
        });
      } else {
        responseChunks.push({
          content: JSON.stringify(chunk),
          type: "other"
        });
      }
    }
    
    return NextResponse.json({ responseChunks });
  } catch (error: any) {
    console.error("Error in agent message API:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred processing your message" },
      { status: 500 }
    );
  }
}