import express from "express";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import {
  INCOMING_MESSAGE,
  SUPPORTED_MESSAGES,
} from "./messages/incomingMessages";
import {
  OUTGOING_MESSAGE,
  SUPPORTED_MESSAGES as OUTGOING_SUPPORTED_MESSAGE,
} from "./messages/outgoingMessages";
import { UserManager } from "./UserManager";
import { InMemoryStore } from "./store/inMemoryStore";
import tokenIsValid from "./utils";

const userManager = new UserManager();
const store = new InMemoryStore();

const app = express();
const PORT: string | number = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`HTTP Server is running on PORT ${PORT}`);
});

const HEARTBEAT_INTERVAL = 1000 * 5; // 5 seconds
const HEARTBEAT_VALUE = 1;

function onSocketPreError(e: Error) {
  console.log(e);
}

function onSocketPostError(e: Error) {
  console.log(e);
}

function ping(ws: WebSocket) {
  console.log("Ping initiated from ws backend");
  ws.send(
    JSON.stringify({
      type: "PING",
      payload: { HEARTBEAT_VALUE: HEARTBEAT_VALUE },
    }),
  );
}

const wss = new WebSocketServer({ noServer: true });

httpServer.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", function connection(ws: WebSocket, req) {
  console.log(
    `HTTP Server upgraded to WSS Server and is running on PORT ${PORT}`,
  );

  // const queryParams = url.parse(req.url, true).query;
  // const token = queryParams.token;

  // @ts-ignore
  const token: string = url.parse(req.url, true).query.token || "";
  // const userId = extractUserId(token);

  // Perform auth
  if (!token || !tokenIsValid(token)) {
    console.log("Unauthorized user");
    // Send an unauthorized message to the client
    ws.send(
      JSON.stringify({
        type: "UNAUTHORIZED",
        payload: {
          message: "You are not authorized to connect to the WebSocketServer",
          STATUS_CODE: 401,
        },
      }),
    );
    // Close the WebSocket connection
    ws.terminate();
    return;
  } else {
    ws.isAlive = true;

    ws.on("error", onSocketPostError);

    ws.on("message", function message(data: any, isBinary: boolean) {
      try {
        // If data is binary, convert it to a string
        const dataString = data.toString();
        const jsonData = JSON.parse(dataString);
        console.log("JSON DATA received from client : ", jsonData);

        messageHandler(ws, jsonData);
        //   wss.clients.forEach(function each(client) {
        //   if (client.readyState === WebSocket.OPEN) {
        //     client.send(data, { binary: isBinary });
        //   }
        // });
      } catch (error) {
        console.error(error);
      }
    });

    // ws.send(
    //   `A Privacy-Preserving Efficient Location-Sharing Scheme for Mobile Online Social Network Applications ~ Built with &#x1F499 by sanam`,
    // );
    ws.on("close", () => {
      console.log("Connection closed from ws server");
    });
  }
});

const interval = setInterval(() => {
  wss.clients.forEach((client: any) => {
    if (!client.isAlive) {
      client.terminate();
      return;
    }

    client.isAlive = false;
    ping(client);
  });
}, HEARTBEAT_INTERVAL);

wss.on("close", () => {
  clearInterval(interval);
});

function messageHandler(ws: WebSocket, message: INCOMING_MESSAGE) {
  if (message.type == SUPPORTED_MESSAGES.PONG) {
    console.log("Pong received by ws backend");
    const payload = message.payload;
    if (payload.HEARTBEAT_VALUE == HEARTBEAT_VALUE) {
      ws.isAlive = true;
    }
  }

  if (message.type == SUPPORTED_MESSAGES.JOIN_ROOM) {
    const payload = message.payload;
    userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
  }

  if (message.type == SUPPORTED_MESSAGES.LEAVE_ROOM) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);

    if (!user) {
      console.error("User not found in the in memory DB");
      return;
    }

    userManager.removeUser(payload.roomId, payload.userId);

    const outgoingPayload: OUTGOING_MESSAGE = {
      type: OUTGOING_SUPPORTED_MESSAGE.LEAVE_ROOM,
      payload: {
        userId: payload.userId,
        roomId: payload.roomId,
        STATUS_CODE: 404, // 404 status code signifies that the client has disconnected. This has to be broadcasted
      },
    };

    userManager.broadcastToRoom(
      payload.roomId,
      payload.userId,
      outgoingPayload,
    );
  }

  if (message.type === SUPPORTED_MESSAGES.SEND_MESSAGE) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);

    if (!user) {
      console.error("User not found in the in memory DB");
      return;
    }

    const outgoingPayload: OUTGOING_MESSAGE = {
      type: OUTGOING_SUPPORTED_MESSAGE.SEND_MESSAGE,
      payload: {
        userId: payload.userId,
        roomId: payload.roomId,
        message: payload.message,
      },
    };
    userManager.broadcastToRoom(
      payload.roomId,
      payload.userId,
      outgoingPayload,
    );
  }

  if (message.type === SUPPORTED_MESSAGES.SEND_LOCATION) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);

    if (!user) {
      console.error("User not found in the in-memory DATABASE");
      return;
    }
    let location = store.addLocation(
      payload.userId,
      user.name,
      payload.roomId,
      payload.position,
    );
    if (!location) {
      return;
    }

    const outgoingPayload: OUTGOING_MESSAGE = {
      type: OUTGOING_SUPPORTED_MESSAGE.ADD_LOCATION,
      payload: {
        userId: payload.userId,
        roomId: payload.roomId,
        position: {
          lat: payload.position.lat,
          lng: payload.position.lng,
        },
      },
    };
    userManager.broadcastToRoom(
      payload.roomId,
      payload.userId,
      outgoingPayload,
    );
  }
}
