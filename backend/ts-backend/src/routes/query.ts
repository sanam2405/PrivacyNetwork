require("dotenv").config();
import express, { Request, Response } from "express";
import z from "zod";
import HttpStatusCode from "../types/HttpStatusCode";
import axios from "axios";
import bcrypt from "bcryptjs";
import requireLogin from "../middlewares/requireLogin";
import { getFriendsOfCurrentUser, getNonFriendsOfCurrentUser } from "../utils";

/*
    {
        userID: string
        thresholdDistance: number
        latitude: number
        longitude: number
        college: string
        gender: string
        age: number
        isVisible: boolean
    }

*/
const defaultPicLink =
  "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

const queryRequest = z.object({
  userId: z.string(),
  thresholdDistance: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  college: z.string(),
  gender: z.string(),
  age: z.number(),
});

interface privacyResponse {
  name: string;
  email: string;
  age: number;
  gender: string;
  college: string;
  dist_meters: number;
  Photo: string;
  mask: boolean;
}

interface NearbyPrivacyUser {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  college: string;
  isvisible: boolean;
  lat: number;
  long: number;
  dist_meters: number;
}

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
      const { userId, gender, thresholdDistance, age, college } =
        parsedPayload.data;

      const bearerToken = process.env.BACKEND_INTERCOMMUNICATION_SECRET || "";
      const salt = bcrypt.genSaltSync(10);
      const hashedBearerToken = bcrypt.hashSync(bearerToken, salt);
      const response = await axios.post(
        `${LOCATION_BACKEND_URI}/api/query`,
        queryPayload,
        {
          headers: {
            Authorization: `Bearer ${hashedBearerToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const privacyEntities = response.data;
      const userIdOftheClientWhoQueried = userId;
      const friendsOftheClientWhoQueried = (
        await getFriendsOfCurrentUser(userIdOftheClientWhoQueried)
      ).users;
      const nonFriendsOfTheClientWhoQueried = (
        await getNonFriendsOfCurrentUser(userIdOftheClientWhoQueried)
      ).users;

      // console.log("Queried clients friends: ");
      // console.log(friendsOftheClientWhoQueried);

      // console.log("Queried clients non-friends: ");
      // console.log(nonFriendsOfTheClientWhoQueried);

      /*

        APPLY VISIBILITY & FRIENDs BASED FILTERING BEFORE SENDING LOCs TO THE CLIENT

        Friend and Visible            ---->     Show to the client                          mask false
        Friend and Not-Visible        ---->     Show to the client                          mask false
        Non-Friend and Visible        ---->     Show to the client with boundary mask       mask true
        Non-Friend and Not-Visible    ---->     Do not show to the client                   don't send to client

      */

      /*
      
      Intersection of friendsOftheClientWhoQueried, nonFriendsOfTheClientWhoQueried and privacyEntities
      on the basis of the matching emailIds goes here. 

      Note that the emailIds are unique and hence uniquely identifies each users.

      */

      const matchedEntities: privacyResponse[] = [];

      friendsOftheClientWhoQueried?.forEach((clientFriend) => {
        privacyEntities.forEach((privacyUser: NearbyPrivacyUser) => {
          // check for emails match
          if (clientFriend.email === privacyUser.email) {
            // custom JSON object
            const matchedEntity = {
              name: privacyUser.name,
              email: clientFriend.email,
              age: privacyUser.age,
              gender: privacyUser.gender,
              college: privacyUser.college,
              dist_meters: privacyUser.dist_meters,
              Photo: clientFriend.Photo || defaultPicLink,
              mask: false,
            };
            matchedEntities.push(matchedEntity);
          }
        });
      });

      nonFriendsOfTheClientWhoQueried?.forEach((clientNonFriends) => {
        privacyEntities.forEach((privacyUser: NearbyPrivacyUser) => {
          // check for emails match
          if (
            clientNonFriends.email === privacyUser.email &&
            privacyUser.isvisible === true
          ) {
            // custom JSON object
            const matchedEntity = {
              name: privacyUser.name,
              email: clientNonFriends.email,
              age: privacyUser.age,
              gender: privacyUser.gender,
              college: privacyUser.college,
              dist_meters: privacyUser.dist_meters,
              Photo: clientNonFriends.Photo || defaultPicLink,
              mask: true,
            };
            matchedEntities.push(matchedEntity);
          }
        });
      });

      console.log("All the matched entities are : ");
      console.log(matchedEntities);

      res.status(HttpStatusCode.OK).json(privacyEntities);
      console.log(
        `ALL PRIVACY ${gender} USERS NEARBY WITHIN ${thresholdDistance} meters and age less than ${age} with college ${college}`,
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
