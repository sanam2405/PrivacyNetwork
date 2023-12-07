import React from "react";
import Map from "./Map";
// import { io } from 'socket.io-client';
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

const Client = () => {
  // const io = new Server({
  //     cors: {
  //       origin: "http://localhost:3000"
  //     }
  // });
  // io.listen(4000);


  return (<>
    <Map />
  </>);
};

export default Client;
