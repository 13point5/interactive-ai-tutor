import { ExpressionBlock } from "@/app/Expression/block";

const BLOCK_DEFAULT_WIDTH = 15;

const getBlockWidth = (size: number) => size * BLOCK_DEFAULT_WIDTH;

const getBlockStyle = (size: number, color: string) => ({
  width: `${getBlockWidth(size)}px`,
  backgroundColor: color,
});

const getExpressionMaxWidth = (
  expressionSymbols: ExpressionSymbols,
  symbolData: SymbolData
) => {
  let maxWidth = 0;

  expressionSymbols.forEach((symbol) => {
    const data = symbolData[symbol];
    if (!data) return;

    if (data.type === "variable") {
      maxWidth += getBlockWidth(data.maxSize);
    } else {
      maxWidth += getBlockWidth(data.size);
    }
  });

  return maxWidth;
};

type SymbolData = Record<
  string,
  | {
      type: "variable";
      size: number;
      maxSize: number;
      color: string;
    }
  | {
      type: "constant";
      size: number;
      color: string;
    }
>;

type ExpressionSymbols = string[];

type Props = {
  symbolData: SymbolData;
  expression: ExpressionSymbols;
};

export const Expression = ({ symbolData, expression }: Props) => {
  return (
    <div
      className="flex bg-slate-300"
      style={{
        width: `${getExpressionMaxWidth(expression, symbolData)}px`,
      }}
    >
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
