require("dotenv").config();
import express, { Request, Response } from "express";

import z from "zod";
import HttpStatusCode from "../types/HttpStatusCode";
import axios from "axios";
import requireLogin from "../middlewares/requireLogin";

/*
    {
        userID: string
        thresholdDistance: number
        latitude: number
        longitude: number
        college: string
        gender: string
        age: number
    }

*/

const queryRequest = z.object({
  userId: z.string(),
  thresholdDistance: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  college: z.string(),
  gender: z.string(),
  age: z.number(),
});

const LOCATION_BACKEND_URI = process.env.LOCATION_BACKEND_URI;

const queryRouter = express.Router();

queryRouter.use(express.json());

queryRouter.post(
  "/query",
  requireLogin,
  async (req: Request, res: Response) => {
    /**
     * @openapi
     * '/api/query':
     *  post:
     *     tags:
     *     - Location
     *     summary: Query a location
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/LocationInput'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/LocationResponse'
     *      411:
     *        description: Length required
     *      500:
     *        description: Internal Server Error
     */
    const queryPayload = req.body;
    const parsedPayload = queryRequest.safeParse(queryPayload);

    if (!parsedPayload.success) {
      res.status(HttpStatusCode.LENGTH_REQUIRED).json({
        msg: "You sent the wrong inputs",
      });
      return;
    }
    try {
      const { gender, thresholdDistance, age, college } = parsedPayload.data;
      const bearerToken = process.env.BACKEND_INTERCOMMUNICATION_SECRET;
      const response = await axios.post(
        `${LOCATION_BACKEND_URI}/api/query`,
        queryPayload,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      const privacyEntities = response.data;
      res.status(HttpStatusCode.OK).json(privacyEntities);
      console.log(
        `PRIVACY ${gender} USERS NEARBY WITHIN ${thresholdDistance} meters and age less than ${age} with college ${college}`,
      );
      console.log(privacyEntities);
    } catch (error) {
      console.error("Error making network call:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        msg: "Error making network call",
      });
    }
  },
);

export default queryRouter;
