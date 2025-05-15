import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";

export const collateralCoinHandler = async (
  ctx: MyContext,
  message: string
) => {
  try {
    const collateralCoinAmount = Number(message);
    if (!isNaN(collateralCoinAmount)) {
      ctx.session.collateralCoinAmount = collateralCoinAmount;
      ctx.deleteMessage();
      const collateralSymbol = ctx.session.collateralCoinSymbol?.slice(1);
      const borrowSymbol = ctx.session.borrowCoinSymbol?.slice(1);
      const borrowCoinAmount = ctx.session.borrowCoinAmount;
      // const borrowCost =
      const message = `Вы заняли ${borrowCoinAmount} ${borrowSymbol} под обеспечение ${collateralCoinAmount} ${collateralSymbol}`;
      const keyboard = await createInlineKeyboard([
        { text: "В главное меню", callback_data: "main" },
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
    console.log(error, "collateralCoinAmount");
  }
};
