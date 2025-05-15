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
      borrowCoinSymbol: null,
      borrowCoinInput: false,
      borrowCoinAmount: 0,
      borrowCoinId: "",
      collateralCoinSymbol: null,
      collateralCoinInput: false,
      collateralCoinAmount: 0,
      collateralCoinId: "",
      idAndSymbols: [],
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

bot.on("message:text", async (ctx) => {
  const message = ctx.message?.text;
  if (ctx.session.borrowCoinInput && message) {
    await borrowCoinHandler(ctx, message);
    return;
  } else if (ctx.session.collateralCoinInput && message) {
    await collateralCoinHandler(ctx, message);
    return;
  } else {
    return;
  }
});

bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith("$")) {
    ctx.session.borrowCoinSymbol = data;
    await borrowCoin(ctx);
    return;
  }
  await next();
});

bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;
  if (data?.startsWith("%")) {
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
