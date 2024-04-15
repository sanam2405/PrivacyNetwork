import express from "express";
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

const app = express();
const PORT: string | number = process.env.PORT || 8080;

const httpServer = app.listen(PORT);

const wss = new WebSocketServer({ server: httpServer });

const userManager = new UserManager();
const store = new InMemoryStore();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data, isBinary) {
    // console.log("Inside on message fn");
    try {
      // If data is binary, convert it to a string
      const dataString = data.toString();
      const jsonData = JSON.parse(dataString);
      console.log("JSON DATA : ", jsonData);
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
});

function messageHandler(ws: WebSocket, message: INCOMING_MESSAGE) {
  if (message.type == SUPPORTED_MESSAGES.JOIN_ROOM) {
    const payload = message.payload;
    userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
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
    userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
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
    userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
  }
}
