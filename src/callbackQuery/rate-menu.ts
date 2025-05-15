import { getAllCoins } from "@/api/getAllCoins";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { menus } from "@/menus/menus";
import { MyContext } from "@/types/types";

export const rateMenuCQ = async (ctx: MyContext) => {
  try {
    const menu = menus["rate"];

    const keyboard = await createInlineKeyboard(menu.buttons);
    await ctx.deleteMessage();
    const response = await getAllCoins(ctx);
    if (response) {
      const text = response
        .map((item) => `${item.symbol} ----- ${item.price_usd} $\n\n`)
        .join("");
      const message = await ctx.reply(text, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.error(error, "rateMenuCQ");
  }
};
