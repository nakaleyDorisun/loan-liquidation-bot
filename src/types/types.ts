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
  date: string;
  borrowCoinId: string;
  borrowCoinAmount: number;
  borrowCoinSymbol: string;
  borrowCoinInitialPrice: number;
  collateralCoinId: string;
  collateralCoinAmount: number;
  collateralCoinSymbol: string;
  collateralCoinInitialPrice: number;
  inintLTV: number;
  repetAlerts: number;
  alertLTV: number;
  alertInterval: NodeJS.Timeout | undefined;
};

export type SessionData = {
  editBorrowSymbol: string;
  data: FetchedDataItemType[];
  user: number | null;
  borrowCoinSymbol: string;
  borrowCoinInput: boolean;
  borrowCoinInputEdit: boolean;
  borrowCoinAmount: number;
  borrowCoinId: string;
  collateralCoinInput: boolean;
  collateralCoinInputEdit: boolean;
  collateralCoinSymbol: string;
  collateralCoinAmount: number;
  collateralCoinId: string;
  alertLTV: number;
  alertLTVInput: boolean;
  repetAlertsInput: boolean;
  idAndSymbols: idAndSymbolsItem[];
  loans: Loan[];
  curretnLoanId: string;
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
