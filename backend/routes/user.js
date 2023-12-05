const express = require("express");
const router = express.Router();
const User = require("../models/model");
const requireLogin = require("../middlewares/requireLogin");


// friend a user
router.put("/follow", requireLogin, async (req, res) => {
  try {
    const to_follow = req.body.userID; // ayush
    const want_to_follow = req.user._id; // anumoy

    await User.findByIdAndUpdate(to_follow, {
      $addToSet: { friends: want_to_follow },
    });

    await User.findByIdAndUpdate(want_to_follow, {
      $addToSet: { friends: to_follow },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});


// unfriend a user
router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    const to_follow = req.body.userID; // ayush
    const want_to_follow = req.user._id; // anumoy

    await User.findByIdAndUpdate(
      to_follow,
      {
        $pull: { friends: want_to_follow },
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      want_to_follow,
      {
        $pull: { friends: to_follow },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});


// Fetch user details
router.get("/user/:id", requireLogin, async (req, res) => {
  try {
    const id = req.params.id;
    const currUser = await User.findOne({ _id: id }).select("-password");
    res.status(200).json({ user: currUser });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

// fetch all users' details
router.get("/allusers", requireLogin, async (req, res) => {
  try {
    const allUsers = await User.find({})
      .populate("friends", "_id name username Photo");
    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

module.exports = router;