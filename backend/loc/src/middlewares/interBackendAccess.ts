import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../types/HttpStatusCode";
import bcrypt from "bcryptjs";

export const interBackendAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  try {
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

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ errors: "You must be logged in" });
  }
};
