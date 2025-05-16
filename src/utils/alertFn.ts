import { getCoinByID } from "@/api/getCoinByID";
import { getLVT } from "@/callbackQuery/getLVT";
import { MyContext } from "@/types/types";

export const alertFn = async (ctx: MyContext, id: string) => {
  const userID = ctx.session.user;
  const loan = ctx.session.loans.filter((loan) => loan.id === id);

  const borrowCoinId = loan[0].borrowCoinId;
  const borrowCoinPrice = await getCoinByID(ctx, borrowCoinId);
  const borrowCoinAmount = loan[0].borrowCoinAmount;

  const collateralCoinId = loan[0].collateralCoinId;
  const collateralCoinPrice = await getCoinByID(ctx, collateralCoinId);
  const collateralCoinAmount = loan[0].collateralCoinAmount;

  const alertLVT = loan[0].alertLVT;

  if (userID) {
  }
  const alert = setInterval(async () => {
    let currentTLV = 0;
    if (borrowCoinPrice && collateralCoinPrice) {
      currentTLV = getLVT(
        borrowCoinPrice,
        borrowCoinAmount,
        collateralCoinPrice,
        collateralCoinAmount
      );
    }
    if (currentTLV > 0.8 && userID) {
      await ctx.api.sendMessage(
        userID,
        `эй пидор, проснись, твой currentTLV ${currentTLV}, а это выше 0,8, тоби пизда (почти)`
      );
    }
  }, 10000);
  const length = ctx.session.loans.length;
  ctx.session.loans[length - 1].alertInterval = alert;
};
