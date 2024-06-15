"use client";

import { useRef, useState } from "react";
import { DragHandlers, motion } from "framer-motion";

const stepWidth = 40;

const getLeft = (step: number) => stepWidth * (step - 1) - 16;

const StepSlider = () => {
  const [step, setStep] = useState(2);
  const steps = [1, 2, 3, 4, 5, 6, 7];

  console.log("step", step);

  const handleDragEnd: DragHandlers["onDrag"] = (event, info) => {
    const { offset } = info;

    if (offset.x > 0) {
      setStep((prev) => Math.min(prev + 1, 7));
    } else if (offset.x < 0) {
      setStep((prev) => Math.max(1, prev - 1));
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-[240px] h-2 bg-gray-300 flex items-center">
        <div className="absolute w-[2px] h-4 left-0 bottom-0 bg-black" />
        <span className="absolute bottom-5 -left-1">{steps[0]}</span>

        {steps.slice(1, steps.length - 1).map((_, index) => (
          <div
            key={index}
            className={`absolute w-[1.5px] h-1 bg-black`}
            style={{ left: `${(index + 1) * 40}px` }}
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
          style={{ left: `${getLeft(step)}px` }}
        >
          <span className="text-white">{step}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default StepSlider;
