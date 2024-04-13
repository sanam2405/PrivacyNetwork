import express, { Request, Response } from "express";
import User, { UserDocument } from "../models/models";
import requireLogin from "../middlewares/requireLogin";
import HttpStatusCode from "../types/HttpStatusCode";

const userRouter = express.Router();

interface CustomRequest extends Request {
  user?: UserDocument;
}

// Friend a user
userRouter.put(
  "/follow",
  requireLogin,
  async (req: CustomRequest, res: Response) => {
    try {
      const toFollow = req.body.userID;
      const wantToFollow = req.user?._id?.toString();

      await User.findByIdAndUpdate(toFollow, {
        $addToSet: { friends: wantToFollow },
      });

      await User.findByIdAndUpdate(wantToFollow, {
        $addToSet: { friends: toFollow },
      });

      return res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "Something went wrong..." });
    }
  },
);

// Unfriend a user
userRouter.put(
  "/unfollow",
  requireLogin,
  async (req: CustomRequest, res: Response) => {
    try {
      const toFollow = req.body.userID;
      const wantToFollow = req.user?._id?.toString();

      await User.findByIdAndUpdate(
        toFollow,
        {
          $pull: { friends: wantToFollow },
        },
        {
          new: true,
        },
      );

      await User.findByIdAndUpdate(
        wantToFollow,
        {
          $pull: { friends: toFollow },
        },
        {
          new: true,
        },
      );

      return res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "Something went wrong..." });
    }
  },
);

// Fetch user details
userRouter.get(
  "/user/:id",
  requireLogin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currUser = await User.findOne({ _id: id }).select("-password");
      res.status(HttpStatusCode.OK).json({ user: currUser });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "Something went wrong..." });
    }
  },
);

// Fetch all users' details
userRouter.get(
  "/allusers",
  requireLogin,
  async (req: Request, res: Response) => {
    try {
      const allUsers = await User.find({}).populate(
        "friends",
        "_id name username Photo",
      );
      res.status(HttpStatusCode.OK).json({ users: allUsers });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "Something went wrong..." });
    }
  },
);

// Save profile picture of users inside MongoDB (through cloudinary)
userRouter.put(
  "/uploadProfilePic",
  requireLogin,
  async (req: CustomRequest, res: Response) => {
    try {
      await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: { Photo: req.body.pic },
        },
        {
          new: true,
        },
      );
      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "Something went wrong..." });
    }
  },
);

// Posting the age, gender, college properties of a user
userRouter.put(
  "/setProperties",
  requireLogin,
  async (req: CustomRequest, res: Response) => {
    try {
      const { age, gender, college } = req.body;

      if (!age || !gender || !college) {
        return res
          .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
          .json({ error: "Please fill up all the properties..." });
      }

      await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: { age },
        },
        {
          new: true,
        },
      );

      await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: { gender },
        },
        {
          new: true,
        },
      );

      await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: { college },
        },
        {
          new: true,
        },
      );

      return res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .json({ error: "Something went wrong..." });
    }
  },
);

export default userRouter;
