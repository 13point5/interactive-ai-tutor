import { ChatMessage, Message } from "@/app/chatbot/chat-message";
import { Simulation } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  messages: Message[];
  isLoading: boolean;
  onSubmit: (query: string) => void;
  setSimulation: (simulation: Simulation) => void;
};

export const Chatbot = ({
  isLoading,
  onSubmit,
  messages,
  setSimulation,
}: Props) => {
  const [input, setInput] = useState("");

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const query = input.trim();
    setInput("");

    onSubmit(query);
  };

  return (
    <div className="w-[500px] h-[500px]">
      <div className="flex flex-1 flex-col gap-2 overflow-hidden h-full p-4 border rounded-md">
        {
          <div className="overflow-auto w-full h-full max-h-full flex-1">
            {messages.map(
              (message, index) =>
                message.role !== "system" && (
                  <div key={index}>
                    <ChatMessage
                      message={message}
                      setSimulation={setSimulation}
                    />

                    {index < messages.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                )
            )}
          </div>
        }

        <form className="flex gap-4 w-full" onSubmit={handleSubmit}>
          <Input
            className="flex-1"
            placeholder="type your message here"
            value={input}
            onChange={handleInputChange}
          />

          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
