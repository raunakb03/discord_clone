import { Error } from "mongoose";
import Profile from "../models/ProfileSchema.js";
import Server from "../models/ServerSchema.js";
import Channel from "../models/ChannelSchema.js";

export const createChannel = async (req, res) => {
  try {
    const { name, type, profileId } = req.body;
    const { serverId } = req.params;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }
    const server = await Server.findById(serverId);
    if (!server) {
      throw new Error("Server not found");
    }

    const newChannel = new Channel({
      name,
      type,
      profileId,
      serverId
    });

    await newChannel.save();

    server.channels.push(newChannel._id);
    await server.save();
    profile.channels.push(newChannel._id);
    await profile.save();

    return res.status(200).json(newChannel);
  } catch (error) {
    console.log("ERROR FROM CREATE CHANNEL CONTROLLER", error);
  }
}