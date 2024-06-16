import { ExpressionBlock } from "@/app/Expression/block";

const BLOCK_DEFAULT_WIDTH = 15;

const getBlockWidth = (size: number) => size * BLOCK_DEFAULT_WIDTH;

const getBlockStyle = (size: number, color: string) => ({
  width: `${getBlockWidth(size)}px`,
  backgroundColor: color,
});

type Props = {
  symbolData: Record<
    string,
    {
      size: number;
      color: string;
    }
  >;
  expression: string[];
};

export const Expression = ({ symbolData, expression }: Props) => {
  return (
    <div className="flex">
      {expression.map((symbol, index) => {
        const data = symbolData[symbol];

        if (!data) return null;

        return (
          <ExpressionBlock
            key={index}
            value={symbol}
            first={index == 0}
            style={getBlockStyle(data.size, data.color)}
          />
        );
      })}
    </div>
  );
};
