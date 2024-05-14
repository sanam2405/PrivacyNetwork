import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import url from "url";
import {
  INCOMING_MESSAGE,
  OUTGOING_MESSAGE,
  INCOMING_SUPPORTED_MESSAGE,
  OUTGOING_SUPPORTED_MESSAGE,
} from "./messages";

import { HEARTBEAT_INTERVAL, HEARTBEAT_VALUE } from "./constants";
import tokenIsValid from "./utils";
import { UserManager } from "./UserManager";
import { InMemoryStore } from "./store/inMemoryStore";

function onSocketPreError(e: Error) {
  console.log(e);
}

function onSocketPostError(e: Error) {
  console.log(e);
}

function ping(ws: WebSocket) {
  ws.send(
    JSON.stringify({
      type: "PING",
      payload: { HEARTBEAT_VALUE: HEARTBEAT_VALUE },
    }),
  );
}

const userManager = new UserManager();
const store = new InMemoryStore();

const app = express();
const PORT: string | number = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`HTTP Server is running on PORT ${PORT}`);
});

const wss = new WebSocketServer({ noServer: true });

httpServer.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  console.log(
    `HTTP Server requesting to upgraded to ws to run on PORT ${PORT}`,
  );

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", async function connection(ws: WebSocket, req) {
  // @ts-ignore
  const token: string = url.parse(req.url, true).query.token || "";
  // const userId = extractUserId(token);

  const checkIfAuthorized = await tokenIsValid(token);
  // Perform auth
  if (!token || !checkIfAuthorized) {
    console.log("Unauthorized user received in ws backend");
    // Send an unauthorized message to the client
    ws.send(
      JSON.stringify({
        type: "UNAUTHORIZED",
        payload: {
          message:
            "You are not authorized to connect to the ws WebSocketServer",
        },
      }),
    );
    // Close the WebSocket connection
    ws.terminate();
    return;
  }
  console.log("Client is authorized and authenticated in ws backend");
  console.log(
    `HTTP protocol is upgraded to WS protocol and is communicating on PORT ${PORT}`,
  );

  ws.isAlive = true;

  ws.on("error", onSocketPostError);

  ws.on("message", function message(data: any) {
    try {
      const jsonData = JSON.parse(data.toString());
      // console.log("JSON DATA received from client : ", jsonData);

      // jsonData.wscale = "Hi from sanam wscale!";
      // wss.clients.forEach(function each(client) {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(JSON.stringify(jsonData));
      //   }
      // });

      messageHandler(ws, jsonData);
    } catch (error) {
      console.error(error);
    }
  });

  ws.on("close", () => {
    console.log("Connection closed from ws server");
  });
});

const interval = setInterval(() => {
  console.log("PING initiated from ws backend");
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
  if (message.type == INCOMING_SUPPORTED_MESSAGE.PONG) {
    console.log("PONG received by ws backend!");
    const payload = message.payload;
    if (payload.HEARTBEAT_VALUE == HEARTBEAT_VALUE) {
      ws.isAlive = true;
    }
  }

  // handle form here, code here --------------------------------------

  if (message.type == INCOMING_SUPPORTED_MESSAGE.JOIN_ROOM) {
    console.log(message);
    const payload = message.payload;
    userManager.addUser(
      payload.name,
      payload.userId,
      payload.roomId,
      ws,
      payload.email,
      payload.age,
      payload.gender,
      payload.college,
      payload.lat,
      payload.lng,
      payload.dist_meters ?? undefined,
      payload.Photo ?? undefined,
      payload.mask ?? undefined,
    );
  }

  if (message.type == INCOMING_SUPPORTED_MESSAGE.LEAVE_ROOM) {
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
      },
    };

    userManager.broadcastToRoom(
      payload.roomId,
      payload.userId,
      outgoingPayload,
    );
  }

  if (message.type === INCOMING_SUPPORTED_MESSAGE.SEND_MESSAGE) {
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

  if (message.type === INCOMING_SUPPORTED_MESSAGE.SEND_LOCATION) {
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

    /* 
      Update the location to the Postgres database
      via the ts-backend
    */

    // const response = axios.post("localhost:5050/api/addLocation",
    //   {

    //   },
    //  {
    //     headers : {
    //       "Authorization": `Bearer ${token}`,
    //       "Content-Type": "application/json"
    //     }
    //  });

    const outgoingPayload: OUTGOING_MESSAGE = {
      type: OUTGOING_SUPPORTED_MESSAGE.ADD_LOCATION,
      payload: {
        name: payload.name,
        userId: payload.userId,
        roomId: payload.roomId,
        position: {
          lat: payload.position.lat,
          lng: payload.position.lng,
        },
        email: payload.email,
        age: payload.age,
        gender: payload.gender,
        college: payload.college,
        Photo: payload.Photo,
        mask: payload.mask,
        dist_meters: payload.dist_meters,
      },
    };
    userManager.broadcastToRoom(
      payload.roomId,
      payload.userId,
      outgoingPayload,
    );
  }
}
