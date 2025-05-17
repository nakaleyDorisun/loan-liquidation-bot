import { getCoinByID } from "@/api/getCoinByID";
import { MyContext } from "@/types/types";
import { getLVT } from "./getLVT";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { deleteSymbol, lvtSymbol } from "@/constants/symbols";

export const editLoanMenuCQ = async (ctx: MyContext, id: string) => {
  const loan = ctx.session.loans.filter((loan) => (loan.id = id));

  const borrowCoinCurrentPrice = Number(
    await getCoinByID(ctx, loan[0].borrowCoinId)
  );
  const collateralCoinCurrentPrice = Number(
    await getCoinByID(ctx, loan[0].collateralCoinId)
  );
  const currentLVT = getLVT(
    borrowCoinCurrentPrice,
    loan[0].borrowCoinAmount,
    collateralCoinCurrentPrice,
    loan[0].collateralCoinAmount
  );

  const text = `Займ:\n\n- borrow: ${loan[0].borrowCoinAmount} $${loan[0].borrowCoinSymbol}\nцена покупки ${loan[0].borrowCoinInitialPrice}$\nтекущая цена ${borrowCoinCurrentPrice}$\n\n- collateral: ${loan[0].collateralCoinAmount} $${loan[0].collateralCoinSymbol}\nцена покупки ${loan[0].collateralCoinInitialPrice}$\nтекущая цена ${collateralCoinCurrentPrice}$\n\n- initial LVT: ${loan[0].inintLVT}\n\n- current LVT: ${currentLVT}\n\n- alert LVT: ${loan[0].alertLVT}`;

  const buttonsLoan = ctx.session.loans.map((item) => {
    return {
      text: `❌ $${item.borrowCoinSymbol} + $${item.collateralCoinSymbol}`,
      callback_data: deleteSymbol + item.id,
    };
  });
  const buttons = [
    ...buttonsLoan,
    {
      text: "Редактировать Alert LVT",
      callback_data: lvtSymbol + loan[0].id,
    },
    {
      text: "Назад",
      callback_data: "loans",
    },
  ];
  const keyboard = await createInlineKeyboard(buttons);
  await ctx.deleteMessage();
  const message = await ctx.reply(text, {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });
};

export const alertLVT = async (ctx: MyContext, id: string) => {
  try {
    await ctx.deleteMessage();
    await ctx.reply("Введите значение alertLVTHandler");
    ctx.session.curretnLoanId = id;
    ctx.session.alertLVTInput = true;
    ctx.session.borrowCoinInput = false;
    ctx.session.collateralCoinInput = false;
  } catch (error) {
    console.log(error, "alertLVT");
  }
};
