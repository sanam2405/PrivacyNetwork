import { WebSocket } from "ws";
import { OUTGOING_MESSAGE } from "./messages/outgoingMessages";

interface User {
  name: string;
  id: string;
  conn: WebSocket;
}

interface Room {
  users: User[];
}

export class UserManager {
  private rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map<string, Room>();
  }

  addUser(name: string, userId: string, roomId: string, socket: WebSocket) {
    if (!this.rooms.get(roomId)) {
      this.rooms.set(roomId, {
        users: [],
      });
    }

    const existingUser = this.getUser(roomId, userId);
    if (existingUser) {
      console.log(`User with id ${userId} already exists in the room!`);
      return;
    }

    this.rooms.get(roomId)?.users.push({
      id: userId,
      name,
      conn: socket,
    });
    console.log(`User with id ${userId} added!`);
    socket.on("close", () => {
      console.log("Socket is getting closed!");
      this.removeUser(roomId, userId);
    });
  }

  removeUser(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.users = room.users.filter(({ id }) => id !== userId);
      console.log(`User with id ${userId} removed!`);
    } else {
      console.error(`Error occurred while removing user with id ${userId}`);
    }
  }

  getUser(roomId: string, userId: string): User | null {
    const user = this.rooms.get(roomId)?.users.find(({ id }) => id === userId);
    return user ?? null;
  }

  broadcast(roomId: string, userId: string, message: OUTGOING_MESSAGE) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error("Room not found");
      return;
    }

    const user = this.getUser(roomId, userId);
    if (!user) {
      console.error("User not found");
      return;
    }
    room.users.forEach(({ conn, id }) => {
      if (id === userId) {
      } else {
        console.log(
          "Outgoing broadcasted message to user:",
          id + " " + JSON.stringify(message),
        );
        conn.send(JSON.stringify(message));
      }
    });
  }
}
