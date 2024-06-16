import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  value: string;
  first?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const ExpressionBlock = ({
  value,
  className,
  first = false,
  ...restProps
}: Props) => {
  return (
    <div
      className={cn(
        "px-2 py-1 border-2 border-black font-serif flex items-center justify-center",
        first ? "border-l-2" : "border-l-0",
        className
      )}
      {...restProps}
    >
      {value}
    </div>
  );
};
