import express, { Request, Response } from "express";
import z from "zod";
import HttpStatusCode from "../types/HttpStatusCode";
import { interBackendAccess } from "../middlewares/interBackendAccess";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userUpdateRequest = z.object({
  id: z.string(),
  age: z.number(),
  gender: z.string(),
  college: z.string(),
  visibility: z.boolean(),
});

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.put("/signup", interBackendAccess, async (req: Request, res: Response) => {
  const userUpdatePayload = req.body;
  const parsedPayload = userUpdateRequest.safeParse(userUpdatePayload);

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
});

export default userRouter;
