import { mathRound } from "./mathRound";

export const getLVT = (
  borrowCoinPrice: number,
  borrowCoinAmount: number,
  collateralCoinPrice: number,
  collateralCoinAmount: number
) => {
  return mathRound(
    (borrowCoinPrice * borrowCoinAmount) /
      (collateralCoinPrice * collateralCoinAmount)
  );
};
