import { getCoinByID } from "@/api/getCoinByID";
import { MyContext } from "@/types/types";
import { getLTV } from "@/utils/getLTV";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import {
  deleteSymbol,
  LTVSymbol,
  turnOffAlertSymbol,
  turnOnAlertSymbol,
} from "@/constants/symbols";

export const editLoanMenuCQ = async (ctx: MyContext, id: string) => {
  const loan = ctx.session.loans.filter((loan) => loan.id === id);

  const borrowCoinCurrentPrice = Number(
    await getCoinByID(ctx, loan[0].borrowCoinId)
  );
  const collateralCoinCurrentPrice = Number(
    await getCoinByID(ctx, loan[0].collateralCoinId)
  );
  const currentLTV = getLTV(
    borrowCoinCurrentPrice,
    loan[0].borrowCoinAmount,
    collateralCoinCurrentPrice,
    loan[0].collateralCoinAmount
  );

  console.log(loan[0].alertInterval, "loan[0].alertInterval");
  const isAlert = loan[0].alertInterval
    ? "Уведомления включены🔔"
    : "Уведомления отключены🔕";

  const text = `Займ:\n\n- borrow: ${loan[0].borrowCoinAmount} $${loan[0].borrowCoinSymbol}\nцена покупки ${loan[0].borrowCoinInitialPrice}$\nтекущая цена ${borrowCoinCurrentPrice}$\n\n- collateral: ${loan[0].collateralCoinAmount} $${loan[0].collateralCoinSymbol}\nцена покупки ${loan[0].collateralCoinInitialPrice}$\nтекущая цена ${collateralCoinCurrentPrice}$\n\n- initial LTV: ${loan[0].inintLTV}\n\n- current LTV: ${currentLTV}\n\n- alert LTV: ${loan[0].alertLTV}\n\n${isAlert}`;

  const buttonsLoan = loan.map((item) => {
    return {
      text: `❌ $${item.borrowCoinSymbol} + $${item.collateralCoinSymbol}`,
      callback_data: deleteSymbol + item.id,
    };
  });

  const buttons = [
    ...buttonsLoan,
    {
      text: "Редактировать Alert LTV",
      callback_data: LTVSymbol + loan[0].id, /// или + id?
    },
    {
      text: "Включить🔔",
      callback_data: turnOnAlertSymbol + id,
    },
    {
      text: "Выключить🔕",
      callback_data: turnOffAlertSymbol + id, /// или loan[0].id?
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

export const alertLTV = async (ctx: MyContext, id: string) => {
  try {
    await ctx.deleteMessage();
    await ctx.reply("Введите значение alertLTVHandler");
    ctx.session.curretnLoanId = id;
    ctx.session.alertLTVInput = true;
    ctx.session.borrowCoinInput = false;
    ctx.session.collateralCoinInput = false;
  } catch (error) {
    console.log(error, "alertLTV");
  }
};
