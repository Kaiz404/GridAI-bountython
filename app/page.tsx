"use client";

import { ChatWindow } from "@/components/ChatWindow";

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
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        SolanaAgentKit + LangChain.js 🦜🔗 + Next.js
      </h1>
      <ul>
        <li className="text-l">
          🤝
          <span className="ml-2">
            This template showcases a simple agent chatbot using{" "}
            <a href="https://www.solanaagentkit.xyz/">SolanaAgentKit</a>
            {", "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            and the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}
            in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li>
        <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
            You can find the prompt and model logic for this use-case in{" "}
            <code>app/api/chat/route.ts</code>.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🎨
          <span className="ml-2">
            The main frontend logic is found in <code>app/page.tsx</code>.
          </span>
        </li>
        <li className="text-l">
          🐙
          <span className="ml-2">
            This template is open source - you can see the source code and
            deploy your own version{" "}
            <a
              href="https://github.com/michaelessiet/solana-agent-nextjs-starter-langchain"
              target="_blank"
            >
              from the GitHub repo
            </a>
            !
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>What is my wallet address?</code> below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <div className="flex w-full h-screen items-center justify-center bg-[#1a1a1f] text-white">
      <ChatWindow
        endpoint="api/chat"
        emoji="🤖"
        titleText="Solana agent"
        placeholder="I'm your friendly Solana agent! Ask me anything..."
        emptyStateComponent={InfoCard}
      ></ChatWindow>

      <button
        className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-2 px-4 border border-blue-400 rounded shadow"
        onClick={async () => {
          initializeAgent();
        }}
      >
        Create grid
      </button>
    </div>
  );
}
