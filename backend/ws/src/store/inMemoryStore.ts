import { Location, Store, UserId, pos } from "./Store";
let globalLocationId = 0;

export interface Room {
  roomId: string;
  locations: Location[];
}

export class InMemoryStore implements Store {
  private store: Map<string, Room>;

  constructor() {
    this.store = new Map<string, Room>();
  }

  initRoom(roomId: string) {
    this.store.set(roomId, {
      roomId,
      locations: [],
    });
  }

  getLocation(roomId: string, limit: number, offset: number) {
    const room = this.store.get(roomId);
    if (!room) {
      return [];
    }
    return room.locations
      .reverse()
      .slice(0, offset)
      .slice(-1 * limit);
  }

  addLocation(userId: UserId, name: string, roomId: string, position: pos) {
    if (!this.store.get(roomId)) {
      this.initRoom(roomId);
    }
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }
    const location = {
      id: (globalLocationId++).toString(),
      userId,
      name,
      position,
    };
    room.locations.push(location);
    return location;
  }
}
