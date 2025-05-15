import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { menus } from "@/menus/menus";
import { MyContext } from "@/types/types";

export const mainMenuCQ = async (ctx: MyContext) => {
  try {
    const menu = menus["main"];
    const keyboard = await createInlineKeyboard(menu.buttons);
    await ctx.deleteMessage();
    const message = await ctx.reply(menu.text, {
      reply_markup: keyboard,
      parse_mode: "MarkdownV2",
    });
  } catch (error) {
    console.error(error, "mainMenuCQ");
  }
};
