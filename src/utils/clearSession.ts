import { MyContext } from "@/types/types";

export const clearSession = async (ctx: MyContext) => {
  ctx.session.borrowCoinInput = false;
  ctx.session.borrowCoinAmount = 0;
  ctx.session.borrowCoinId = "";
  ctx.session.borrowCoinSymbol = "";
  ctx.session.collateralCoinInput = false;
  ctx.session.collateralCoinAmount = 0;
  ctx.session.collateralCoinId = "";
  ctx.session.collateralCoinSymbol = "";
  ctx.session.alertLTVInput = false;
  ctx.session.repetAlertsInput = false;
};
