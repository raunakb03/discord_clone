import Profile from "../models/ProfileSchema.js";

// get user by userId
export const getUserByUserId = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { populate } = req.query;
    let populatedArray = [];
    if (populate) {
      populatedArray = [...populate.split("-")]
    }

    let profile;
    if (populate) {
      profile = await Profile.findOne({ userId: profileId }).populate(populatedArray);
    }
    else {
      profile = await Profile.findOne({ userId: profileId })
    }
    return res.json(profile);
  } catch (error) {
    console.log("ERROR FROM GET USER BY USERID CONTROLLER", error);
  }
}

// get member by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    let populatedArray = [];
    if (populate) {
      populatedArray = [...populate.split("-")]
    }
    const profile = await Profile.findById(id).populate(populatedArray);
    return res.status(200).json(profile);
  } catch (error) {
    console.log("ERROR FROM GET USER BY ID(NOT PROFILE) CONTROLLER", error);
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