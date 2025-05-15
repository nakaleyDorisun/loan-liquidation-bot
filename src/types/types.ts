import { collateralCoin } from "./../callbackQuery/collateral-menu";
import { borrowCoin } from "./../callbackQuery/borrow-menu";
import { FetchedDataItemType } from "@/api/getAllCoins";
import { Context } from "grammy";

export interface MyContext extends Context {
  session: SessionData;
}

export type idAndSymbolsItem = {
  id: string;
  symbol: string;
};

export type Loan = {
  id: string;
  borrowCoinId: string;
  collateralCoinId: string;
  borrowCoinAmount: number;
  collateralCoinAmount: number;
  inintLVT: number;
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
  loans: Loan[];
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
