import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";

export const borrowCoinEditHandler = async (
  ctx: MyContext,
  message: string
) => {
  try {
    const borrowCoinEditMessage = Number(message.trim());
    if (!isNaN(borrowCoinEditMessage) && ctx.session.curretnLoanId) {
      const loanId = ctx.session.curretnLoanId;
      const loan = ctx.session.loans.find((loan) => loan.id === loanId);
      const borrowCoinSymbol = loan?.borrowCoinSymbol;
      if (loan) {
        loan.borrowCoinAmount = borrowCoinEditMessage;
      }
      ctx.deleteMessage();
      const message = `Вы установили новый размер borrow: ${borrowCoinEditMessage} --- $${borrowCoinSymbol}`;
      const keyboard = await createInlineKeyboard([
        { text: "Мои займы", callback_data: "loans" },
      ]);
      await ctx.reply(message, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
      ctx.session.borrowCoinInputEdit = false;
    } else {
      ctx.deleteMessage();
      ctx.reply(
        "Введите корректное значение, нельзя вводить буквы. Числа с плавающей точкой нужно разделять точкой, а не заяпятой, или нет текущих займов"
      );
    }
  } catch (error) {
    console.log(error, "borrowCoinEditHandler");
  }
};
