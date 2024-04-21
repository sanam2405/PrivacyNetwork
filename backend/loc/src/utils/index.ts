import wellknown, { GeoJSONPoint } from "wellknown";

// Function to convert latitude and longitude to WKT format
export function coordinatesToWKT(latitude: number, longitude: number): string {
  const point: GeoJSONPoint = {
    type: "Point",
    coordinates: [longitude, latitude], // Note: longitude first, then latitude
  };
  return wellknown.stringify(point);
}

// Example usage
// const latitudeOne = 40.7128; // Example latitudeOne
// const longitudeOne = -74.0060; // Example longitudeOne

// const wkt = coordinatesToWKT(latitudeOne, longitudeOne);
// console.log('WKT:', wkt);

// Function to parse WKT format to latitude and longitude
export function wktToCoordinates(wkt: string): {
  latitude: number;
  longitude: number;
} {
  // @ts-ignore
  const point: any = wellknown.parse(wkt);
  const [longitude, latitude] = point?.coordinates;
  return { latitude, longitude };
}

// Example usage
// const wktString = wkt; // Example WKT string
// const { latitude, longitude } = wktToCoordinates(wktString);
// console.log('latitude:', latitude);
// console.log('Longitude:', longitude);
