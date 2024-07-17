import { chart, watchSymbol } from "./api";
import { SymbolInfo, Period } from "@klinecharts/pro";
import { KLineData } from "klinecharts";

// import { readConfigFile } from "typescript";
export type DatafeedSubscribeCallback = (data: KLineData) => void;

export class CustomDatafeed {
  private ws: WebSocket | null = null;

  /**
   * 模糊搜索标的
   * 在搜索框输入的时候触发
   * 返回标的信息数组
   * ticker: a.instId,
   * name: a.name,
   * shortName: a.baseCcy,
   * market: "okx",
   * exchange: a.baseCcy,
   * type: a.instType,
   */
  searchSymbols(): any {
    // 根据模糊字段远程拉取标的数据
    return watchSymbol.query();
  }

  getHistoryKLineData(
    symbol: SymbolInfo,
    period: Period,
    from: number,
    to: number,
  ): Promise<KLineData[]> {
    return chart
      .getKLineHistory({
        instId: symbol.ticker,
        after: to,
        before: from,
        bar: period.text,
      })
      .then((data: any) => {
        data.reverse();
        if (!data) {
          return [];
        }
        return data.map((item: any) => {
          return {
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
            volume: parseFloat(item[7]),
            turnover: parseFloat(item[1]),
            timestamp: parseFloat(item[0]),
          };
        });
      });
  }

  subscribe(
    symbol: SymbolInfo,
    period: Period,
    callback: DatafeedSubscribeCallback,
  ): void {
    this.ws = new WebSocket("ws://localhost:4001/ws");
    console.log(this.ws);

    this.ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onopen = () => {
      console.error("WebSocket open:");
      // setTimeout(() => {
      //   const subscribeMessage = JSON.stringify({
      //     op: "subscribe",
      //     args: [
      //       {
      //         channel: `candle${period.text}`,
      //         instId: symbol.ticker,
      //       },
      //     ],
      //   });
      //   this.ws!.send(subscribeMessage);
      // }, 2000); // 延迟 100 毫秒
    };

    this.ws.onmessage = (event) => {
      // Parse the received message
      const message = event.data;
      if (typeof message === "string") {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.data) {
          // Call the callback function with the formatted data
          parsedMessage.data.forEach((s: any) => {
            callback({
              open: parseFloat(s[1]),
              high: parseFloat(s[2]),
              low: parseFloat(s[3]),
              close: parseFloat(s[4]),
              volume: parseFloat(s[6]),
              turnover: parseFloat(s[1]),
              timestamp: parseFloat(s[0]),
            });
          });
        }
      }
    };
  }

  unsubscribe(symbol: SymbolInfo, period: Period): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const unsubscribeMessage = JSON.stringify({
        op: "unsubscribe",
        args: [
          {
            channel: `candle${period.text}`,
            instId: symbol.ticker,
          },
        ],
      });
      this.ws.send(unsubscribeMessage);
    } else {
      console.error("WebSocket connection is not established");
    }
  }
}
