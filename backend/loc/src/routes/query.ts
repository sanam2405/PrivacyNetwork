import express, { Request, Response } from "express";
import z from "zod";
import HttpStatusCode from "../types/HttpStatusCode";
import { getPrivacyEntities } from "../query";
// import { getPrivacyEntitiesWithVisibility } from "../query";
import { interBackendAccess } from "../middlewares/interBackendAccess";

/*
    {
        userId: string
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

const queryRouter = express.Router();

queryRouter.use(express.json());

queryRouter.post(
  "/query",
  interBackendAccess,
  async (req: Request, res: Response) => {
    console.log("The loc server is queried");

    const queryPayload = req.body;
    const parsedPayload = queryRequest.safeParse(queryPayload);

    if (!parsedPayload.success) {
      res.status(HttpStatusCode.LENGTH_REQUIRED).json({
        msg: "You sent the wrong inputs",
      });
      return;
    }

    const {
      userId,
      latitude,
      longitude,
      thresholdDistance,
      college,
      age,
      gender,
    } = parsedPayload.data;

    const entityType = "user";

    // const privacyEntitiesWithVisibility =
    //   await getPrivacyEntitiesWithVisibility(
    //     latitude,
    //     longitude,
    //     thresholdDistance,
    //     age,
    //     college,
    //     gender,
    //     isVisible,
    //     entityType,
    //   );

    // if (!privacyEntitiesWithVisibility) {
    //   res.status(HttpStatusCode.BAD_REQUEST).json({
    //     msg: "The backend could not run queries on the location database",
    //   });
    // }

    const privacyEntities = await getPrivacyEntities(
      latitude,
      longitude,
      thresholdDistance,
      age,
      college,
      gender,
      entityType,
    );

    if (!privacyEntities) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        msg: "The backend could not run queries on the location database",
      });
    }

    res.status(HttpStatusCode.OK).json(privacyEntities);
    console.log(
      `PRIVACY ${gender} USERS NEARBY WITHIN ${thresholdDistance} meters and age less than ${age} with college ${college}`,
    );
    console.log(privacyEntities);
  },
);

export default queryRouter;
