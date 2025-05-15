import { FetchedDataItemType } from "@/api/getData";
import { Context } from "grammy";

export interface MyContext extends Context {
  session: SessionData;
}

export type SessionData = {
  data: FetchedDataItemType[];
};

export type MenuItem = {
  text: string;
  callbackQuery: string;
  buttons: ButtonType[];
};

export interface IMenus {
  [menuId: string]: MenuItem; // Index Signature
}

export type ButtonType = {
  text: string;
  callback_data: string;
};
