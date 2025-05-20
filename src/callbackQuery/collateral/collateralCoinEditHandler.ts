import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";

export const collateralCoinEditHandler = async (
  ctx: MyContext,
  message: string
) => {
  try {
    const collateralCoinEditMessage = Number(message.trim());
    if (!isNaN(collateralCoinEditMessage) && ctx.session.curretnLoanId) {
      const loanId = ctx.session.curretnLoanId;
      const loan = ctx.session.loans.find((loan) => loan.id === loanId);
      const collateralCoinSymbol = loan?.collateralCoinSymbol;
      if (loan) {
        loan.collateralCoinAmount = collateralCoinEditMessage;
      }

      ctx.deleteMessage();
      const message = `Вы установили новый размер collateral: ${collateralCoinEditMessage} --- $${collateralCoinSymbol}`;
      const keyboard = await createInlineKeyboard([
        { text: "Мои займы", callback_data: "loans" },
      ]);
      await ctx.reply(message, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
      ctx.session.collateralCoinInputEdit = false;
    } else {
      ctx.deleteMessage();
      ctx.reply(
        "Введите корректное значение, нельзя вводить буквы. Числа с плавающей точкой нужно разделять точкой, а не заяпятой, или нет текущих займов"
      );
    }
  } catch (error) {
    console.log(error, "collateralCoinEditHandler");
  }
};
