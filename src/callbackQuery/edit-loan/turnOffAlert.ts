import { MyContext } from "@/types/types";

// export const turnOffAlert1 = async (ctx: MyContext, id: string) => {
//   clearInterval(
//     ctx.session.loans.find((loan) => loan.id === id)?.alertInterval
//   );
//   if (ctx.session.loans.find((loan) => loan.id === id)) {
//     ctx.session.loans.find((loan) => loan.id === id)?.alertInterval = undefined;
//   }
//   await ctx.answerCallbackQuery("Уведомления отключены🔕");
// };

export const turnOffAlert = async (ctx: MyContext, id: string) => {
  const loan = ctx.session.loans.find((loan) => loan.id === id);
  if (loan) {
    clearInterval(loan.alertInterval);
    loan.alertInterval = undefined;
  }
  await ctx.answerCallbackQuery("Уведомления отключены🔕");
};
