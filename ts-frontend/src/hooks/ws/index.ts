/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extra-boolean-cast */
import { useState, useEffect } from "react";
import { useLocations } from "../../context/LocationContext";
// import { toast } from "react-toastify";
const CLIENT_HEARTBEAT_TIMEOUT = 1000 * 5 + 1000 * 60; // 5 + 60 second (timeout + buffer time for server response)
const CLIENT_HEARTBEAT_VALUE = 1;

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocketExt | null>(null);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  const [latestMessage, setLatestMessage] = useState("");
  const { locations, setLocations } = useLocations();
  const { locationsUserIdSet, setLocationsUserIdSet } = useLocations();

  // const notifyA = (message: string): void => {
  //   toast.success(message);
  // };
  // const notifyB = (message: string): void => {
  //   toast.error(message);
  // };

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
        const {
          userId,
          roomId,
          message: userMessage,
          HEARTBEAT_VALUE,
          STATUS_CODE,
          position,
        } = jsonMessage.payload || {};

        // user is not authorized
        if (STATUS_CODE == 401) {
          console.log(userMessage);
        }

        /*
          Handle logic for Location Context to render updated 
          markers after client has disconnected
        */

        // user has disconnected / 404 NOT FOUND
        if (STATUS_CODE == 404) {
          console.log(
            `USER = ${userId}, from ROOM = ${roomId}, has disconnected`,
          );
          console.log("Previous Locations : ");
          console.log(locations);
          const newLocations = locations.filter((loc) => {
            return userId !== loc.userId;
          });
          const userKey = userId.toString();
          if (locationsUserIdSet.has(userKey)) {
            console.log("Its my time to leave the world ...");
            locationsUserIdSet.delete(userKey);
            setLocationsUserIdSet(locationsUserIdSet);
          }
          console.log("After locations : ");
          console.log(newLocations);
          setLocations(newLocations);
        }

        if (userMessage) {
          setLatestMessage(
            `USER = ${userId}, from ROOM = ${roomId}, says: ${userMessage}`,
          );
        }

        if (position) {
          const { lat, lng } = position;
          // Update state
          // also give a check at hashset
          const userKey = userId.toString();
          if (!locationsUserIdSet.has(userKey)) {
            console.log("User id is completely new to set ...");
            setLocations((prevLocations) => [
              ...prevLocations,
              { userId, lat, lng },
            ]);
            locationsUserIdSet.add(userKey);
            setLocationsUserIdSet(locationsUserIdSet);
            setTimeout(() => {
              console.log("Position : ");
              console.log(position);
              console.log("Location array after updation : ");
              console.log(locations);
            }, 2000);
          }
        }

        if (HEARTBEAT_VALUE) {
          console.log("Pong received by frontend client");
          if (HEARTBEAT_VALUE == CLIENT_HEARTBEAT_VALUE) {
            heartbeat();
          }
        }
      };
    }

    return () => {};
  }, [socket, locations]);

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

    console.log("Pong initiated from frontend client");
    socket.send(
      JSON.stringify({
        type: "PONG",
        payload: {
          HEARTBEAT_VALUE: CLIENT_HEARTBEAT_VALUE,
        },
      }),
    );
  }

  function closeConnection(roomId: string, userId: string) {
    if (!!socket) {
      socket.send(
        JSON.stringify({
          type: "LEAVE_ROOM",
          payload: {
            roomId: roomId,
            userId: userId,
          },
        }),
      );
      setLocations([]);
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
      // console.log("creating new WebSocket client");

      const token = localStorage.getItem("jwt");
      const newSocket = new WebSocket(`${url}?token=${token}`) as WebSocketExt;
      setSocket(newSocket);
    } else {
      // console.log("WebSocket connection is already open");
    }
  };

  return {
    socket,
    latestMessage,
    locations,
    sendMessage,
    openConnection,
    closeConnection,
    isWsConnected,
    setIsWsConnected,
  };
};

export default useSocket;
