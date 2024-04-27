import express, { Request, Response } from "express";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import HttpStatusCode from "../types/HttpStatusCode";
import { interBackendAccess } from "../middlewares/interBackendAccess";

const prisma = new PrismaClient();

const signUpRequest = z.object({
  name: z.string(),
  email: z.string(),
});

const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post(
  "/signup",
  interBackendAccess,
  async (req: Request, res: Response) => {
    const signUpPayload = req.body;
    const parsedPayload = signUpRequest.safeParse(signUpPayload);

    if (!parsedPayload.success) {
      res.status(HttpStatusCode.LENGTH_REQUIRED).json({
        msg: "You sent the wrong inputs from LOC Server",
      });
      return;
    }

    const { name, email } = parsedPayload.data;

    try {
      // check if existing user or not
      const existingUser = await prisma.user.findMany({
        where: {
          email: email,
        },
      });

      if (existingUser.length) {
        res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({
          msg: "A user already exists with the email from LOC server",
        });
        return;
      }

      const newUser = await prisma.user.create({
        data: {
          id: uuidv4(),
          name,
          email,
          age: 18,
          gender: "Non Binary",
          college: "IIT",
          isVisible: true,
        },
      });

      res.status(HttpStatusCode.CREATED).json({
        msg: "User created successfully from LOC server",
        user: newUser,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        msg: "Failed to create user from LOC server",
      });
    }
  },
);

export default authRouter;
