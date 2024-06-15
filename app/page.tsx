"use client";

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <StepSlider
        steps={steps}
        stepIndex={stepIndex}
        incrementStep={incrementStep}
        decrementStep={decrementStep}
      />
    </main>
  );
}
