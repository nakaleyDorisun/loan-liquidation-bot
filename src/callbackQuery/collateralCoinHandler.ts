import { getCoinByID } from "@/api/getCoinByID";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";
import { getLVT } from "./getLVT";

export const collateralCoinHandler = async (
  ctx: MyContext,
  message: string
) => {
  try {
    const collateralCoinAmount = Number(message);
    console.log(collateralCoinAmount, "collateralCoinAmount");
    if (!isNaN(collateralCoinAmount)) {
      ctx.session.collateralCoinAmount = collateralCoinAmount;
      ctx.deleteMessage();
      const collateralSymbol = ctx.session.collateralCoinSymbol?.slice(1);
      const coin = ctx.session.idAndSymbols.find(
        (item) => item.symbol === collateralSymbol
      );
      if (coin) {
        ctx.session.collateralCoinId = coin.id;
      }
      const borrowSymbol = ctx.session.borrowCoinSymbol?.slice(1);
      const borrowCoinAmount = ctx.session.borrowCoinAmount;
      const borrowCoinId = ctx.session.borrowCoinId;
      const borrowCoinPrice = Number(await getCoinByID(ctx, borrowCoinId));

      const collateralCoinId = ctx.session.collateralCoinId;
      const collateralCoinPrice = Number(
        await getCoinByID(ctx, collateralCoinId)
      );

      const LVT = getLVT(
        borrowCoinPrice,
        borrowCoinAmount,
        collateralCoinPrice,
        collateralCoinAmount
      );
      const message = `Вы заняли ${borrowCoinAmount} ${borrowSymbol}, стоимость 1 ${borrowSymbol} - ${borrowCoinPrice}$, общая стоимость займа - ${
        borrowCoinAmount * borrowCoinPrice
      }$, под обеспечение ${collateralCoinAmount} ${collateralSymbol}, стоимость 1 ${collateralSymbol} - ${collateralCoinPrice}$, общая стоимость обеспечения - ${
        collateralCoinAmount * collateralCoinPrice
      }$. Начальный LVT ${LVT}`;
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
