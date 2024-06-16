import { Simulation, Variable } from "@/app/page";
import { useEffect, useState } from "react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useSimulation = ({
  simulation,
  xStepIndex,
  setXStepIndex,
  yStepIndex,
  setYStepIndex,
  incrementStep,
  decrementStep,
}: {
  simulation: Simulation | null;
  xStepIndex: number;
  setXStepIndex: (value: number) => void;
  yStepIndex: number;
  setYStepIndex: (value: number) => void;
  incrementStep: (variable: Variable) => void;
  decrementStep: (variable: Variable) => void;
}) => {
  const [simulationIndex, setSimulationIndex] = useState(-1);

  const handleStartSimulation = () => {
    if (!simulation) return;

    setXStepIndex(simulation.initialStepIndices.x);
    setYStepIndex(simulation.initialStepIndices.y);

    setSimulationIndex(0);
  };

  const performAction = async () => {
    if (simulationIndex === -1) return;

    if (!simulation) return;

    if (simulationIndex < simulation.actions.length) {
      await delay(500);

      const action = simulation.actions[simulationIndex];
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
    if (!simulation) return;

    if (
      simulationIndex >= 0 &&
      simulationIndex < simulation.actions.length - 1
    ) {
      setSimulationIndex((prev) => prev + 1);
    }
  }, [yStepIndex, xStepIndex]);

  return {
    start: handleStartSimulation,
  };
};
