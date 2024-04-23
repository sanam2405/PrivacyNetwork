/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extra-boolean-cast */
import { useState, useEffect } from "react";
import { useLocations } from "../../context/LocationContext";
const CLIENT_HEARTBEAT_TIMEOUT = 1000 * 5 + 1000 * 60; // 5 + 60 second (timeout + buffer time for server response)
const CLIENT_HEARTBEAT_VALUE = 1;

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocketExt | null>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const { locations, setLocations } = useLocations();

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        // Handle WebSocket open event
        console.log("WebSocket connection established");
      };

      socket.onclose = () => {
        // Handle WebSocket close event
        console.log("WebSocket connection closed from client");
      };

      socket.onerror = (error) => {
        // Handle WebSocket error event
        console.error("WebSocket error:", error);
      };

      socket.onmessage = (message) => {
        // Handle incoming messages
        const jsonMessage = JSON.parse(message.data);
        console.log("Frontend got ", jsonMessage);
        const {
          userId,
          roomId,
          message: userMessage,
          HEARTBEAT_VALUE,
          position,
        } = jsonMessage.payload || {};

        console.log("frontend got gb value", HEARTBEAT_VALUE);

        if (userMessage) {
          setLatestMessage(
            `USER = ${userId}, from ROOM = ${roomId}, says: ${userMessage}`,
          );
        }

        if (position) {
          const { lat, lng } = position;
          setLocations((prevLocations) => [...prevLocations, { lat, lng }]);
        }

        if (HEARTBEAT_VALUE) {
          if (HEARTBEAT_VALUE == CLIENT_HEARTBEAT_VALUE) {
            console.log("calling heartbeat");
            heartbeat();
          }
        }
      };
    }

    return () => {};
  }, [socket, setLocations]);

  function heartbeat() {
    if (!socket) {
      return;
    } else if (!!socket.pingTimeout) {
      clearTimeout(socket.pingTimeout);
    }

    socket.pingTimeout = setTimeout(() => {
      socket.close();

      // logic for deciding whether or not to reconnect
    }, CLIENT_HEARTBEAT_TIMEOUT);

    console.log("trying to send a pong");
    socket.send(
      JSON.stringify({
        type: "PONG",
        payload: {
          HEARTBEAT_VALUE: CLIENT_HEARTBEAT_VALUE,
        },
      }),
    );
  }

  function closeConnection() {
    if (!!socket) {
      console.log("inside conn close");
      socket.close();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (message: any) => {
    // Function to send messages over the WebSocket connection
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket connection is not open");
    }
  };

  const openConnection = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("creating new WebSocket client");
      const newSocket = new WebSocket(url) as WebSocketExt;
      setSocket(newSocket);
    } else {
      console.log("WebSocket connection is already open");
    }
  };

  return {
    socket,
    latestMessage,
    locations,
    sendMessage,
    openConnection,
    closeConnection,
  };
};

export default useSocket;
