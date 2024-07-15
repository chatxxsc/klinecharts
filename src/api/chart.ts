import { KLineData } from "klinecharts";
import request, { checkResult } from "../utils/request";

export function getKLineHistory(query: {
  after: number;
  before: number;
  instId: string;
  bar?: string;
}) {
  return checkResult(
    request<string>({
      url: "/kline-history",
      params: query,
    }),
  );
}

interface CandlesData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  baseAssetVolume: string;
  quoteAssetVolume: string;
}
export function binancecCandles(query: {
  start: number;
  end: number;
  symbol: string;
}) {
  return request<CandlesData[]>({
    url: "/candles",
    params: query,
  });
}

export function updateChat(symbol: string, data: Partial<KLineData>[]) {
  return checkResult(
    request({
      url: "/kline-history/update",
      method: "POST",
      data: {
        symbol,
        data: data,
      },
    }),
  );
}
export function fillSymbolMissData(symbol: string, start: number, end: number) {
  return checkResult(
    request({
      url: "/kline-fillmiss",
      method: "POST",
      data: {
        symbol,
        start: new Date(start),
        end: new Date(end),
      },
    }),
  );
}
