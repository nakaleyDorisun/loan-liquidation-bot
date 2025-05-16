import { MyContext } from "@/types/types";

export const deleteLoanByID = (ctx: MyContext, id: string) => {
  const loans = ctx.session.loans;
  const filteredLoans = loans.filter((loan) => loan.id !== id);
  ctx.session.loans = [...filteredLoans];
};
