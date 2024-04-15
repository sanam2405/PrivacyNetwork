export type UserId = string;

export interface pos {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  userId: UserId;
  name: string;
  position: pos;
}

export abstract class Store {
  constructor() {}

  initRoom(roomId: string) {}

  getLocation(room: string, limit: number, offset: number) {}

  addLocation(userId: UserId, name: string, room: string, position: pos) {}
}
