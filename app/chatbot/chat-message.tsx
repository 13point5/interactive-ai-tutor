import { IconOpenAI } from "@/components/icons";
import { MemoizedReactMarkdown } from "@/components/markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import { Simulation } from "@/app/page";
import { Button } from "@/components/ui/button";

export type Message = {
  role: string;
  content: string;
  simulation?: Simulation;
};

type Props = {
  message: Message;
  setSimulation: (simulation: Simulation) => void;
};

export const ChatMessage = ({ message, setSimulation }: Props) => {
  const { role, content, simulation } = message;

  const isUser = role === "user";

  return (
    <div className="group relative mb-4 flex items-start">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border",
          isUser ? "bg-background" : "bg-primary text-primary-foreground",
          isUser && "border-[#10172A]"
        )}
      >
        {isUser ? <UserIcon /> : <IconOpenAI />}
      </div>

      <div className="flex-1 px-1 ml-4 space-y-4 overflow-hidden">
        <MemoizedReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          className="prose break-words max-w-full"
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
          }}
        >
          {content}
        </MemoizedReactMarkdown>

        {simulation && (
          <Button onClick={() => setSimulation(simulation)}>Play</Button>
        )}
      </div>
    </div>
  );
};
