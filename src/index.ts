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
import { createMenuCQ } from "./callbackQuery/create-menu";

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
    }),
    storage: new MemorySessionStorage(),
  })
);

bot.start();

bot.command("start", startCommand);

bot.callbackQuery("main", mainMenuCQ);
bot.callbackQuery("rate", rateMenuCQ);
bot.callbackQuery("create", createMenuCQ);

("Бот запущен...");

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
