import request, { checkResult } from "../utils/request";
import { SymbolInfo } from "@klinecharts/pro";

export function query() {
  return checkResult<SymbolInfo[]>(
  request({
    url: "/api",
  }),
)
}

// {
//   key: 1,
//   orderid: 1,
//   symbol: 'BTCUSDT',
//   open: "64,561.5",
//   sellprice: '68,064.3',
//   money: "-12.49%",
//   time:"07-18 10:10",
//   tags:["okx","空","100x"],
//   nicname:"金闪闪弗利萨"
// }
export function positions(uniqueName: string) {
  return request({
    url: "/positions",
    method:"GET",
    params: {
      uniqueName
    },
  })
}

// {
//   "alias": "",
//   "avgPx": "65557",
//   "baseName": "BTC",
//   "cTime": "1721402650490",
//   "fillTime": "1721402650491",
//   "instFamily": "BTC-USDT",
//   "instId": "BTC-USDT-SWAP",
//   "instType": "SWAP",
//   "lever": "1.0",
//   "nickName": "ChineseDing",
//   "ordId": "1640820129882202112",
//   "ordType": "limit",
//   "posSide": "short",
//   "px": "65488.1",
//   "quoteName": "USDT",
//   "side": "sell",
//   "uTime": "1721402650492",
//   "uly": "BTC-USDT",
//   "uniqueName": "2BE980C9BEA40361"
// }
export function tradeRecords(uniqueName: string) {
  return request({
    url: "/trade-records",
    method:"GET",
    params: {
      uniqueName
    },
  })
}

export function create(symbol: string) {
  return checkResult(
    request({
      url: "/watch-symbol",
      method: "POST",
      data: { symbol },
    }),
  );
}
export function remove(id: string) {
  return checkResult(
    request({
      url: "/watch-symbol",
      method: "delete",
      data: { id },
    }),
  );
}
