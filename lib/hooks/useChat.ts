import { Message } from "@/app/chatbot/chat-message";
import { steps } from "@/app/page";
import { useState } from "react";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ({
    query,
    image,
    variables,
  }: {
    query: string;
    image: string;
    variables: {
      xStepIndex: number;
      yStepIndex: number;
    };
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
        variables,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `User's attempts: xStepIndex = ${
                  variables.xStepIndex
                }, x = ${steps[variables.xStepIndex]}, yStepIndex = ${
                  variables.yStepIndex
                }, y = ${steps[variables.yStepIndex]}.\nUser's query: ${query}`,
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
