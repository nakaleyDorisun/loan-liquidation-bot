import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { MyContext } from "@/types/types";

export const profileMenuCQ = async (ctx: MyContext) => {
  try {
    const userID = ctx.session.user;
    const loans = ctx.session.loans.length ? ctx.session.loans.length : "0";
    const text = `Ваш id: ${userID}\n\nКоличество займов: ${
      loans ? loans : "0"
    }`;
    const keyboard = await createInlineKeyboard([
      { text: "Назад", callback_data: "main" },
    ]);
    await ctx.deleteMessage();
    const message = ctx.reply(text, {
      reply_markup: keyboard,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.log("profileMenuCQ");
  }
};
