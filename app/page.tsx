"use client";

import { Expression } from "@/app/Expression";
import StepSlider from "@/app/StepSlider";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type StepType = "increment" | "decrement";
type SimulationItem = {
  variable: "x" | "y";
  stepType: StepType;
};

const steps = [1, 2, 3, 4, 5, 6, 7];

export default function Home() {
  const [yStepIndex, setYStepIndex] = useState(0);
  const [xStepIndex, setXStepIndex] = useState(0);

  const simulation: SimulationItem[] = [
    {
      variable: "x",
      stepType: "increment",
    },
    {
      variable: "x",
      stepType: "increment",
    },
    {
      variable: "y",
      stepType: "increment",
    },
    {
      variable: "x",
      stepType: "increment",
    },
    {
      variable: "y",
      stepType: "increment",
    },
  ];
  const [simulationIndex, setSimulationIndex] = useState(-1);

  const performAction = async () => {
    if (simulationIndex === -1) return;

    if (simulationIndex < simulation.length) {
      await delay(500);

      const action = simulation[simulationIndex];
      if (action.stepType === "increment") {
        incrementStep(action.variable);
      } else if (action.stepType === "decrement") {
        decrementStep(action.variable);
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
  }, [yStepIndex, xStepIndex]);

  const incrementStep = (variable: "x" | "y") => {
    if (variable === "x") {
      setXStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    } else if (variable === "y") {
      setYStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const decrementStep = (variable: "x" | "y") => {
    if (variable === "x") {
      setXStepIndex((prev) => Math.max(0, prev - 1));
    } else if (variable === "y") {
      setYStepIndex((prev) => Math.max(0, prev - 1));
    }
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

      <div className="flex flex-col gap-4">
        <Expression
          symbolData={{
            y: {
              type: "variable",
              size: steps[yStepIndex],
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

        <Expression
          symbolData={{
            x: {
              type: "variable",
              size: steps[xStepIndex],
              maxSize: Math.max(...steps),
              color: "#EB9651",
            },
            5: {
              type: "constant",
              size: 6,
              color: "#7491FF",
            },
          }}
          expression={["x", "5"]}
          expressionLabel="x + 5"
          fullWidth
        />
      </div>

      <StepSlider
        label="y"
        color="#955BEB"
        steps={steps}
        stepIndex={yStepIndex}
        incrementStep={() => incrementStep("y")}
        decrementStep={() => decrementStep("y")}
      />

      <StepSlider
        label="x"
        color="#EB9651"
        steps={steps}
        stepIndex={xStepIndex}
        incrementStep={() => incrementStep("x")}
        decrementStep={() => decrementStep("y")}
      />
    </main>
  );
}
