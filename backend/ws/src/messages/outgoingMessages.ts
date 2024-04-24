export enum SUPPORTED_MESSAGES {
  LEAVE_ROOM = "LEAVE_ROOM",
  SEND_MESSAGE = "SEND_MESSAGE",
  ADD_LOCATION = "ADD_LOCATION",
  UPDATE_LOCATION = "UPDATE_LOCATION",
}

type MESSAGE_PAYLOAD = {
  userId: string;
  roomId: string;
  position?: {
    lat: number;
    lng: number;
  };
  message?: string;
  STATUS_CODE?: number;
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
      type: SUPPORTED_MESSAGES.UPDATE_LOCATION;
      payload: MESSAGE_PAYLOAD;
    }
  | {
      type: SUPPORTED_MESSAGES.SEND_MESSAGE;
      payload: MESSAGE_PAYLOAD;
    };
