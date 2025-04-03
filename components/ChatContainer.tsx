"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"
import type { Message } from "./MessageBubble"

// Sample data for initial messages
const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! How can I help you with your trading today?",
    sender: "other",
    senderName: "Trading Assistant",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    content: "I'm looking to understand my recent trading performance.",
    sender: "user",
    senderName: "You",
    timestamp: "10:31 AM",
  },
  {
    id: "3",
    content:
      "Great! I can see that your portfolio has a 12.45% profit this month. Would you like me to analyze your most successful trades?",
    sender: "other",
    senderName: "Trading Assistant",
    timestamp: "10:32 AM",
  },
]

export function ChatContainer() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      senderName: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate response
    setIsLoading(true)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAutoResponse(content),
        sender: "other",
        senderName: "Trading Assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="w-full h-full flex flex-col bg-[#2a2a2a] border-[#3a3a3a] overflow-hidden">
      <div className="p-4 border-b border-[#3a3a3a]">
        <h2 className="text-lg font-semibold text-gray-200">Trading Assistant</h2>
        <p className="text-sm text-gray-400">Ask questions about your trading activity</p>
      </div>

      <MessageList messages={messages} />

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </Card>
  )
}

// Helper function to generate automatic responses
function getAutoResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("profit") || lowerMessage.includes("performance")) {
    return "Your overall profit is up 12.45% this month. Your best performing trade was Product B with a 28% return."
  }

  if (lowerMessage.includes("buy") || lowerMessage.includes("purchase")) {
    return "Based on your trading history, you've made 876 purchases this month. Would you like recommendations for your next investment?"
  }

  if (lowerMessage.includes("sell") || lowerMessage.includes("sold")) {
    return "You've completed 1,245 sell transactions this month, with an average profit margin of 8.3%."
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
    return "I can help you analyze your trading performance, understand market trends, or provide insights on specific transactions. What would you like to know?"
  }

  return "I understand. Is there anything specific about your trading activity you'd like to know more about?"
}

