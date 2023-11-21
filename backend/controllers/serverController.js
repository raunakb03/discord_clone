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

// add user to a server
export const addToAServer = async (req, res) => {
  try {
    const { inviteCode, profileId } = req.params;
    const server = await Server.findOne({ inviteCode });
    if (!server) {
      return new Error("No server found");
    }
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return new Error("No profile found");
    }

    // if server already uses current user return
    if (profile.servers.includes(server._id)) {
      return res.status(200).json(server);
    }
    const newMember = new Member({
      profileId: profileId,
      serverId: server._id
    });
    await newMember.save();

    // push this member into the current server
    server.members.push(newMember._id);
    profile.members.push(newMember._id);
    profile.servers.push(server._id);

    await server.save();
    await profile.save();

    return res.status(200).json(server);
  } catch (error) {
    console.log("ERROR FROM ADD TO SERVER CONTROLLER", error);
  }
}

// edit server
export const editServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { profileId, name, imageUrl } = req.body;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new Error("PROFILE NOT FOUND");
    }
    const updatedServer = await Server.findByIdAndUpdate(serverId, { name, imageUrl }, { new: true })

    return res.status(200).json(updatedServer);
  } catch (error) {
    console.log("ERROR FROM EIDT SERVER CONTROLLER", error);
  }
}

// remove profile
export const leaveServer = async (req, res) => {
  try {
    const { serverId, profileId } = req.params;
    const server = await Server.findById(serverId);
    if (!server) {
      throw new Error("Server not found");
    }
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // remove servers from the profile
    const newServers = profile.servers.filter((server) => server.toString() !== serverId.toString());
    profile.servers = newServers;

    // delete the member
    const member = await Member.findOne({ profileId: profileId, serverId: serverId });
    if (!member) {
      throw new Error("Member not found");
    }
    await Member.findByIdAndDelete(member._id);

    // remove memebers from the profile
    const newMembers = profile.members.filter((m) => m.toString() !== member._id.toString());
    profile.members = newMembers;

    // remove channels from the profile
    const serverChannels = server.channels;
    const newChannels = profile.channels.filter((channel) => !serverChannels.includes(channel.toString()));
    profile.channels = newChannels;

    await profile.save();

    // delete this member from the server
    const newServerMembers = server.members.filter((m) => m.toString() !== member._id.toString());
    server.members = newServerMembers;
    await server.save();

    return res.status(200).json(server);
  } catch (error) {
    console.log("ERROR FROM LEAVE SERVER CONTROLLER", error);
  }
}

// delete server
export const deleteServer = async (req, res) => {
  try {
    const { serverId, profileId } = req.params;
    const server = await Server.findOne({ _id: serverId, profileId: profileId }).populate(["members"]);
    const profile = await Profile.findById(profileId);
    if (!server) {
      throw new Error("Server not found");
    }

    // removing the member and server from the profile
    await Promise.all(server.members.map(async (member) => {
      const profile = await Profile.findById(member.profileId);
      if (!profile) {
        throw new Error("Profile not found");
      }
      // removing server
      const newServers = profile.servers.filter((server) => server.toString() !== serverId.toString());
      // removing member
      const newMembers = profile.members.filter((m) => m.toString() !== member._id.toString());
      await Profile.findByIdAndUpdate(profile._id, { servers: newServers, members: newMembers }, { new: true });
      await Member.findByIdAndDelete(member._id);
    }));

    // deleting channels from the profile
    const newChannels = profile.channels.filter((channel) => !server.channels.includes(channel))
    await Profile.findByIdAndUpdate(profile._id, { channels: newChannels }, { new: true });

    // delete the channels
    await Promise.all(server.channels.map(async (channel) => {
      await Channel.findByIdAndDelete(channel._id);
    }
    ));

    // delete the current server
    await Server.findByIdAndDelete(serverId);

    return res.status(200).json(server);
  } catch (error) {
    console.log("ERROR FROM DELETE SERVER CONTROLLER", error);
  }
}