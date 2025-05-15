import { FetchedDataItemType } from "@/api/getAllCoins";
import { Context } from "grammy";

export interface MyContext extends Context {
  session: SessionData;
}

export type idAndSymbolsItem = {
  id: string;
  symbol: string;
};

export type SessionData = {
  data: FetchedDataItemType[];
  user: number | null;
  borrowCoinSymbol: string | null;
  borrowCoinInput: boolean;
  borrowCoinAmount: number;
  borrowCoinId: string;
  collateralCoinInput: boolean;
  collateralCoinSymbol: string | null;
  collateralCoinAmount: number;
  collateralCoinId: string;
  idAndSymbols: idAndSymbolsItem[];
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
