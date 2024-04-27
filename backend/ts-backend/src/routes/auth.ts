require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import axios from "axios";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/models";
import HttpStatusCode from "../types/HttpStatusCode";
import { z } from "zod";
const SECRET_KEY = process.env.SECRET_KEY;

const authRouter = express.Router();
const LOCATION_BACKEND_URI = process.env.LOCATION_BACKEND_URI;

authRouter.use(express.json());

const authRequest = z.object({
  name: z.string(),
  email: z.string(),
});

authRouter.post(
  "/signup",
  [
    body("email", "Email is not properly formatted").isEmail(),
    body("username", "Username is too short").isLength({ min: 5 }),
    body("password", "Password is too short, choose something strong").isLength(
      { min: 5 },
    ),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCode.LENGTH_REQUIRED)
        .json({ errors: errors.array() });
    }

    /**
     * @openapi
     * '/api/signup':
     *  post:
     *     tags:
     *     - User
     *     summary: Signup a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateUserResponse'
     *      409:
     *        description: Conflict
     *      400:
     *        description: Bad request
     */

    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "Please add all the fields from ts-backend server" });
    }
    try {
      const authPayload = req.body;
      const parsedPayload = authRequest.safeParse(authPayload);
      if (!parsedPayload.success) {
        res.status(HttpStatusCode.LENGTH_REQUIRED).json({
          msg: "You sent the wrong inputs from ts-backend server",
        });
        return;
      }
      const bearerToken = process.env.BACKEND_INTERCOMMUNICATION_SECRET || "";
      const saltForLoc = bcrypt.genSaltSync(10);
      const hashedBearerToken = bcrypt.hashSync(bearerToken, saltForLoc);
      const response = await axios.post(
        `${LOCATION_BACKEND_URI}/api/signup`,
        authPayload,
        {
          headers: {
            Authorization: `Bearer ${hashedBearerToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status !== HttpStatusCode.CREATED) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          msg: "User could not be created in LOC Postgres server. Response is generated from ts-backend server",
        });
      }

      const postgresId = response.data.user?.id;

      const savedUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (savedUser) {
        return res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({
          error:
            "A user already exists with the email or username from ts-backend server",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User({
        name,
        username,
        email,
        password: hashedPassword,
        postgresId,
      });
      await user.save();
      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (err) {
      console.log(err);
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false });
    }
  },
);

authRouter.post(
  "/login",
  [
    body("email", "Email is not properly formatted").isEmail(),
    body("password", "Password is too short, choose something strong").isLength(
      { min: 5 },
    ),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCode.LENGTH_REQUIRED)
        .json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "Please add all the fields..." });
    }
    if (!SECRET_KEY) {
      console.error("SECRET_KEY is undefined. Check the .env");
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send({ errors: "Internal Server Error" });
    }
    try {
      /**
       * @openapi
       * '/api/login':
       *  post:
       *     tags:
       *     - User
       *     summary: Login a user
       *     requestBody:
       *      required: true
       *      content:
       *        application/json:
       *           schema:
       *              $ref: '#/components/schemas/LoginUserInput'
       *     responses:
       *      200:
       *        description: Success
       *        content:
       *          application/json:
       *            schema:
       *              $ref: '#/components/schemas/LoginUserResponse'
       *      400:
       *        description: Bad request
       */

      const userData = await User.findOne({ email });
      if (userData) {
        const hashedPassword = userData.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (isMatch) {
          const jwtToken = jwt.sign({ _id: userData.id }, SECRET_KEY);
          return res.status(HttpStatusCode.OK).json({
            success: true,
            username: userData.username,
            token: jwtToken,
            user: userData,
          });
        }
        return res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({
          error: "Your entered password does not match, please try again...",
        });
      }
      return res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "No user exists with this email..." });
    } catch (err) {
      console.log(err);
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false });
    }
  },
);

authRouter.post("/googleLogin", async (req: Request, res: Response) => {
  if (!SECRET_KEY) {
    console.error("SECRET_KEY is undefined. Check the .env");
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ errors: "Internal Server Error" });
  }
  try {
    const { emailVerified, email, name, clientId, username, Photo } = req.body;
    if (emailVerified) {
      const userData = await User.findOne({ email });
      if (userData) {
        const jwtToken = jwt.sign({ _id: userData.id }, SECRET_KEY);
        return res.status(HttpStatusCode.OK).json({
          success: true,
          username: userData.username,
          token: jwtToken,
          user: userData,
        });
      }

      const password = email + clientId;
      const user = new User({
        name,
        username,
        email,
        password,
        Photo,
      });
      await user.save();
      const jwtToken = jwt.sign({ _id: user.id }, SECRET_KEY);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        username: user.username,
        token: jwtToken,
        user,
      });
    }
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ success: false, message: "Email not verified by Google" });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCode.BAD_REQUEST).json({ success: false });
  }
});

export default authRouter;
