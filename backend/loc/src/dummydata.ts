import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate a random string as ID
function generateRandomId(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to generate random latitude and longitude
function generateRandomCoordinate() {
  // Random location between Krishnanagar and Arambag, West Bengal
  const minLat = 22.876503;
  const maxLat = 23.40131;
  const minLong = 87.790951;
  const maxLong = 88.502115;

  const latitude = Math.random() * (maxLat - minLat) + minLat;
  const longitude = Math.random() * (maxLong - minLong) + minLong;

  return { latitude, longitude };
}

// Function to generate random users
async function generateRandomUsers(numUsers: number) {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const id = generateRandomId(10);
    const name = `User ${i}`;
    const email = `user${i}@example.com`;
    const minAge = 18;
    const maxAge = 117;
    const randomAge = (Math.random() * (maxAge - minAge) + minAge).toFixed(2);
    const age = parseFloat(randomAge);

    const gender = Math.random() < 0.5 ? 'Male' : 'Female';
    const college = `College ${Math.floor(Math.random() * 10)}`; // Random college
    const isVisible = Math.random() < 0.8; // 80% chance of being visible

    users.push({
      id,
      name,
      email,
      age,
      gender,
      college,
      isVisible,
    });
  }
  return users;
}

// Function to generate random locations and insert them into the database
async function generateAndInsertRandomLocations(numLocations: number) {
  const locations = [];
  for (let i = 0; i < numLocations; i++) {
    const { latitude, longitude } = generateRandomCoordinate();
    const createdLocation = await prisma.location.create({
      data: {
        latitude,
        longitude,
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
    });
    locations.push(createdLocation);
  }
  return locations;
}

// Function to insert users and connect them to random locations
async function insertUsersAndConnectToLocations(users: any[], locations: any[]) {
  const createdUsers = [];
  for (const user of users) {
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        location: {
          connect: {
            id: randomLocation.id,
          },
        },
      },
    });
    createdUsers.push(createdUser);
  }
  return createdUsers;
}

async function main() {
  const numUsers = 500;
  const numLocations = 50; // Assuming we have 50 locations

  // Generate random users
  const users = await generateRandomUsers(numUsers);

  // Generate and insert random locations
  const locations = await generateAndInsertRandomLocations(numLocations);

  // Connect users to random locations
  await insertUsersAndConnectToLocations(users, locations);

  console.log('Users and locations inserted successfully!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
