import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";
import { alertFn } from "@/utils/alertFn";

export const alertLVTHandler = async (ctx: MyContext, message: string) => {
  try {
    const alertLVTMessage = Number(message.trim());
    if (!isNaN(alertLVTMessage) && ctx.session.curretnLoanId) {
      const loanId = ctx.session.curretnLoanId;

      ctx.session.loans.filter((loan) => loan.id === loanId)[0].alertLVT =
        alertLVTMessage;

      clearInterval(
        ctx.session.loans.filter((loan) => loan.id === loanId)[0].alertInterval
      );

      await alertFn(ctx, loanId);
      ctx.deleteMessage();
      const message = `Вы установили новый alertLVT: ${alertLVTMessage}`;
      const keyboard = await createInlineKeyboard([
        { text: "Мои займы", callback_data: "loans" },
      ]);
      await ctx.reply(message, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
      ctx.session.alertLVTInput = false;
    } else {
      ctx.deleteMessage();
      ctx.reply(
        "Введите корректное значение, нельзя вводить буквы. Числа с плавающей точкой нужно разделять точкой, а не заяпятой, или нет текущих займов"
      );
    }
  } catch (error) {
    console.log(error, "borrowCoinHandler");
  }
};
