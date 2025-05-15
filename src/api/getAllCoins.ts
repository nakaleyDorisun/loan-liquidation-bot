import { MyContext } from "@/types/types";

const baseURL = "https://api.coinlore.net/api/tickers/?start=0&limit=10";

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

export const getAllCoins = async (ctx: MyContext) => {
  try {
    const response = await fetch(baseURL);
    const allCoins: ResponseType = await response.json();
    const idAndSymbols = allCoins.data.map((coin) => {
      return {
        id: coin.id,
        symbol: coin.symbol,
      };
    });
    ctx.session.idAndSymbols = idAndSymbols;
    ctx.session.data = allCoins.data;
    return allCoins.data;
  } catch (error) {}
};
