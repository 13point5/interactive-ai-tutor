import { ExpressionBlock } from "@/app/Expression/block";

const BLOCK_DEFAULT_WIDTH = 15;

const getBlockWidth = (size: number) => size * BLOCK_DEFAULT_WIDTH;

const getBlockStyle = (size: number, color: string) => ({
  width: `${getBlockWidth(size)}px`,
  backgroundColor: color,
});

type ExpressionBlockData = {
  value: string;
  size: number;
  color: string;
};

const generateSampleData = (size: number): ExpressionBlockData[] => {
  return [
    {
      value: "y",
      size,
      color: "#955BEB",
    },
    {
      value: "y",
      size,
      color: "#955BEB",
    },
    {
      value: "5",
      size: 6,
      color: "#7491FF",
    },
  ];
};

type Props = {
  size: number;
};

export const Expression = ({ size }: Props) => {
  return (
    <div className="flex">
      {generateSampleData(size).map((blockData, index) => (
        <ExpressionBlock
          key={index}
          value={blockData.value}
          first={index == 0}
          style={getBlockStyle(blockData.size, blockData.color)}
        />
      ))}
    </div>
  );
};
