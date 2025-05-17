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
import { borrowCoin, borrowMenuCQ } from "./callbackQuery/borrow-menu";
import { borrowCoinHandler } from "./callbackQuery/borrowCoinHandler";
import { collateralCoinHandler } from "./callbackQuery/collateralCoinHandler";
import {
  collateralCoin,
  collateralMenuCQ,
} from "./callbackQuery/collateral-menu";
import { loansMenuCQ } from "./callbackQuery/loans-menu";
import { alertLVTHandler } from "./callbackQuery/alertLVTHandler";
import { deleteLoanByID } from "./callbackQuery/deleteLoanById";
import { alertLVT, editLoanMenuCQ } from "./callbackQuery/edit-loan-menu";
import {
  borrowCoinSymbol,
  collateralCoinSymbol,
  deleteSymbol,
  editSymbol,
  lvtSymbol,
} from "./constants/symbols";

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
      borrowCoinSymbol: "",
      borrowCoinInput: false,
      borrowCoinAmount: 0,
      borrowCoinId: "",
      collateralCoinSymbol: "",
      collateralCoinInput: false,
      collateralCoinAmount: 0,
      collateralCoinId: "",
      alertLVT: 0.8,
      alertLVTInput: false,
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
  } else if (ctx.session.alertLVTInput && message) {
    await alertLVTHandler(ctx, message);
    return;
  }
  await next();
});

/////alert lvt
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith(lvtSymbol)) {
    const id = data.slice(1);
    await alertLVT(ctx, id);
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
