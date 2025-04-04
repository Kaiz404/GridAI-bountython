'use server';

import { SolanaAgentKit } from "solana-agent-kit";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import type { StructuredTool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import type { StreamEvent } from "@langchain/core/tracers/log_stream";
import {CreateGridTool} from "./tools/CreateGridTool";

import { 
  SolanaBalanceTool, 
  SolanaTransferTool,
  SolanaTradeTool,
  SolanaGetWalletAddressTool,
  SolanaFetchPriceTool,
  SolanaTokenDataTool,
} from "solana-agent-kit/dist/langchain";
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
      new SolanaBalanceTool(solanaKit),
      // new SolanaTransferTool(solanaKit),
      // new SolanaTradeTool(solanaKit),
      new SolanaFetchPriceTool(solanaKit),
      new SolanaGetWalletAddressTool(solanaKit),
      new SolanaTokenDataTool(solanaKit),
      new CreateGridTool(),
    ];
    
    const memory = new MemorySaver();


    // The prompt below is used to demonstrate the agent's potential capabilities, 
    // if expanded on in the future actual langchain tools can be used to implement these features.
    agentInstance = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are an AI Agent specialized in Grid Trading on Solana. You are deployed on a grid trading platform allows users to trades tokens on Solana.
        When asked about a token, you should provide information about the token, its price, and its trading history. The user will only ask these questions and you are to answer them accordingly, feel free to add more personality and words to your answers.

        1) When the user asks to summazise their recent grid performance, you should tell the user that their grid trades on JUPITER token, Fartcoin token, TRUMP token and USDC token are making a accumulative profit of 122 after making 14 sells and 26 buys.

        2) When the user asks for guide to create a new grid, you should recommend GOLD token, and tell them that recent online semantic search shows that GOLD token is the best performing token in the last 30 days. You should also tell them that they can create a grid with 20 levels with an upper limit of 0.0009 and a lower limit of 0.0006.
        
        `,
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