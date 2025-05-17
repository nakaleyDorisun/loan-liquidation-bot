import { getCoinByID } from "@/api/getCoinByID";
import { getLTV } from "@/utils/getLTV";
import { MyContext } from "@/types/types";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { turnOffAlertSymbol, turnOnAlertSymbol } from "@/constants/symbols";

export const alertFn = async (ctx: MyContext, id: string) => {
  try {
    const userID = ctx.session.user;
    const loan = ctx.session.loans.filter((loan) => loan.id === id);

    const borrowCoinId = loan[0].borrowCoinId;
    const borrowCoinSymbol = loan[0].borrowCoinSymbol;
    const borrowCoinPrice = await getCoinByID(ctx, borrowCoinId);
    const borrowCoinAmount = loan[0].borrowCoinAmount;
    const borrowCoinCost = borrowCoinPrice! * borrowCoinAmount; // if?

    const collateralCoinId = loan[0].collateralCoinId;
    const collateralCoinSymbol = loan[0].collateralCoinSymbol;
    const collateralCoinPrice = await getCoinByID(ctx, collateralCoinId);
    const collateralCoinAmount = loan[0].collateralCoinAmount;

    const alertLTV = loan[0].alertLTV;

    const repetAlerts = loan[0].repetAlerts;

    const alert = setInterval(async () => {
      let currentLTV = 0;
      if (borrowCoinPrice && collateralCoinPrice) {
        currentLTV = getLTV(
          borrowCoinPrice,
          borrowCoinAmount,
          collateralCoinPrice,
          collateralCoinAmount
        );
      }
      if (currentLTV > alertLTV && userID) {
        const buttons = [
          {
            text: "Выключить🔕",
            callback_data: turnOffAlertSymbol + id,
          },
          {
            text: "Включить🔔",
            callback_data: turnOnAlertSymbol + id,
          },
          {
            text: "Мои Займы💼",
            callback_data: "loans",
          },
        ];
        const keyboard = await createInlineKeyboard(buttons);

        await ctx.api.sendMessage(
          userID,
          `Эй пидор, проснись🦄🎊🎉\nпо твоему займу ${borrowCoinSymbol}-${collateralCoinSymbol}🍀🍀🍀\nна сумму ${borrowCoinCost}$\ncurrentLTV ${currentLTV}🌸🌸🌸\nа это выше ${alertLTV}🐶🐱🐼\nтоби пизда (почти)💖💘🌈`,
          {
            reply_markup: keyboard,
            parse_mode: "HTML",
          }
        );
        await ctx.api.sendSticker(
          userID,
          "CAACAgIAAxkBAAEOgkZoKE4RNTznT5dSCsc3jRnM7K4eKgACRxkAAjVw0EvfFb2al0cQIjYE"
        );
      }
    }, repetAlerts);

    ctx.session.loans.filter((loan) => loan.id === id)[0].alertInterval = alert;
    loan[0].alertInterval = alert; //
  } catch (error) {
    console.log(error);
  }
};
