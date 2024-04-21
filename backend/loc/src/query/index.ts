import { PrismaClient } from "@prisma/client";
import { coordinatesToWKT } from "./../utils";

const prisma = new PrismaClient();

async function getNearbyEntities(
  latitude: number,
  longitude: number,
  entityType: string,
) {
  const wktPoint = coordinatesToWKT(latitude, longitude);
  const nearbyEntities = await prisma.$queryRaw`
        SELECT *
        FROM nearby_entities(${latitude}, ${longitude}, ${entityType})
    `;
  return nearbyEntities;
}

async function getNearbyEntitiesWithinDMeters(
  latitude: number,
  longitude: number,
  D: number,
  entityType: string,
) {
  const wktPoint = coordinatesToWKT(latitude, longitude);
  const nearbyEntities = await prisma.$queryRaw`
        SELECT *
        FROM nearby_entities_within_d(${latitude}, ${longitude}, ${D}, ${entityType})
    `;
  return nearbyEntities;
}

async function getPrivacyEntities(
  latitude: number,
  longitude: number,
  D: number,
  age: number,
  college: string,
  gender: string,
  entityType: string,
) {
  const wktPoint = coordinatesToWKT(latitude, longitude);
  const privacyEntities = await prisma.$queryRaw`
       SELECT * FROM nearby_privacy_entities(
           ${latitude},
            ${longitude}, 
            ${D}, 
            ${age}, 
            ${college}, 
            ${gender},
            ${entityType}
        )
    `;
  return privacyEntities;
}

async function main() {
  try {
    const latitude: number = 22.40456; // Example latitude
    const longitude: number = 88.126; // Example longitude
    const threasholdDistance: number = 70000; // Example limit distance in meters
    const threasholdAge: number = 60; // Example limit age in years
    const targetCollege: string = "College 3";
    const targetGender: string = "Male";
    const entityType: string = "user"; // Example entity type

    // SELECT * FROM nearby_entities(22.40456, 88.1260, 'user')
    const nearbyEntities = await getNearbyEntities(
      latitude,
      longitude,
      entityType,
    );
    console.log("USERS NEARBY");
    console.log(nearbyEntities);

    // SELECT * FROM nearby_entities_within_d(22.40456, 88.1260, 70000, 'user')
    const nearbyEntitiesWithinDMeters = await getNearbyEntitiesWithinDMeters(
      latitude,
      longitude,
      threasholdDistance,
      entityType,
    );
    console.log(`USERS NEARBY WITHIN ${threasholdDistance} meters`);
    console.log(nearbyEntitiesWithinDMeters);

    // SELECT * FROM nearby_privacy_entities(22.40456, 88.1260, 70000, 60, 'College 3', 'Male',  'user')
    const privacyEntities = await getPrivacyEntities(
      latitude,
      longitude,
      threasholdDistance,
      threasholdAge,
      targetCollege,
      targetGender,
      entityType,
    );
    console.log(
      `PRIVACY ${targetGender} USERS NEARBY WITHIN ${threasholdDistance} meters and age less than ${threasholdAge} with college ${targetCollege}`,
    );
    console.log(privacyEntities);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
