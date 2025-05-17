import { MyContext } from "@/types/types";
import { alertFn } from "@/utils/alertFn";

export const turnOnAlert = async (ctx: MyContext, id: string) => {
  await alertFn(ctx, id);
  await ctx.answerCallbackQuery("Уведомления включены🔔");
};
