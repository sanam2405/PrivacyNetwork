import z from "zod";

export enum SUPPORTED_MESSAGES {
  PONG = "PONG",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  SEND_MESSAGE = "SEND_MESSAGE",
  SEND_LOCATION = "SEND_LOCATION",
}

export type INCOMING_MESSAGE =
  | {
      type: SUPPORTED_MESSAGES.PONG;
      payload: PongMessageType;
    }
  | {
      type: SUPPORTED_MESSAGES.JOIN_ROOM;
      payload: InitMessageType;
    }
  | {
      type: SUPPORTED_MESSAGES.LEAVE_ROOM;
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

export const PongMessage = z.object({
  HEARTBEAT_VALUE: z.number(),
});

export type PongMessageType = z.infer<typeof PongMessage>;

export const InitMessage = z.object({
  name: z.string(),
  userId: z.string(),
  roomId: z.string(),
  email: z.string(),
  age: z.number(),
  gender: z.string(),
  college: z.string(),
  lat: z.number(),
  lng: z.number(),
  dist_meters: z.number().optional(),
  Photo: z.string().optional(),
  mask: z.boolean().optional(),
});

export type InitMessageType = z.infer<typeof InitMessage>;

export const ExitMessage = z.object({
  userId: z.string(),
  roomId: z.string(),
});

export type ExitMessageType = z.infer<typeof ExitMessage>;

export const UserMessage = z.object({
  userId: z.string(),
  roomId: z.string(),
  message: z.string(),
});

export type UserMessageType = z.infer<typeof UserMessage>;

export const UserLocation = z.object({
  name: z.string(),
  userId: z.string(),
  roomId: z.string(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  email: z.string(),
  age: z.number(),
  gender: z.string(),
  college: z.string(),
  dist_meters: z.number().optional(),
  Photo: z.string(),
  mask: z.boolean().optional(),
});

export type UserLocationType = z.infer<typeof UserLocation>;
