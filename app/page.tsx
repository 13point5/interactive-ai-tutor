"use client";

import { Expression } from "@/app/Expression";
import StepSlider from "@/app/StepSlider";
import { Chatbot } from "@/app/chatbot";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { useChat } from "@/lib/hooks/useChat";

type StepType = "increment" | "decrement";
export type Variable = "x" | "y";
type SimulationAction = {
  variable: Variable;
  stepType: StepType;
};
export type Simulation = {
  initialStepIndices: Record<Variable, number>;
  actions: SimulationAction[];
};

export const steps = [1, 2, 3, 4, 5, 6, 7];

const sampleSimulation: Simulation = {
  initialStepIndices: {
    x: 2,
    y: 1,
  },
  actions: [
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
  ],
};

export default function Home() {
  const questionAreaRef = useRef<HTMLDivElement | null>(null);

  const [yStepIndex, setYStepIndex] = useState(0);
  const [xStepIndex, setXStepIndex] = useState(0);

  const [simulation, setSimulation] = useState<Simulation | null>(null);

  const incrementStep = (variable: Variable) => {
    if (variable === "x") {
      setXStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    } else if (variable === "y") {
      setYStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const decrementStep = (variable: Variable) => {
    if (variable === "x") {
      setXStepIndex((prev) => Math.max(0, prev - 1));
    } else if (variable === "y") {
      setYStepIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const { start: handleStartSimulation } = useSimulation({
    simulation,
    resetSimulation: () => setSimulation(null),
    xStepIndex,
    setXStepIndex,
    yStepIndex,
    setYStepIndex,
    incrementStep,
    decrementStep,
  });

  console.log("simulation", simulation);

  useEffect(() => {
    handleStartSimulation();
  }, [simulation]);

  const { isLoading, messages, handleSubmit } = useChat();
  console.log("messages", messages);

  const handleQuerySubmit = async (query: string) => {
    if (!questionAreaRef.current) {
      return;
    }

    const canvas = await html2canvas(questionAreaRef.current);
    const base64Image = canvas.toDataURL("image/png");

    await handleSubmit({
      query,
      image: base64Image,
      variables: { xStepIndex, yStepIndex },
    });
  };

  return (
    <main className="min-h-screen flex flex-col gap-4 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-center">
          Ambient AI Tutor
        </h1>
        <p className="text-sm text-center">
          AI tutor that not just responds in text but{" "}
          <i>
            <b>interacts</b>
          </i>{" "}
          with students by{" "}
          <i>
            <b>controlling</b>
          </i>{" "}
          the interactive activity.
        </p>
      </div>

      <div className="flex justify-center gap-10">
        <div
          ref={questionAreaRef}
          className="flex flex-col gap-14 items-center justify-center border rounded-md h-[500px] p-4"
        >
          <div className="flex flex-col items-center gap-4">
            <p>
              Find a value for <span className="font-serif">x</span> and for{" "}
              <span className="font-serif">y</span> that makes{" "}
              <span className="font-serif">2y + 5 = x + 5 true.</span>
            </p>

            <div className="flex flex-col gap-4 ml-6">
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
            decrementStep={() => decrementStep("x")}
          />
        </div>

        <Chatbot
          messages={messages}
          isLoading={isLoading}
          onSubmit={handleQuerySubmit}
          setSimulation={setSimulation}
        />
      </div>
    </main>
  );
}
