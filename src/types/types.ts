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
  borrowCoinAmount: number;
  borrowCoinSymbol: string;
  borrowCoinInitialPrice: number;
  collateralCoinId: string;
  collateralCoinAmount: number;
  collateralCoinSymbol: string;
  collateralCoinInitialPrice: number;
  inintLVT: number;
  alertLVT: number;
  alertInterval: NodeJS.Timeout | undefined;
};

export type SessionData = {
  data: FetchedDataItemType[];
  user: number | null;
  borrowCoinSymbol: string;
  borrowCoinInput: boolean;
  borrowCoinAmount: number;
  borrowCoinId: string;
  collateralCoinInput: boolean;
  collateralCoinSymbol: string;
  collateralCoinAmount: number;
  collateralCoinId: string;
  alertLVT: number;
  alertLVTInput: boolean;
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
