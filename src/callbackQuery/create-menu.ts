import { getData } from "@/api/getData";
import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { menus } from "@/menus/menus";
import { MyContext } from "@/types/types";

export const createMenuCQ = async (ctx: MyContext) => {
  try {
    await ctx.deleteMessage();
    const response = await getData(ctx);
    if (response) {
      const text = response
        .map((item) => `${item.symbol} ----- ${item.name}\n\n`)
        .join("");
      const menuMessage = `${text}\n\nВыберите монету, которую вы хотите занять:`;
      const buttonsCrypto = response.map((button) => {
        return { text: button.symbol, callback_data: button.symbol };
      });
      const buttonsMenu = [
        ...buttonsCrypto,
        {
          text: "Назад",
          callback_data: "main",
        },
      ];
      const keyboard = await createInlineKeyboard(buttonsMenu);
      const message = await ctx.reply(menuMessage, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.error(error, "createMenuCQ");
  }
};
