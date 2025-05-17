import { mathRound } from "@/utils/mathRound";
import { getCoinByID } from "@/api/getCoinByID";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";
import { getLTV } from "../../utils/getLTV";

import * as uuid from "uuid";
import { clearSession } from "@/utils/clearSession";
import { alertFn } from "@/utils/alertFn";

export const collateralCoinHandler = async (
  ctx: MyContext,
  message: string
) => {
  try {
    const collateralCoinAmount = Number(message.trim());
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
      const borrowCoinCost = mathRound(borrowCoinAmount * borrowCoinPrice);

      const collateralCoinId = ctx.session.collateralCoinId;
      const collateralCoinPrice = Number(
        await getCoinByID(ctx, collateralCoinId)
      );
      const collateralCoinCost = mathRound(
        collateralCoinAmount * collateralCoinPrice
      );

      const LTV = getLTV(
        borrowCoinPrice,
        borrowCoinAmount,
        collateralCoinPrice,
        collateralCoinAmount
      );
      const alertLTV = 0.8;
      const message = `Вы заняли ${borrowCoinAmount} $${borrowSymbol}\nстоимость 1 $${borrowSymbol} - ${borrowCoinPrice}$\nобщая стоимость займа - ${borrowCoinCost}$\n\nПод обеспечение ${collateralCoinAmount} $${collateralSymbol}\nстоимость 1 $${collateralSymbol} - ${collateralCoinPrice}$\nобщая стоимость обеспечения - ${collateralCoinCost}$\n\nНачальный LTV ${LTV}\nAlert LTV: ${alertLTV}`;
      const keyboard = await createInlineKeyboard([
        { text: "В главное меню", callback_data: "main" },
      ]);
      await ctx.reply(message, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });

      const id = uuid.v4();
      ctx.session.loans = [
        ...ctx.session.loans,
        {
          id: id,
          borrowCoinId: ctx.session.borrowCoinId,
          borrowCoinAmount: ctx.session.borrowCoinAmount,
          borrowCoinSymbol: ctx.session.borrowCoinSymbol.slice(1),
          borrowCoinInitialPrice: borrowCoinPrice,
          collateralCoinAmount: ctx.session.collateralCoinAmount,
          collateralCoinId: ctx.session.collateralCoinId,
          collateralCoinSymbol: ctx.session.collateralCoinSymbol.slice(1),
          collateralCoinInitialPrice: collateralCoinPrice,
          inintLTV: LTV,
          repetAlerts: 10000,
          alertLTV: alertLTV,
          alertInterval: undefined,
        },
      ];
      alertFn(ctx, id);

      await clearSession(ctx);
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
