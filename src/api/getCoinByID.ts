import { MyContext } from "@/types/types";

const baseURL = "https://api.coinlore.net/api/ticker/?id=";

export type FetchedDataItemType = {
  id: string;
  symbol: string;
  name: string;
  nameid: string;
  rank: number;
  price_usd: string;
  percent_change_24h: string;
  percent_change_1h: string;
  percent_change_7d: string;
  price_btc: string;
  market_cap_usd: string;
  volume24: number;
  volume24a: number;
  csupply: string;
  tsupply: string;
  msupply: string;
};

export type ResponseType = {
  data: FetchedDataItemType[];
  info: {
    coins_num: number;
    time: number;
  };
};

export const getCoinByID = async (ctx: MyContext, id: string) => {
  try {
    const response = await fetch(baseURL + id);
    const coin: FetchedDataItemType[] = await response.json();
    return coin[0].price_usd;
  } catch (error) {}
};
