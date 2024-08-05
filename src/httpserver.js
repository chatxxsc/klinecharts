import express, { json } from 'express';
import cors from "../node_modules/cors/lib/index.js"; 
import axios from "axios";
import { WebSocketServer } from "ws";
import WebSocket from "ws"; // To create client WebSocket

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express();
const corsOptions = {
  origin: ["http://localhost:4002", "http://192.168.10.108:4002","http://119.12.174.136:10086"],
  credentials: true, // This is needed to allow cookies to be sent in CORS requests
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, 'testtagdata.json');

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS method
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use("/api", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.okx.com/api/v5/public/instruments?instType=SPOT",
    );
    const data = response.data.data.map((a) => (
      {
      ticker: a.instId,
      name: a.instId,
      shortName: a.instId,
      market: "okx",
      exchange: a.baseCcy,
      priceCurrency: a.instId,
      type:a.instType,
      logo:''
    }));
    // console.log(data)
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from OKX API:", error);
    res.status(500).send("Error fetching data from OKX API");
  }
});
//https://www.okx.com/priapi/v5/market/candles?instId=BTC-USDT-SWAP&before=1720825526000&bar=1m&t=1720833506036

app.use("/kline-history", async (req, res) => {
  const { instId, bar, before, after } = req.query;

  if (!instId || !bar || !before || !after) {
    return res.status(400).send("Missing required query parameters");
  }

  const apiUrl = `https://www.okx.com/api/v5/market/history-candles?instId=${instId}-SWAP&bar=${bar}&before=${before}&after=${after}&limit=200`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data.data;
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from OKX API:", error);
    res.status(500).send("Error fetching data from OKX API");
  }
});


// {
//   "alias": "",
//   "avgPx": "25.983",
//   "cTime": "1721180380570",
//   "instId": "INJ-USDT-SWAP",
//   "instType": "SWAP",
//   "lever": "20",
//   "liqPx": "",
//   "mgnMode": "cross",
//   "pos": "1",
//   "posCcy": "",
//   "posSide": "long",
//   "posSpace": "0.0777424227413921",
//   "uplRatio": "0.143940268637186"
// }
app.use("/positions", async (req, res) => {
  const { uniqueName } = req.query;
  // console.log(req)
  if (!uniqueName) {
    return res.status(400).send("Missing required query parameters");
  }
  const apiUrl = `https://www.okx.com/priapi/v5/ecotrade/public/positions-v2?limit=10&uniqueName=${uniqueName}`

  try {
    const response = await axios.get(apiUrl);
    const data = response.data.data;
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from OKX API:", error);
    res.status(500).send("Error fetching data from OKX API");
  }
}
);

app.use("/trade-records", async (req, res) => {
  const {uniqueName} = req.query;

  const difftime = 7948799000;
  let nowHistory = new Date();
  nowHistory.setHours(23);
  nowHistory.setMinutes(59);
  nowHistory.setSeconds(59);
  nowHistory.setMilliseconds(0);
  let nowHistorystamp = nowHistory.getTime();
  let everHistorystamp = nowHistorystamp - difftime;
  let currentTimestamp = Date.now();
  if (!uniqueName) {
    return res.status(400).send("Missing required query parameters");
  }
  const apiUrl = `https://www.okx.com/priapi/v5/ecotrade/public/trade-records?instType=SWAP&limit=20&startModify=${everHistorystamp}&endModify=${nowHistorystamp}&uniqueName=${uniqueName}&t=${currentTimestamp}`
  // console.log(apiUrl)
  try {
    const response = await axios.get(apiUrl);
    const data = response.data.data;
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from OKX API:", error);
    res.status(500).send("Error fetching data from OKX API");
  }
}
);

app.get('/web', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file');
    }
    res.send(data);
  });
});

// 处理 /write 路径，通过 POST 请求接收表单数据并更新 data.json 文件
app.post('/write', (req, res) => {
  const newData = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file');
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send('Error parsing data file');
    }

    // 直接覆盖 jsonData 中的相同键名的值
    for (const key in newData) {
      if (jsonData[key]){
        jsonData[key]["dataxy"] = [...jsonData[key]["dataxy"],...newData[key]["dataxy"]]
        jsonData[key]["dataclor"] = [...jsonData[key]["dataclor"],...newData[key]["dataclor"]]
      }else{
        jsonData[key] = newData[key];
      }
    }

    fs.writeFile(dataFilePath, JSON.stringify(jsonData), 'utf8', (writeErr) => {
      if (writeErr) {
        return res.status(500).send('Error writing data file');
      }
      res.json({ message: 'Data updated successfully' });
    });
  });
});

app.listen(4000, () => {
  console.log("CORS proxy server is running on port 4000");
});

const server = app.listen(4001, () => {
  console.log("CORS proxy server is running on port 4001");
});

// WebSocket Server
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket server");

  // Connect to the target WebSocket server
  const targetWs = new WebSocket("wss://ws.okx.com:8443/ws/v5/business");

  // Forward messages from client to target WebSocket server
  ws.on("message", (message) => {
    if (Buffer.isBuffer(message)) {
      const textMessage = message.toString();
      targetWs.send(textMessage);
    } else {
      targetWs.send(message);
    }
  });

  // Handle messages from target WebSocket server
  targetWs.on("message", (message) => {
    // Convert binary message to text
    if (Buffer.isBuffer(message)) {
      const textMessage = message.toString();
      console
        .log
        // `Message from target WebSocket server (converted to text): ${textMessage}`,
        ();
      ws.send(textMessage);
    } else {
      // console.log(`Message from target WebSocket server: ${message}`);
      ws.send(message);
    }
  });

  // Handle target WebSocket server connection close
  targetWs.on("close", () => {
    console.log("Target WebSocket server connection closed");
    ws.close();
  });

  // Handle target WebSocket server errors
  targetWs.on("error", (error) => {
    console.error("Error in target WebSocket server:", error);
    ws.close();
  });

  // Handle client connection close
  ws.on("close", () => {
    console.log("Client connection closed");
    targetWs.close();
  });

  // Handle client errors
  ws.on("error", (error) => {
    console.error("Error in client WebSocket connection:", error);
    targetWs.close();
  });

  // const subscribeMessage = JSON.stringify({
  //   op: "subscribe",
  //   args: [{ channel: "candle1m", instId: "BTC-USDT" }],
  // });
  // targetWs.on("open", () => {
  //   console.log("Connected to target WebSocket server");
  //   targetWs.send(subscribeMessage);
  // });
});
