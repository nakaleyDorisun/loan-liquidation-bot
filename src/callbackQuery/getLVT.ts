export const getLVT = (
  borrowCoinPrice: number,
  borrowCoinAmount: number,
  collateralPrice: number,
  collateralCoinAmount: number
) => {
  // console.log(Number(borrowPrice), "borrowPrice");
  // console.log(Number(borrowCoinAmount), "borrowCoinAmount");
  // console.log(Number(borrowPrice) * Number(borrowCoinAmount), "borrowCost");

  // console.log(Number(collateralPrice), "collateralPrice");
  // console.log(Number(collateralCoinAmount), "collateralCoinAmount");
  // console.log(
  //   Number(collateralPrice) * Number(collateralCoinAmount),
  //   "collateralCost"
  // );

  return (
    (borrowCoinPrice * borrowCoinAmount) /
    (collateralPrice * collateralCoinAmount)
  );
};
