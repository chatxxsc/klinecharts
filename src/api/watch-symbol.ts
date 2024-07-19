import request, { checkResult } from "../utils/request";
import { SymbolInfo } from "@klinecharts/pro";

export function query() {
  return checkResult<SymbolInfo[]>(
  request({
    url: "/api",
  }),
)
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
