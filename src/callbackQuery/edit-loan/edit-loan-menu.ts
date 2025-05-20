import { getCoinByID } from "@/api/getCoinByID";
import { MyContext } from "@/types/types";
import { getLTV } from "@/utils/getLTV";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import {
  deleteSymbol,
  editBorrowSymbol,
  editCollateralSymbol,
  LTVSymbol,
  repetAlertsSymbol,
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

  const isAlert = loan[0].alertInterval
    ? "Уведомления включены🔔"
    : "Уведомления отключены🔕";

  const repetAlertsMessage = loan[0].repetAlerts / 1000;

  const text = `Займ:\n\n- borrow: ${loan[0].borrowCoinAmount} $${loan[0].borrowCoinSymbol}\nцена покупки ${loan[0].borrowCoinInitialPrice}$\nтекущая цена ${borrowCoinCurrentPrice}$\n\n- collateral: ${loan[0].collateralCoinAmount} $${loan[0].collateralCoinSymbol}\nцена покупки ${loan[0].collateralCoinInitialPrice}$\nтекущая цена ${collateralCoinCurrentPrice}$\n\n- initial LTV: ${loan[0].inintLTV}\n\n- current LTV: ${currentLTV}\n\n- alert LTV: ${loan[0].alertLTV}\n\nЧастота отправки уведомлений: ${repetAlertsMessage} cекунд\n${isAlert}`;

  const buttonsLoan = loan.map((item) => {
    return {
      text: `❌ $${item.borrowCoinSymbol} + $${item.collateralCoinSymbol}`,
      callback_data: deleteSymbol + item.id,
    };
  });

  const buttons = [
    ...buttonsLoan,
    {
      text: "Ред. Alert LTV",
      callback_data: LTVSymbol + loan[0].id, /// или + id?
    },
    {
      text: "Ред. таймер",
      callback_data: repetAlertsSymbol + loan[0].id, /// или + id?
    },
    {
      text: "Ред. borrow",
      callback_data: editBorrowSymbol + loan[0].id, /// или + id?
    },
    {
      text: "Ред. collateral",
      callback_data: editCollateralSymbol + loan[0].id, /// или + id?
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
    await ctx.reply("Введите значение alert LTV:");
    ctx.session.curretnLoanId = id;
    ctx.session.borrowCoinInput = false;
    ctx.session.borrowCoinInputEdit = false;
    ctx.session.collateralCoinInput = false;
    ctx.session.collateralCoinInputEdit = false;
    ctx.session.alertLTVInput = true;
    ctx.session.repetAlertsInput = false;
  } catch (error) {
    console.log(error, "alertLTV");
  }
};

export const repetAlerts = async (ctx: MyContext, id: string) => {
  try {
    await ctx.deleteMessage();
    await ctx.reply("Введите частоту отправки уведомлений, в секундах");
    ctx.session.curretnLoanId = id;
    ctx.session.borrowCoinInput = false;
    ctx.session.borrowCoinInputEdit = false;
    ctx.session.collateralCoinInput = false;
    ctx.session.collateralCoinInputEdit = false;
    ctx.session.alertLTVInput = false;
    ctx.session.repetAlertsInput = true;
  } catch (error) {
    console.log(error, "repetAlerts");
  }
};
