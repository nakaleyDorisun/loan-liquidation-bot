import { getCoinByID } from "@/api/getCoinByID";
import { borrowCoin } from "./borrow-menu";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";

export const borrowCoinHandler = async (ctx: MyContext, message: string) => {
  try {
    const borrowCoinAmount = Number(message.trim());
    if (!isNaN(borrowCoinAmount)) {
      ctx.session.borrowCoinAmount = borrowCoinAmount;
      ctx.deleteMessage();
      const borrowSymbol = ctx.session.borrowCoinSymbol?.slice(1);
      const coin = ctx.session.idAndSymbols.find(
        (item) => item.symbol === borrowSymbol
      );
      if (coin) {
        ctx.session.borrowCoinId = coin.id;
      }
      const borrowCoinId = ctx.session.borrowCoinId;
      const borrowCoinPrice = await getCoinByID(ctx, borrowCoinId);
      let borrowCoinCost = 0;
      if (borrowCoinPrice) {
        borrowCoinCost = borrowCoinAmount * borrowCoinPrice!;
      }
      const message = `Вы заняли ${borrowCoinAmount} $${borrowSymbol} - стоимость ${borrowCoinCost}$`;
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
