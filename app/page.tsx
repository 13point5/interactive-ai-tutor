"use client";

import { Expression } from "@/app/Expression";
import StepSlider from "@/app/StepSlider";
import { useState } from "react";

export default function Home() {
  const [stepIndex, setStepIndex] = useState(2);
  const steps = [1, 2, 3, 4, 5, 6, 7];

  const incrementStep = () => {
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const decrementStep = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <main className="flex min-h-screen flex-col gap-14 items-center p-24">
      <Expression
        symbolData={{
          y: {
            type: "variable",
            size: steps[stepIndex],
            maxSize: Math.max(...steps),
            color: "#955BEB",
          },
          5: {
            type: "constant",
            size: 6,
            color: "#7491FF",
          },
        }}
        expression={["y", "y", "5"]}
        expressionLabel="2y + 5"
      />

      <StepSlider
        color="#955BEB"
        steps={steps}
        stepIndex={stepIndex}
        incrementStep={incrementStep}
        decrementStep={decrementStep}
      />
    </main>
  );
}
