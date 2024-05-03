import User from "../models/models";

export const getFriendsOfCurrentUser = async (id: string) => {
  try {
    // Find the current user with its friends populated
    const currentUser = await User.findById(id).populate("friends");

    if (!currentUser) {
      return { error: "Current user has not friends" };
    }

    // Extract friends' IDs
    const friendIds = currentUser.friends.map((friend) => friend._id);

    // Find all users who are friends of the current user
    const friends = await User.find({ _id: { $in: friendIds } });

    return { users: friends };
  } catch (error) {
    return { error: "Something went wrong..." };
  }
};

export const getNonFriendsOfCurrentUser = async (id: string) => {
  try {
    // Find the current user with its friends populated
    const currentUser = await User.findById(id).populate("friends");

    if (!currentUser) {
      return { error: "Current user has no non-friends" };
    }

    // Extract friends' IDs
    const friendIds = currentUser.friends.map((friend) => friend._id);

    // Find all users who are not friends of the current user
    const nonFriends = await User.find({
      _id: { $nin: friendIds, $ne: id },
    });

    return { users: nonFriends };
  } catch (error) {
    return { error: "Something went wrong..." };
  }
};
