import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import HttpStatusCode from "../types/HttpStatusCode";

const pingRouter = express.Router();

pingRouter.use(express.json());

pingRouter.post("/ping", async (req: Request, res: Response) => {
  console.log("The loc server is pinged");

  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ errors: "You are unauthorized to access this resource" });
  }

  if (!process.env.BACKEND_INTERCOMMUNICATION_SECRET) {
    console.error(
      "BACKEND_INTERCOMMUNICATION_SECRET is undefined. Check the .env",
    );
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ errors: "Internal Server Error" });
  }

  const token = authorization.replace("Bearer ", "");

  const isMatch = bcrypt.compareSync(
    process.env.BACKEND_INTERCOMMUNICATION_SECRET,
    token,
  );

  if (!isMatch) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ errors: "You are unauthorized to access this resource" });
  }

  res
    .status(HttpStatusCode.OK)
    .json({ status: "The loc postgres backend server is up and running" });
});

export default pingRouter;
