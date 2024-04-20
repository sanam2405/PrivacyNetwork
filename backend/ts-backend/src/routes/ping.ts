import express, { Request, Response } from "express";
import HttpStatusCode from "../types/HttpStatusCode";

const pingRouter = express.Router();

pingRouter.use(express.json());

pingRouter.post("/ping", (_req: Request, res: Response) => {
  /**
   * @openapi
   * '/api/ping':
   *  post:
   *     tags:
   *     - User
   *     summary: Ping backend server
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: string
   *      400:
   *        description: Bad request
   */

  res
    .status(HttpStatusCode.OK)
    .json({ status: "The backend server is up and running" });
});

export default pingRouter;
