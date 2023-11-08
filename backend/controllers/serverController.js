import Profile from "../models/ProfileSchema.js";
import Server from "../models/ServerSchema.js";
import Channel from "../models/ChannelSchema.js";
import Member from "../models/MemberSchema.js";

import { v4 as uuidv4 } from "uuid";

export const createServer = async (req, res) => {
  try {
    const { imageUrl, name, profileId } = req.body;

    // check if profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    // create a new server
    const server = new Server({
      profileId,
      name,
      imageUrl,
      inviteCode: uuidv4(),
    });
    await server.save();

    // create a new channel
    const channel = new Channel({
      name: "general",
      profileId,
      serverId: server._id,
    });
    await channel.save();

    // create a new member
    const member = new Member({
      role: "ADMIN",
      profileId,
      serverId: server._id,
    });
    await member.save();

    // push channel and meber to server
    server.channels.push(channel._id);
    server.members.push(member._id);
    await server.save();

    // push server, member, and channel to profile
    profile.servers.push(server._id);
    profile.members.push(member._id);
    profile.channels.push(channel._id);
    await profile.save();

    return res.status(200).json(server);

  } catch (error) {
    console.log("ERROR FROM CREATE SERVER CONTROLLER", error);
  }
}