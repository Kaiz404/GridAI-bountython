import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Message {
  id: string
  content: string
  sender: "user" | "other"
  timestamp: string
  senderName: string
  avatar?: string
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user"

  return (
    <div className={cn("flex w-full gap-2 mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          {message.avatar && <AvatarImage src={message.avatar} alt={message.senderName} />}
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {message.senderName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col max-w-[80%]">
        <div
          className={cn(
            "px-4 py-2 rounded-2xl",
            isUser ? "bg-blue-600 text-white rounded-tr-none" : "bg-[#3a3a3a] text-gray-200 rounded-tl-none",
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-1">
          {isUser ? "You" : message.senderName}, {message.timestamp}
        </span>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          {message.avatar && <AvatarImage src={message.avatar} alt={message.senderName} />}
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {message.senderName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

