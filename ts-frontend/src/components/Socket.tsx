import { useEffect, useState } from "react";
import Loader from "./Loader";

export const Socket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const BASE_WS_URI = import.meta.env.VITE_WS_URI;

  useEffect(() => {
    const newSocket = new WebSocket(BASE_WS_URI);
    newSocket.onopen = () => {
      console.log("Connection established from Client");
      newSocket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            name: "Manas",
            userId: "1a",
            roomId: "202A",
          },
        }),
      );
      newSocket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            name: "Manasi",
            userId: "1b",
            roomId: "202A",
          },
        }),
      );
      newSocket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            name: "Sanam",
            userId: "1c",
            roomId: "202A",
          },
        }),
      );
      newSocket.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          payload: {
            userId: "1a",
            roomId: "202A",
            message: "Hello from WS Client!",
          },
        }),
      );
      newSocket.onmessage = (message) => {
        console.log("Message received:", message.data);
        const jsonMessage = JSON.parse(message.data);
        const userId = jsonMessage.payload?.userId;
        const roomId = jsonMessage.payload?.roomId;
        const userMessage = jsonMessage.payload?.message;

        setLatestMessage(
          `USER = ${userId}, from ROOM = ${roomId}, says: ${userMessage}`,
        );
      };
    };
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  return <>{socket ? <h1>{latestMessage}</h1> : <Loader />}</>;
};
