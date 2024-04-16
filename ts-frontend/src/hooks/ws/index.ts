import { useState, useEffect } from "react";
import { useLocations } from "../../context/LocationContext";

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const { locations, setLocations } = useLocations();

  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      // Handle WebSocket open event
      console.log("WebSocket connection established");
    };

    newSocket.onclose = () => {
      // Handle WebSocket close event
      console.log("WebSocket connection closed");
    };

    newSocket.onerror = (error) => {
      // Handle WebSocket error event
      console.error("WebSocket error:", error);
    };

    newSocket.onmessage = (message) => {
      // Handle incoming messages
      //   console.log("Message received:", message.data);
      const jsonMessage = JSON.parse(message.data);
      const {
        userId,
        roomId,
        message: userMessage,
        position,
      } = jsonMessage.payload || {};

      setLatestMessage(
        `USER = ${userId}, from ROOM = ${roomId}, says: ${userMessage}`,
      );

      if (position) {
        const { lat, lng } = position;
        setLocations((prevLocations) => [...prevLocations, { lat, lng }]);
      }
    };

    setSocket(newSocket);

    return () => {};
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (message: any) => {
    // Function to send messages over the WebSocket connection
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket connection is not open");
    }
  };

  return { socket, latestMessage, locations, sendMessage };
};

export default useSocket;
