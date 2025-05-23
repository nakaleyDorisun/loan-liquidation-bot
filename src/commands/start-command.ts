import { createInlineKeyboard } from "@/keyboards/createInlineKeyboard";
import { menus } from "@/menus/menus";
import { IMenus, MyContext } from "@/types/types";

export const startCommand = async (ctx: MyContext) => {
  try {
    const menu = menus["start"];
    const senderID = ctx.message?.from.id;
    if (senderID) {
      ctx.session.user = senderID;
    }
    ctx.session.borrowCoinInput = false;
    ctx.session.borrowCoinInputEdit = false;
    ctx.session.collateralCoinInput = false;
    ctx.session.collateralCoinInputEdit = false;
    ctx.session.alertLTVInput = false;
    ctx.session.repetAlertsInput = false;
    const firstName = ctx.from?.first_name;
    const keyboard = await createInlineKeyboard(menu.buttons);
    const startMessage = await ctx.reply(
      `Привет, ${firstName}\n\nДобро пожаловать в Loan liquidation BOT`,
      {
        reply_markup: keyboard,
        parse_mode: "MarkdownV2",
      }
    );
  } catch (error) {
    console.error(error, "startCommand");
  }
};
