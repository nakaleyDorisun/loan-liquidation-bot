import { getAllCoins } from "@/api/getAllCoins";
import { borrowCoinSymbol } from "@/constants/symbols";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";

export const borrowMenuCQ = async (ctx: MyContext) => {
  try {
    await ctx.deleteMessage();
    const response = await getAllCoins(ctx);
    if (response) {
      const text = response
        .map(
          (item) =>
            `${item.symbol} ----- ${item.name} ----- ${item.price_usd} $\n\n`
        )
        .join("");
      const menuMessage = `${text}\nВыберите монету, которую вы хотите занять:`;
      const buttonsCrypto = response.map((button) => {
        return {
          text: button.symbol,
          callback_data: borrowCoinSymbol + button.symbol,
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
    console.error(error, "borrowMenuCQ");
  }
};

export const borrowCoin = async (ctx: MyContext) => {
  try {
    const symbol = ctx.session.borrowCoinSymbol?.slice(1);
    await ctx.answerCallbackQuery({ text: `$${symbol} выбрано` });
    await ctx.deleteMessage();
    await ctx.reply(`Введит количество $${symbol}, которое вы заняли`);
    ctx.session.borrowCoinInput = true;
    ctx.session.collateralCoinInput = false;
  } catch (error) {
    console.error(error, "borrowCoin");
  }
};
