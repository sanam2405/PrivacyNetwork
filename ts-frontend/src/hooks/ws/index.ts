import { useState, useEffect, useRef } from "react";
import { useQLocations } from "../../context/QLocationContext";
import {
  CLIENT_HEARTBEAT_VALUE,
  CLIENT_HEARTBEAT_TIMEOUT,
} from "../../constants";

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const ws = useRef<WebSocketExt | null>(null);
  const {
    qLocations,
    setQLocations,
    qLocationsUserIdSet,
    setQLocationsUserIdSet,
  } = useQLocations();

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectToWebSocketServer = async (token: string) => {
    return new Promise<void>((resolve, reject) => {
      ws.current = new WebSocket(`${url}?token=${token}`) as WebSocketExt;

      ws.current.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      });

      ws.current.addEventListener("open", () => {
        console.log("WebSocket connection established");
        setIsConnected(true);
        console.log("Promise resolved");
        resolve();
      });
    });
  };

  const handleConnectionOpen = async () => {
    if (ws.current) {
      ws.current.close();
    }

    const token = localStorage.getItem("jwt") || "";
    if (token.length === 0) {
      console.error("JWT token is not found in the local storage");
    }

    try {
      await connectToWebSocketServer(token);
    } catch (error) {
      console.error("Error connecting to ws backend", error);
    }

    if (ws.current) {
      ws.current.addEventListener("close", () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
      });

      ws.current.addEventListener("message", (msg) => {
        console.log(`Received message: ${msg.data}`);
        const parsedData = JSON.parse(msg.data);
        const MESSAGE_TYPE = parsedData.type;
        console.log(MESSAGE_TYPE);
        const userId = parsedData.payload.userId;
        const roomId = parsedData.payload.roomId;
        const position = parsedData.payload.position;
        if (MESSAGE_TYPE === "PING") {
          heartbeat();
        } else if (MESSAGE_TYPE === "UNAUTHORIZED") {
          alert(parsedData.payload.message);
        } else if (MESSAGE_TYPE === "SEND_MESSAGE") {
          console.log("Client received msg ", parsedData.payload.message);
        } else if (MESSAGE_TYPE === "LEAVE_ROOM") {
          console.log(`REMOVED: User ${userId} in room ${roomId}`);
        } else if (MESSAGE_TYPE === "ADD_LOCATION") {
          // const lat = parsedData.payload.position.lat;
          // const lng = parsedData.payload.position.lng;
          const { lat, lng } = position;
          console.log(
            `ADDED: User ${userId} in room ${roomId} has lat: ${lat}, lng: ${lng}`,
          );

          const userKey = userId.toString();
          if (!qLocationsUserIdSet.has(userKey)) {
            qLocationsUserIdSet.add(userKey);
            setQLocationsUserIdSet(qLocationsUserIdSet);

            setQLocations((prevLocations) => [
              ...prevLocations,
              {
                id: userKey,
                name: parsedData.payload.name,
                email: parsedData.payload.email,
                age: parsedData.payload.age,
                gender: parsedData.payload.gender,
                college: parsedData.payload.college,
                lat: position.lat,
                lng: position.lng,
                dist_meters: parsedData.payload.dist_meters,
                Photo: parsedData.payload.Photo,
                mask: parsedData.payload.mask,
              },
            ]);
          } else {
            // Find the existing location by userKey
            const existingLocationIndex = qLocations.findIndex(
              (location) => location.id === userKey,
            );

            if (existingLocationIndex !== -1) {
              // Update the existing location properties
              setQLocations((prevLocations) => {
                const updatedLocations = [...prevLocations];
                updatedLocations[existingLocationIndex] = {
                  ...updatedLocations[existingLocationIndex],
                  // Update specific properties here (e.g., lat, lng, etc.)
                  lat: position.lat,
                  lng: position.lng,
                  // Add other properties as needed
                };
                return updatedLocations;
              });
              console.log(`User with id ${userKey} LOCATION updated!`);
            } else {
              console.log(
                `User with id ${userKey} not found. LOCATION updating failed`,
              );
            }
          }
        }
      });
    }
  };

  const closeConnection = async (roomId: string, userId: string) => {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "LEAVE_ROOM",
          payload: {
            roomId: roomId,
            userId: userId,
          },
        }),
      );
      ws.current.close();
    }
  };

  function heartbeat() {
    if (ws.current === null) {
      return;
    } else if (ws.current.pingTimeout !== null) {
      clearTimeout(ws.current.pingTimeout);
    }

    ws.current.pingTimeout = setTimeout(() => {
      ws.current?.close();

      // business logic for deciding whether or not to reconnect
    }, CLIENT_HEARTBEAT_TIMEOUT);

    ws.current.send(
      JSON.stringify({
        type: "PONG",
        payload: {
          HEARTBEAT_VALUE: CLIENT_HEARTBEAT_VALUE,
        },
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (message: any) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.log(
        "No WebSocket connection established from the client. Connect to WScale",
      );
      return;
    }

    ws.current.send(JSON.stringify(message));
  };

  return {
    isConnected,
    handleConnectionOpen,
    closeConnection,
    sendMessage,
  };
};
