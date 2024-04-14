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
      newSocket.send("Hello from WS Client!");
    };
    newSocket.onmessage = (message) => {
      console.log("Message received:", message.data);
      setLatestMessage(message.data);
    };
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return <>{socket ? <h1>{latestMessage}</h1> : <Loader />}</>;
};
