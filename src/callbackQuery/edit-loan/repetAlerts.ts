import { MyContext } from "@/types/types";

export const repetAlerts = async (ctx: MyContext, id: string) => {
  try {
    await ctx.deleteMessage();
    await ctx.reply("Введите частоту повтора отправки уведомлений, в секундах");
    ctx.session.curretnLoanId = id;
    ctx.session.repetAlertsInput = true;
    ctx.session.alertLTVInput = false;
    ctx.session.borrowCoinInput = false;
    ctx.session.collateralCoinInput = false;
  } catch (error) {
    console.log(error, "repetAlerts");
  }
};
