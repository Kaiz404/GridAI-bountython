'use server';

import { SolanaAgentKit } from "solana-agent-kit";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import type { StructuredTool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import type { StreamEvent } from "@langchain/core/tracers/log_stream";

// import { 
//   SolanaBalanceOtherTool, 
//   SolanaBalanceTool, 
//   SolanaFetchPriceTool, 
//   SolanaFetchTokenDetailedReportTool, 
//   SolanaFetchTokenReportSummaryTool, 
//   SolanaGetInfoTool,
//   SolanaLimitOrderTool, 
//   SolanaTradeTool 
// } from "solana-agent-kit/dist/langchain";
// Cache agent instance for reuse across requests
let agentInstance: ReturnType<typeof createReactAgent> | null = null;

export async function getAgentInstance() {
  console.log("Fetching agent instance...");
  console.log = console.log.bind(console); // Force immediate flushing
  if (agentInstance) {
    console.log("Returning existing agent instance...");
    return agentInstance;
  }

  console.log("Agent isnt in cache, initializing Solana agent...");

  try {
    const llm = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7,
    });
    
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;
    const apiKey = process.env.OPENAI_API_KEY;
    
    
    if (!privateKey) {
      throw new Error("SOLANA_PRIVATE_KEY environment variable is required");
    }

    // Create agent without problematic tools that might cause hydration issues
    const solanaKit = new SolanaAgentKit(privateKey, rpcUrl!, apiKey!,);

    const tools: any[] = [
      // new SolanaGetInfoTool(solanaKit),
      // new SolanaBalanceTool(solanaKit),
      // new SolanaBalanceOtherTool(solanaKit),
      // new SolanaTradeTool(solanaKit),
      // new SolanaLimitOrderTool(solanaKit),
      // new SolanaFetchPriceTool(solanaKit),
      // new SolanaFetchTokenReportSummaryTool(solanaKit),
      // new SolanaFetchTokenDetailedReportTool(solanaKit),
    ];
    
    const memory = new MemorySaver();

    agentInstance = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
    });
    
    console.log("Agent initialized successfully");
    return agentInstance;
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw error;
  }
}

export async function sendMessageToAgent(input: string) {
  if (!input) {
    throw new Error("Input message is required");
  }
  
  console.log("Input message:", input);
  
  try {
    const agent = await getAgentInstance();
    
    return agent.streamEvents(
      {
        messages: [new HumanMessage(input)],
      },
      { 
        version: "v2",
        configurable: { thread_id: "Solana Agent Kit!" } 
      },
    );
  } catch (error) {
    console.error("Error sending message to agent:", error);
    throw error;
  }
}