export enum SUPPORTED_MESSAGES {
  LEAVE_ROOM = "LEAVE_ROOM",
  SEND_MESSAGE = "SEND_MESSAGE",
  ADD_LOCATION = "ADD_LOCATION",
}

type MESSAGE_PAYLOAD = {
  name?: string;
  userId: string;
  roomId: string;
  email?: string;
  age?: number;
  gender?: string;
  college?: string;
  dist_meters?: number;
  Photo?: string;
  mask?: boolean;
  position?: {
    lat: number;
    lng: number;
  };
  message?: string;
};

export type OUTGOING_MESSAGE =
  | {
      type: SUPPORTED_MESSAGES.LEAVE_ROOM;
      payload: MESSAGE_PAYLOAD;
    }
  | {
      type: SUPPORTED_MESSAGES.ADD_LOCATION;
      payload: MESSAGE_PAYLOAD;
    }
  | {
      type: SUPPORTED_MESSAGES.SEND_MESSAGE;
      payload: MESSAGE_PAYLOAD;
    };
