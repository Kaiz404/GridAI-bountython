"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { Message } from "./MessageBubble";
import { useAgent } from "./AgentProvider";
import { Loader2 } from "lucide-react"; // Import the loader icon

// Initial greeting message
const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! I'm your trading assistant. How can I help you today?",
    sender: "other",
    senderName: "Trading Assistant",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

export function ChatContainer() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = React.useState(false);
  const { loading, initialized, error, sendMessage, abortCurrentRequest } =
    useAgent();

  const handleSendMessage = (content: string) => {
    console.log("HANDLING SEND MESSAGE", content);
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        senderName: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Add loading message
      const loadingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thinking...",
        sender: "assistant",
        senderName: "Trading Assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setIsLoading(true);

      // Use function expression instead of function declaration
      const processResponse = async (message: string) => {
        // Call the agent API to get the response
        const responseData = await sendMessage(message);

        // Remove the loading message and add the real response
        setMessages((prev: any[]) => {
          const filteredMessages = prev.filter((msg) => !msg.isLoading);
          return [
            ...filteredMessages,
            {
              id: Date.now().toString(),
              content: responseData.content || responseData.toString(),
              role: "assistant",
              senderName: "Trading Assistant",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ];
        });
      };

      processResponse(content);
    } catch (error: any) {
      // Handle error
      console.error("Error sending message:", error);

      // Remove the loading message and add error message
      setMessages((prev: any[]) => {
        const filteredMessages = prev.filter((msg) => !msg.isLoading);
        return [
          ...filteredMessages,
          {
            id: Date.now().toString(),
            content: `Error: ${error.message || "Failed to get response"}`,
            role: "system",
            isError: true,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Import toast if it's not already imported
  const toast = {
    error: (message: string) => console.error(message),
  };

  return (
    <Card className="w-full h-full flex flex-col bg-[#2a2a2a] border-[#3a3a3a] overflow-hidden">
      <div className="p-4 border-b border-[#3a3a3a]">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center">
          Trading Assistant
          {!initialized && (
            <span className="ml-2 text-yellow-400 text-xs flex items-center">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              initializing...
            </span>
          )}
        </h2>
        <p className="text-sm text-gray-400">
          {error
            ? `Error: ${error}`
            : "Ask questions about your trading activity"}
        </p>
      </div>

      {!initialized ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
          <p className="mt-4 text-gray-400 text-sm">
            Initializing your trading assistant...
          </p>
          <p className="text-gray-500 text-xs mt-2">This may take a moment</p>
        </div>
      ) : ( 
        <div className="flex-1 overflow-y-auto p-4 h-full">
          <MessageList messages={messages} />
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </Card>
  );
}
