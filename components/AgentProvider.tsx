"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AgentContextType {
  loading: boolean;
  initialized: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<any>;
  abortCurrentRequest: () => void;
  retryInitialization: () => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

interface AgentProviderProps {
  children: ReactNode;
}

export function AgentProvider({ children }: AgentProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [initLoading, setInitLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  let abortController: AbortController | null = null;

  const initializeAgent = async () => {
    try {
      setInitLoading(true);
      setError(null);
      console.log("Initializing agent...");
      const response = await fetch("/api/agent/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: "Initialize agent" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to initialize agent");
      }
      console.log("Agent initialized successfully");

      setInitialized(true);
    } catch (err: any) {
      console.error("Error initializing agent:", err);
      setError(err.message || "Failed to initialize agent");
    } finally {
      setInitLoading(false);
    }
  };

  // Initialize agent when the provider mounts
  useEffect(() => {
    initializeAgent();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message) {
      console.error("Message is empty, cannot send to agent.");
      return;
    }

    console.log("Sending message to agent:", message);
    try {
      setLoading(true);
      setError(null);

      // Create new AbortController for this request
      abortController = new AbortController();
      const signal = abortController.signal;

      const response = await fetch("/api/agent/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to communicate with agent");
      }

      const data = await response.json();

      let responseMessage = data.agentResponse || data.toString();

      console.log("Received response from agent:", data);
      return responseMessage;
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error sending message to agent:", err);
        setError(err.message || "Failed to communicate with agent");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const abortCurrentRequest = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false);
    }
  };

  const retryInitialization = () => {
    initializeAgent();
  };

  return (
    <AgentContext.Provider
      value={{
        loading: loading || initLoading,
        initialized,
        error,
        sendMessage,
        abortCurrentRequest,
        retryInitialization,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export const useAgent = (): AgentContextType => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
