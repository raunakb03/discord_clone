import Profile from "../models/ProfileSchema.js";
import Server from "../models/ServerSchema.js";
import Channel from "../models/ChannelSchema.js";
import Member from "../models/MemberSchema.js";
import { v4 as uuidv4 } from "uuid";

// create a new server
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

// get a server by id
export const getServerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    let populatedArray = [];
    if (populate) {
      populatedArray = [...populate.split("-")]
    }
    const server = await Server.findById(id).populate(populatedArray);
    if (!server) {
      throw new Error("No server found");
    }
    return res.json(server);
  } catch (error) {
    console.log("ERROR FROM GET SERVER BY ID CONTROLLER", error);
  }
}

// update server invite code
export const updateInviteCode = async (req, res) => {
  try {
    const { serverId, profileId } = req.params;
    const server = await Server.findOne({ _id: serverId, profileId: profileId });
    if (!server) return null;
    const updatedServer = await Server.findOneAndUpdate(
      {
        _id: serverId,
        profileId: profileId,
      },
      { inviteCode: uuidv4() },
      { new: true }
    );

    return res.status(200).json(updatedServer);

  } catch (error) {
    console.log("ERROR FROM UPDATE SERVER INVITE CODE CONTROLLER", error);
  }
}