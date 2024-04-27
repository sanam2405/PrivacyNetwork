import express, { Request, Response } from "express";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import HttpStatusCode from "../types/HttpStatusCode";
import { interBackendAccess } from "../middlewares/interBackendAccess";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userRouter = express.Router();

userRouter.use(express.json());

const userFieldUpdateRequest = z.object({
  id: z.string(),
  age: z.number(),
  gender: z.string(),
  college: z.string(),
  visibility: z.boolean(),
});

userRouter.put(
  "/setProperties",
  interBackendAccess,
  async (req: Request, res: Response) => {
    const userFieldUpdatePayload = req.body;
    const parsedPayload = userFieldUpdateRequest.safeParse(
      userFieldUpdatePayload,
    );

    if (!parsedPayload.success) {
      res.status(HttpStatusCode.LENGTH_REQUIRED).json({
        msg: "You sent the wrong inputs",
      });
      return;
    }

    const { id, age, gender, college, visibility } = parsedPayload.data;

    try {
      // check if existing user or not
      const existingUser = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingUser) {
        res.status(HttpStatusCode.NOT_FOUND).json({
          msg: "User not found",
        });
        return;
      }

      // Update the user with new data
      const updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          age,
          college,
          gender,
          isVisible: visibility,
        },
      });

      res.status(HttpStatusCode.OK).json({
        msg: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        msg: "Failed to update user",
      });
    }
  },
);

// ---------------

const userLocationUpdateRequest = z.object({
  id: z.string(),
  lat: z.number(),
  lng: z.number(),
});

userRouter.put(
  "/setLocation",
  interBackendAccess,
  async (req: Request, res: Response) => {
    const userLocationUpdatePayload = req.body;
    const parsedPayload = userLocationUpdateRequest.safeParse(
      userLocationUpdatePayload,
    );

    if (!parsedPayload.success) {
      res.status(HttpStatusCode.LENGTH_REQUIRED).json({
        msg: "You sent the wrong inputs",
      });
      return;
    }

    const { id, lat, lng } = parsedPayload.data;

    try {
      // Check if the user exists
      const existingUser = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingUser) {
        res.status(HttpStatusCode.NOT_FOUND).json({
          msg: "User not found",
        });
        return;
      }

      // Check if the user already has a location
      if (existingUser.locationId) {
        // Update the user's location
        const updatedUser = await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            location: {
              update: {
                latitude: lat,
                longitude: lng,
                updatedAt: new Date(),
              },
            },
          },
        });

        res.status(HttpStatusCode.OK).json({
          msg: "User location updated successfully",
          user: updatedUser,
        });
      } else {
        // Create a new location and link it to the user
        const newLocation = await prisma.location.create({
          data: {
            id: uuidv4(),
            latitude: lat,
            longitude: lng,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Update the user's locationId with the ID of the newly created location
        const updatedUser = await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            locationId: newLocation.id,
          },
        });

        res.status(HttpStatusCode.OK).json({
          msg: "User location updated successfully",
          user: updatedUser,
        });
      }
    } catch (error) {
      console.error("Error updating user location:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        msg: "Failed to update user location",
      });
    }
  },
);

export default userRouter;
