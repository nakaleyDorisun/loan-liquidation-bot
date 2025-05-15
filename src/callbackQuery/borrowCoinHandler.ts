import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";

export const borrowCoinHandler = async (ctx: MyContext, message: string) => {
  try {
    const borrowCoinAmount = Number(message);
    if (!isNaN(borrowCoinAmount)) {
      ctx.session.borrowCoinAmount = borrowCoinAmount;
      ctx.deleteMessage();
      const symbol = ctx.session.borrowCoinSymbol?.slice(1);
      const message = `Вы заняли ${borrowCoinAmount} ${symbol} `;
      const keyboard = await createInlineKeyboard([
        { text: "Выбрать обеспечение", callback_data: "collateral" },
      ]);
      await ctx.reply(message, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
      ctx.session.borrowCoinInput = false;
    } else {
      ctx.deleteMessage();
      ctx.reply(
        "Введите корректное значение, нельзя вводить буквы. Числа с плавающей точкой нужно разделять точкой, а не заяпятой"
      );
    }
  } catch (error) {
    console.log(error, "borrowCoinHandler");
  }
};
