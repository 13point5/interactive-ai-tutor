"use client";

import { Expression } from "@/app/Expression";
import StepSlider from "@/app/StepSlider";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type StepType = "increment" | "decrement";

export default function Home() {
  const [stepIndex, setStepIndex] = useState(2);
  const steps = [1, 2, 3, 4, 5, 6, 7];

  const simulation: StepType[] = ["increment", "increment", "decrement"];
  const [simulationIndex, setSimulationIndex] = useState(-1);

  const performAction = async () => {
    if (simulationIndex === -1) return;

    if (simulationIndex < simulation.length) {
      await delay(500);

      const action = simulation[simulationIndex];
      if (action === "increment") {
        incrementStep();
      } else if (action === "decrement") {
        decrementStep();
      }
    }
  };

  useEffect(() => {
    if (simulationIndex >= 0) {
      performAction();
    }
  }, [simulationIndex]);

  useEffect(() => {
    // This useEffect checks if there's more to simulate after each stepIndex update
    if (simulationIndex >= 0 && simulationIndex < simulation.length - 1) {
      setSimulationIndex((prev) => prev + 1);
    }
  }, [stepIndex]);

  const incrementStep = () => {
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const decrementStep = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <main className="flex min-h-screen flex-col gap-14 items-center p-24">
      <Button
        onClick={() => {
          setSimulationIndex(0);
        }}
      >
        Simulate
      </Button>

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
        label="y"
        color="#955BEB"
        steps={steps}
        stepIndex={stepIndex}
        incrementStep={incrementStep}
        decrementStep={decrementStep}
      />
    </main>
  );
}
