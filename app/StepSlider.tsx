"use client";

import { useState } from "react";
import { DragHandlers, motion } from "framer-motion";

const stepWidth = 40;

const getStepperLeftPosition = (index: number) => stepWidth * index - 16;

type Props = {
  steps: number[];
  stepIndex: number;
  incrementStep: () => void;
  decrementStep: () => void;
};

const StepSlider = ({
  steps,
  stepIndex,
  incrementStep,
  decrementStep,
}: Props) => {
  const handleDragEnd: DragHandlers["onDrag"] = (event, info) => {
    const { offset } = info;

    if (offset.x > 0) {
      incrementStep();
    } else if (offset.x < 0) {
      decrementStep();
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={`relative h-2 bg-slate-300 flex items-center`}
        style={{
          width: `${(steps.length - 1) * stepWidth}px`,
        }}
      >
        <div className="absolute w-[2px] h-4 left-0 bottom-0 bg-black" />
        <span className="absolute bottom-5 -left-1">{steps[0]}</span>

        {steps.slice(1, steps.length - 1).map((_, index) => (
          <div
            key={index}
            className={`absolute w-[1.5px] h-1 bg-black`}
            style={{ left: `${(index + 1) * stepWidth}px` }}
          />
        ))}

        <div className="absolute w-[2px] h-4 right-0 bottom-0 bg-black" />
        <span className="absolute bottom-5 -right-1">
          {steps[steps.length - 1]}
        </span>

        <motion.div
          className="absolute w-8 h-8 bg-orange-500 border-4 border-white shadow-md rounded-full flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          dragElastic={0.5}
          style={{ left: `${getStepperLeftPosition(stepIndex)}px` }}
        >
          <span className="text-white">{steps[stepIndex]}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default StepSlider;
