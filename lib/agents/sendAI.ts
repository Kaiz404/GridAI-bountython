import { SolanaAgentKit, createSolanaTools } from "solana-agent-kit";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import * as dotenv from "dotenv";
import bs58 from "bs58";
import * as readline from "readline";
import { SolanaBalanceOtherTool, SolanaBalanceTool, SolanaFetchPriceTool, SolanaFetchTokenDetailedReportTool, SolanaFetchTokenReportSummaryTool, SolanaGetInfoTool, SolanaLimitOrderTool, SolanaTradeTool } from "solana-agent-kit/dist/langchain";

dotenv.config();

async function initializeAgent() {
  const llm = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.7,
  });
  if (!process.env.SOLANA_PRIVATE_KEY) {
    throw new Error("SOLANA_PRIVATE_KEY environment variable is required");
  }
  // Convert array string to actual array, then to Uint8Array, then to base58
//   const privateKeyArray = JSON.parse(process.env.SOLANA_PRIVATE_KEY!);
//   const privateKeyUint8 = new Uint8Array(privateKeyArray);
//   const privateKeyBase58 = bs58.encode(privateKeyUint8);

  const solanaKit = new SolanaAgentKit(process.env.SOLANA_PRIVATE_KEY, process.env.RPC_URL!, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  });

  /*
    AI Agent will have these capabilities:

    - Create sell/buy orders based on grid algorithm
    - Fetch token information
    - Swap token
    - Setup grid trading algorithm
        - Given higher and lower limit prices, number of grids

    Grid algorithm functions needed:
    - set grid trading algorithm manually (upper_lim, lower_lim, grids, swap_pair, quantity of sol)
    - edit grid trade upper_lim(grid_id, upper_lim)
    - edit grid trade lower_lim(grid_id, lower_lim)
    - edit grid trade grids(grid_id, grids)
    - edit grid trade amount(grid_id, amount)
    - delete grid trade(grid_id)

    - fetch all orders buy/sell()
    - fectch all grid_trades by grid_id()
    - create a limit order(market_id, quantity, side, price)
    - cancel order(order_id)
      - subscribe to web socket for order updates

    Price Data Collection:
      - fetch price data for a specific token (e.g., SOL) over a given time period (e.g., 1 hour, 1 day, 1 week)
      - 
  */

  const tools = [
    new SolanaGetInfoTool(solanaKit),
    new SolanaBalanceTool(solanaKit),
    new SolanaBalanceOtherTool(solanaKit),
    new SolanaTradeTool(solanaKit),
    new SolanaLimitOrderTool(solanaKit),
    // new JupiterLimitOrderTool(solanaKit),
    new SolanaFetchPriceTool(solanaKit),
    new SolanaFetchTokenReportSummaryTool(solanaKit),
    new SolanaFetchTokenDetailedReportTool(solanaKit),
  ];
  // const tools = createSolanaTools(solanaKit);
  const memory = new MemorySaver();

  return createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
  });
}

async function runInteractiveChat() {
  const agent = await initializeAgent();
  const config = { configurable: { thread_id: "Solana Agent Kit!" } };
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Clear console and start chat with a small delay
  setTimeout(() => {
    console.clear(); // Clear any initialization messages
    console.log("Chat with Solana Agent (type 'exit' to quit)");
    console.log("--------------------------------------------");
    askQuestion();
  }, 100);

  const askQuestion = () => {
    rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      // v5cLWnJVjbDNUXfKY7BTqPX8DPG5HgjErHjnF94pump

      const stream = await agent.stream(
        {
          messages: [new HumanMessage(input)],
        },
        config,
      );
      console.log("\nLoading response...\n");
      process.stdout.write("Agent: ");

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          process.stdout.write(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {

          console.log("\n--------------------------------------------\n");
          // const toolCall = chunk.tools;
          // console.log(JSON.stringify(toolCall, null, 2));
          process.stdout.write(`Tool Call (${chunk.tools.messages[0].name}): \n`);
          process.stdout.write(chunk.tools.messages[0].content);
          process.stdout.write("\n--------------------------------------------\n");
        }
      }
      console.log("\n--------------------------------------------");

      askQuestion(); // Continue the conversation
    });
  };
}

runInteractiveChat().catch(console.error);
