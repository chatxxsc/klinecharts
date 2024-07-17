import express from 'express';
import cors from "../node_modules/cors/lib/index.js"; 
import axios from "axios";
import { WebSocketServer } from "ws";
import WebSocket from "ws"; // To create client WebSocket

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173","http://119.12.174.136:10086"],
  credentials: true, // This is needed to allow cookies to be sent in CORS requests
};

app.use(cors(corsOptions));

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    const data = response.data.data.map((a) => ({
      ticker: a.instId,
      name: a.name,
      shortName: a.baseCcy,
      market: "okx",
      exchange: a.baseCcy,
      type: a.instType,
    }));
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

  const apiUrl = `https://www.okx.com/priapi/v5/market/candles?instId=${instId}-SWAP&bar=${bar}&before=${before}&after=${after}&limit=200`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data.data;
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from OKX API:", error);
    res.status(500).send("Error fetching data from OKX API");
  }
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
