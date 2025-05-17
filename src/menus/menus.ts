import { IMenus } from "@/types/types";

export const menus: IMenus = {
  start: {
    text: "",
    callbackQuery: "",
    buttons: [
      {
        text: "Запустить",
        callback_data: "main",
      },
    ],
  },
  main: {
    text: "Для создания займа перейдите в меню Создать займ\n\nДля просмотра и редактирования текущего займа перейдите в меню Мои Займы",
    callbackQuery: "main",
    buttons: [
      {
        text: "Создать займ💰",
        callback_data: "borrow",
      },
      {
        text: "Мои Займы💼",
        callback_data: "loans",
      },
      {
        text: "Курс криптовалют📈",
        callback_data: "rate",
      },
      {
        text: "Личный Кабинет⚙️",
        callback_data: "profile",
      },
    ],
  },
  rate: {
    text: "Курсы",
    callbackQuery: "rate",
    buttons: [
      {
        text: "Назад",
        callback_data: "main",
      },
    ],
  },
  loans: {
    text: "Мои займы",
    callbackQuery: "loans",
    buttons: [
      {
        text: "Назад",
        callback_data: "main",
      },
    ],
  },
};
