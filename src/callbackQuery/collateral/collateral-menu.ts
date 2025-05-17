import { getAllCoins } from "@/api/getAllCoins";
import { collateralCoinSymbol } from "@/constants/symbols";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";

export const collateralMenuCQ = async (ctx: MyContext) => {
  try {
    await ctx.deleteMessage();
    const response = await getAllCoins(ctx);
    if (response) {
      const text = response
        .map(
          (item) =>
            `$${item.symbol} ----- ${item.name} ----- ${item.price_usd} $\n\n`
        )
        .join("");
      const menuMessage = `${text}\nВыберите монету, которую вы хотите положить в обеспечение:`;
      const buttonsCrypto = response.map((button) => {
        return {
          text: button.symbol,
          callback_data: collateralCoinSymbol + button.symbol,
        };
      });
      const buttonsMenu = [
        ...buttonsCrypto,
        {
          text: "Назад",
          callback_data: "main",
        },
      ];
      const keyboard = await createInlineKeyboard(buttonsMenu);
      const message = await ctx.reply(menuMessage, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.error(error, "collateralMenuCQ");
  }
};

export const collateralCoin = async (ctx: MyContext) => {
  try {
    const symbol = ctx.session.collateralCoinSymbol?.slice(1);
    await ctx.answerCallbackQuery({ text: `$${symbol} выбрано` });
    await ctx.deleteMessage();
    await ctx.reply(
      `Введит количество $${symbol}, которое вы положили в обеспечение`
    );
    ctx.session.collateralCoinInput = true;
    ctx.session.borrowCoinInput = false;
    ctx.session.alertLTVInput = false;
    ctx.session.repetAlertsInput = false;
  } catch (error) {
    console.error(error, "collateralCoin");
  }
};
