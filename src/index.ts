import {
  Bot,
  MemorySessionStorage,
  session,
  GrammyError,
  HttpError,
} from "grammy";

import dotenv from "dotenv";

import { MyContext, SessionData } from "./types/types";
import { startCommand } from "./commands/start-command";
import { mainMenuCQ } from "./callbackQuery/main-menu";
import { rateMenuCQ } from "./callbackQuery/rate-menu";
import {
  borrowCoin,
  borrowCoinEdit,
  borrowMenuCQ,
} from "./callbackQuery/borrow/borrow-menu";
import { borrowCoinHandler } from "./callbackQuery/borrow/borrowCoinHandler";
import { collateralCoinHandler } from "./callbackQuery/collateral/collateralCoinHandler";
import {
  collateralCoin,
  collateralCoinEdit,
  collateralMenuCQ,
} from "./callbackQuery/collateral/collateral-menu";
import { loansMenuCQ } from "./callbackQuery/loans-menu";
import { alertLTVHandler } from "./callbackQuery/edit-loan/alertLTVHandler";
import { deleteLoanByID } from "./utils/deleteLoanById";
import {
  alertLTV,
  editLoanMenuCQ,
} from "./callbackQuery/edit-loan/edit-loan-menu";
import {
  borrowCoinSymbol,
  collateralCoinSymbol,
  deleteSymbol,
  editBorrowSymbol,
  editCollateralSymbol,
  editSymbol,
  LTVSymbol,
  repetAlertsSymbol,
  turnOffAlertSymbol,
  turnOnAlertSymbol,
} from "./constants/symbols";
import { turnOffAlert } from "./callbackQuery/edit-loan/turnOffAlert";
import { turnOnAlert } from "./callbackQuery/edit-loan/turnOnAlert";
import { repetAlerts } from "./callbackQuery/edit-loan/edit-loan-menu";
import { repetAlertsHandler } from "./callbackQuery/edit-loan/repetAlertsHandler";
import { borrowCoinEditHandler } from "./callbackQuery/borrow/borrowCoinEditHandler";
import { collateralCoinEditHandler } from "./callbackQuery/collateral/collateralCoinEditHandler";
import { profileMenuCQ } from "./callbackQuery/profile-menu";

dotenv.config();
const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.error(
    "Ошибка: BOT_TOKEN не найден в переменных окружения. Бот не может быть запущен."
  );
  process.exit(1);
}

export const bot = new Bot<MyContext>(botToken as string);

bot.use(
  session({
    initial: (): SessionData => ({
      data: [],
      user: null,
      editBorrowSymbol: "",
      borrowCoinSymbol: "",
      borrowCoinInput: false,
      borrowCoinInputEdit: false,
      borrowCoinAmount: 0,
      borrowCoinId: "",
      collateralCoinSymbol: "",
      collateralCoinInput: false,
      collateralCoinInputEdit: false,
      collateralCoinAmount: 0,
      collateralCoinId: "",
      alertLTV: 0.8,
      alertLTVInput: false,
      repetAlertsInput: false,
      idAndSymbols: [],
      loans: [],
      curretnLoanId: "",
    }),
    storage: new MemorySessionStorage(),
  })
);

bot.start();

bot.command("start", startCommand);

bot.callbackQuery("main", mainMenuCQ);
bot.callbackQuery("rate", rateMenuCQ);
bot.callbackQuery("profile", profileMenuCQ);
bot.callbackQuery("borrow", borrowMenuCQ);
bot.callbackQuery("collateral", collateralMenuCQ);
bot.callbackQuery("loans", loansMenuCQ);

bot.on("message:text", async (ctx, next) => {
  const message = ctx.message?.text;
  if (ctx.session.borrowCoinInput && message) {
    await borrowCoinHandler(ctx, message);
    return;
  } else if (ctx.session.collateralCoinInput && message) {
    await collateralCoinHandler(ctx, message);
    return;
  } else if (ctx.session.alertLTVInput && message) {
    await alertLTVHandler(ctx, message);
    return;
  } else if (ctx.session.repetAlertsInput && message) {
    await repetAlertsHandler(ctx, message);
    return;
  } else if (ctx.session.borrowCoinInputEdit && message) {
    await borrowCoinEditHandler(ctx, message);
    return;
  } else if (ctx.session.collateralCoinInputEdit && message) {
    await collateralCoinEditHandler(ctx, message);
    return;
  }
  await next();
});

/////repet Alerts
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(repetAlertsSymbol)) {
    const id = data.slice(1);
    await repetAlerts(ctx, id);
    return;
  }
  await next();
});

/////alert LTV
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(LTVSymbol)) {
    const id = data.slice(1);
    await alertLTV(ctx, id);
    return;
  }
  await next();
});

/////turn off alert LTV
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(turnOffAlertSymbol)) {
    const id = data.slice(1);
    await turnOffAlert(ctx, id);
    return;
  }
  await next();
});

/////turn on alert LTV
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(turnOnAlertSymbol)) {
    const id = data.slice(1);
    await turnOnAlert(ctx, id);
    return;
  }
  await next();
});

/////borrow coin
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(borrowCoinSymbol)) {
    ctx.session.borrowCoinSymbol = data;
    await borrowCoin(ctx);
    return;
  }
  await next();
});

/////borrow coin edit
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(editBorrowSymbol)) {
    console.log("kycb editBorrowSymbol");
    const id = data.slice(1);
    await borrowCoinEdit(ctx, id);
    return;
  }
  await next();
});

/////delete by id
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(deleteSymbol)) {
    const id = data.slice(1);
    deleteLoanByID(ctx, id);
    await ctx.answerCallbackQuery("Займ удален");
    return;
  }
  await next();
});

/////edit loan menu
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(editSymbol)) {
    const id = data.slice(1);
    await editLoanMenuCQ(ctx, id);
    return;
  }
  await next();
});

/////collateral coin
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(collateralCoinSymbol)) {
    ctx.session.collateralCoinSymbol = data;
    await collateralCoin(ctx);
    return;
  }
  await next();
});

/////collateral coin edit
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(editCollateralSymbol)) {
    console.log("kycb editCollateralSymbol");
    const id = data.slice(1);
    await collateralCoinEdit(ctx, id);
    return;
  }
  await next();
});

console.log("Бот запущен...");

process.on("SIGINT", () => {
  ("Бот завершает работу...");
  bot.stop();
  process.exit();
});

process.on("SIGTERM", () => {
  ("Бот завершает работу...");
  bot.stop();
  process.exit();
});
