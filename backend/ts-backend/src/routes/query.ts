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
  isVisible: z.boolean(),
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
      const { gender, thresholdDistance, age, college, isVisible } = parsedPayload.data;
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

      /*

        APPLY VISIBILITY & FRIENDs BASED FILTERING BEFORE SENDING LOCs TO THE CLIENT

        If the isVisible is passed as false from the client, we get those user who 
        have set their visibility as FALSE. Hence, we should not send their locations 
        to the client.

        However, if the client is a friend of the user, then we send back the location 
        of that user to the client

      */


      res.status(HttpStatusCode.OK).json(privacyEntities);
      console.log(
        `PRIVACY ${gender} USERS NEARBY WITHIN ${thresholdDistance} meters and age less than ${age} with college ${college} and visibility set to ${isVisible}`,
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
