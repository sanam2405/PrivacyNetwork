import express, { Request, Response } from "express";
import HttpStatusCode from "../types/HttpStatusCode";
import { interBackendAccess } from "../middlewares/interBackendAccess";

const pingRouter = express.Router();

pingRouter.use(express.json());

pingRouter.post(
  "/ping",
  interBackendAccess,
  async (req: Request, res: Response) => {
    console.log("The loc server is pinged");

    res
      .status(HttpStatusCode.OK)
      .json({ status: "The loc postgres backend server is up and running" });
  },
);

export default pingRouter;
