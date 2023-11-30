import { Error } from "mongoose";
import Profile from "../models/ProfileSchema.js";
import Server from "../models/ServerSchema.js";
import Channel from "../models/ChannelSchema.js";

// create a new channel
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

// delete channel
export const deleteChannel = async (req, res) => {
  try {
    const { serverId, userId, channelId } = req.params;

    const server = await Server.findById(serverId);
    const profile = await Profile.findById(userId);
    const channel = await Channel.findById(channelId);

    if (!server || !channel || !profile) {
      throw new Error("Invalid Request")
    }

    if (channel.name == 'general') {
      throw new Error("General channel cannot be deleted");
    }

    // remove the channel from the server
    const newChannels = await server?.channels?.filter((channel) => channel.toString() != channelId.toString());
    await Server.findByIdAndUpdate(serverId, { channels: newChannels }, { new: true });

    // remove the channel from the user profile
    const profileChannels = profile?.channels?.filter((channel) => channel.toString() != channelId.toString());
    await Profile.findByIdAndUpdate(userId, { channels: profileChannels }, { new: true });

    // remove the channel
    await Channel.findByIdAndDelete(channelId);

    return res.status(200).json(server);
  } catch (error) {
    console.log("ERROR FROM DELETE CHANNEL CONTROLLER", error);
  }
}

export const editChannel = async (req, res) => {
  try {
    const { serverId, channelId } = req.params;
    const { name, type } = req.body;

    const server = await Server.findById(serverId);
    if (!server) {
      throw new Error("server not found");
    }
    const channel = await Channel.findByIdAndUpdate(channelId, { name, type }, { new: true });
    return res.status(200).json(channel);
  } catch (error) {
    console.log("ERROR FROM EDIT CHANNEL CONTROLLER", error);
  }
}