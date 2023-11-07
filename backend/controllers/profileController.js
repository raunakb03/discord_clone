import Profile from "../models/ProfileSchema.js";

// get user by userId
export const getUserByUserId = async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await Profile.findOne({ userId: profileId });
    return res.json(profile);
  } catch (error) {
    console.log("ERROR FROM GET USER BY USERID CONTROLLER", error);
  }
}

// create a new user
export const createUser = async (req, res) => {
  const body = req.body;
  try {
    const profile = new Profile(body);
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.log("ERROR FROM CREATE USER BY USERID CONTROLLER", error);
  }
}