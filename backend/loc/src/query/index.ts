import { PrismaClient } from "@prisma/client";
import { coordinatesToWKT } from "./../utils";

const prisma = new PrismaClient();

export async function getNearbyEntities(
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

export async function getNearbyEntitiesWithinDMeters(
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

export async function getPrivacyEntities(
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

export async function getPrivacyEntitiesWithVisibility(
  latitude: number,
  longitude: number,
  D: number,
  age: number,
  college: string,
  gender: string,
  isVisible: boolean,
  entityType: string,
) {
  const wktPoint = coordinatesToWKT(latitude, longitude);
  const privacyEntities = await prisma.$queryRaw`
       SELECT * FROM nearby_privacy_entities_visibility(
           ${latitude},
            ${longitude}, 
            ${D}, 
            ${age}, 
            ${college}, 
            ${gender},
            ${isVisible},
            ${entityType}
        )
    `;
  return privacyEntities;
}

async function main() {
  try {
    const latitude: number = 22.40456; // Example latitude
    const longitude: number = 88.126; // Example longitude
    const thresholdDistance: number = 70000; // Example limit distance in meters
    const thresholdAge: number = 60; // Example limit age in years
    const targetCollege: string = "Jadavpur University";
    const targetGender: string = "Male";
    const targetVisibility: boolean = false;
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
      thresholdDistance,
      entityType,
    );
    console.log(`USERS NEARBY WITHIN ${thresholdDistance} meters`);
    console.log(nearbyEntitiesWithinDMeters);

    // SELECT * FROM nearby_privacy_entities(22.40456, 88.1260, 70000, 60, 'College 3', 'Male',  'user')
    const privacyEntities = await getPrivacyEntities(
      latitude,
      longitude,
      thresholdDistance,
      thresholdAge,
      targetCollege,
      targetGender,
      entityType,
    );
    console.log(
      `PRIVACY ${targetGender} USERS NEARBY WITHIN ${thresholdDistance} meters and age less than ${thresholdAge} with college ${targetCollege}`,
    );

    console.log(privacyEntities);

    const privacyEntitiesWithVisibility =
      await getPrivacyEntitiesWithVisibility(
        latitude,
        longitude,
        thresholdDistance,
        thresholdAge,
        targetCollege,
        targetGender,
        targetVisibility,
        entityType,
      );
    console.log(
      `PRIVACY ${targetGender} USERS NEARBY WITHIN ${thresholdDistance} meters and age less than ${thresholdAge} with college ${targetCollege} and visibility ${targetVisibility}`,
    );
    console.log(privacyEntitiesWithVisibility);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// main();
