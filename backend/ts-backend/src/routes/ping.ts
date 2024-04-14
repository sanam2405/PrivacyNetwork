import express, { Request, Response } from "express";
import HttpStatusCode from "../types/HttpStatusCode";

const pingRouter = express.Router();

pingRouter.use(express.json());

pingRouter.post("/ping", (_req: Request, res: Response) => {
  res
    .status(HttpStatusCode.OK)
    .json({ status: "The backend server is up and running" });
});

export default pingRouter;
