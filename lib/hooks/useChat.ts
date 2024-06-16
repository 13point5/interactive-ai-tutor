import { Message } from "@/app/chatbot/chat-message";
import { useState } from "react";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ({
    query,
    image,
  }: {
    query: string;
    image: string;
  }) => {
    setIsLoading(true);

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: query,
      },
    ];

    setMessages(newMessages);

    const result = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: query,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
      }),
    });
    const res = await result.json();
    console.log("res", res);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: res.textResponse,
        simulation: res.simulation,
      },
    ]);

    setIsLoading(false);
  };

  return { messages, isLoading, handleSubmit };
};
