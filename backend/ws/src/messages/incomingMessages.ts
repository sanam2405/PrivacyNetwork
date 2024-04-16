import z from "zod";

export enum SUPPORTED_MESSAGES {
  JOIN_ROOM = "JOIN_ROOM",
  SEND_MESSAGE = "SEND_MESSAGE",
  SEND_LOCATION = "SEND_LOCATION",
}

export type INCOMING_MESSAGE =
  | {
      type: SUPPORTED_MESSAGES.JOIN_ROOM;
      payload: InitMessageType;
    }
  | {
      type: SUPPORTED_MESSAGES.SEND_MESSAGE;
      payload: UserMessageType;
    }
  | {
      type: SUPPORTED_MESSAGES.SEND_LOCATION;
      payload: UserLocationType;
    };

export const InitMessage = z.object({
  name: z.string(),
  userId: z.string(),
  roomId: z.string(),
});

export type InitMessageType = z.infer<typeof InitMessage>;

export const UserMessage = z.object({
  userId: z.string(),
  roomId: z.string(),
  message: z.string(),
});

export type UserMessageType = z.infer<typeof UserMessage>;

export const UserLocation = z.object({
  userId: z.string(),
  roomId: z.string(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  message: z.string(),
});

export type UserLocationType = z.infer<typeof UserLocation>;
