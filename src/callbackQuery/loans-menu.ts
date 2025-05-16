import { getCoinByID } from "@/api/getCoinByID";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";
import { getLVT } from "./getLVT";

export const loansMenuCQ = async (ctx: MyContext) => {
  if (!ctx.session.loans.length) {
    await ctx.answerCallbackQuery({ text: "У вас нет активных займов" });
    return;
  }
  try {
    const buttonsLoans = ctx.session.loans.map((item) => {
      return {
        text: `❌ $${item.borrowCoinSymbol} + $${item.collateralCoinSymbol}`,
        callback_data: "_" + item.id,
      };
    });
    const buttons = [
      ...buttonsLoans,
      {
        text: "Назад",
        callback_data: "main",
      },
    ];
    const keyboard = await createInlineKeyboard(buttons);

    const borrowCoinId = ctx.session.loans[0].borrowCoinId;
    const borrowCoinCurrentPrice = Number(await getCoinByID(ctx, borrowCoinId));
    const borrowCoinAmount = ctx.session.loans[0].borrowCoinAmount;

    const collateralCoinId = ctx.session.loans[0].collateralCoinId;
    ctx.session.loans[0].collateralCoinInitialPrice;
    const collateralCoinCurrentPrice = Number(
      await getCoinByID(ctx, collateralCoinId)
    );
    const collateralCoinAmount = ctx.session.loans[0].collateralCoinAmount;

    let currentLVT = 0;
    if (borrowCoinCurrentPrice && collateralCoinCurrentPrice) {
      currentLVT = getLVT(
        borrowCoinCurrentPrice,
        borrowCoinAmount,
        collateralCoinCurrentPrice,
        collateralCoinAmount
      );
    }

    const messagePromise = async () => {
      const messagePromiseGenerate = ctx.session.loans.map(
        async (loan, index) => {
          const borrowCoinCurrentPrice = Number(
            await getCoinByID(ctx, loan.borrowCoinId)
          );
          const collateralCoinCurrentPrice = Number(
            await getCoinByID(ctx, loan.collateralCoinId)
          );
          const currentLVT = getLVT(
            borrowCoinCurrentPrice,
            loan.borrowCoinAmount,
            collateralCoinCurrentPrice,
            loan.collateralCoinAmount
          );
          return `Займ №${index + 1}:\n\n- borrow: ${loan.borrowCoinAmount} $${
            loan.borrowCoinSymbol
          }\nцена покупки ${
            loan.borrowCoinInitialPrice
          }$\nтекущая цена ${borrowCoinCurrentPrice}$\n\n- collateral: ${
            loan.collateralCoinAmount
          } $${loan.collateralCoinSymbol}\nцена покупки ${
            loan.collateralCoinInitialPrice
          }$\nтекущая цена ${collateralCoinCurrentPrice}$\n\n- initial LVT: ${
            loan.inintLVT
          }\n\n- current LVT: ${currentLVT}\n\n- alert LVT: ${loan.alertLVT}`;
        }
      );

      const message = await Promise.all(messagePromiseGenerate);
      return message.join(`\n\n`);
    };

    const text = await messagePromise();
    await ctx.deleteMessage();
    const message = await ctx.reply(text, {
      reply_markup: keyboard,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error(error, "loansMenuCQ");
  }
};
