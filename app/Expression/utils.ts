import { ExpressionSymbols, SymbolData } from "@/app/Expression";

const BLOCK_DEFAULT_WIDTH = 15;

const getBlockWidth = (size: number) => size * BLOCK_DEFAULT_WIDTH;

export const getBlockStyle = (size: number, color: string) => ({
  width: `${getBlockWidth(size)}px`,
  backgroundColor: color,
});

export const getExpressionMaxWidth = (
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

export const getExpressionWidth = (
  expressionSymbols: ExpressionSymbols,
  symbolData: SymbolData
) => {
  let width = 0;

  expressionSymbols.forEach((symbol) => {
    const data = symbolData[symbol];
    if (!data) return;

    width += getBlockWidth(data.size);
  });

  return width;
};
