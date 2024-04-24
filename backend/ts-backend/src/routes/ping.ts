require("dotenv").config();
import express, { Request, Response } from "express";
import HttpStatusCode from "../types/HttpStatusCode";
import axios from "axios";

const LOCATION_BACKEND_URI = process.env.LOCATION_BACKEND_URI;

const pingRouter = express.Router();

pingRouter.use(express.json());

pingRouter.post("/ping", async (req: Request, res: Response) => {
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

  try {
    const bearerToken = process.env.BACKEND_INTERCOMMUNICATION_SECRET;
    const response = await axios.post(
      `${LOCATION_BACKEND_URI}/api/ping`,
      {},
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    const locationPing = response.data;
    const locStatus = locationPing.status;
    res.status(HttpStatusCode.OK).json({
      status: `The ts-backend mongoDB server is up and running. ${locStatus}`,
    });
    console.log(locationPing);
  } catch (error) {
    console.error("Error making network call:", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      msg: "Error making network call from ts-backend",
    });
  }
});

export default pingRouter;
