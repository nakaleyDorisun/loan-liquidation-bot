import { InlineKeyboard, Keyboard } from "grammy";
import { ButtonType, MyContext } from "@/types/types";

export async function createInlineKeyboard(buttons: ButtonType[]) {
  const keyboard = new InlineKeyboard();
  buttons.forEach((button, index) => {
    if ((index + 1) % 2 === 0 && index < buttons.length - 1) {
      keyboard.text(button.text, button.callback_data).row();
    } else keyboard.text(button.text, button.callback_data);
  });
  return keyboard;
}
