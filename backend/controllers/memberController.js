import Member from "../models/MemberSchema.js";
import Profile from "../models/ProfileSchema.js";
import Server from "../models/ServerSchema.js";

// change memeber role
export const changeMemberRole = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;
    const member = await Member.findById(memberId);
    if (!member) {
      throw new Error("Member not found");
    }
    const updatedMember = await Member.findByIdAndUpdate(memberId, { role: role }, { new: true });
    return res.status(200).json(updatedMember);
  } catch (error) {
    console.log("ERROR FROM CHANGE MEMBER ROLE CONTROLLER", error);
  }
}

// delete member
export const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findById(memberId);
    if (!member) {
      return null;
    }
    const profileId = member.profileId;
    const serverId = member.serverId;

    // remove the member
    await Member.findByIdAndDelete(memberId);

    // remove the  member from the member list of the user whose profile is this
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return null;
    }
    const newMembers = profile.members.filter((member) => member.toString() != memberId.toString());
    profile.members = newMembers;
    // remove the server from the server list of the member whose profile is this
    const newServers = profile.servers.filter((server) => server.toString() != serverId.toString());
    profile.servers = newServers;
    // remove the member form the member list of the server
    const server = await Server.findById(serverId);
    if (!server) {
      throw new Error("Server not found");
    }
    const newServerMembers = server.members.filter((member) => member.toString() != memberId.toString());
    server.members = newServerMembers;

    await profile.save();
    await server.save();
    return res.status(200).json(server);
  } catch (error) {
    console.log("ERROR FROM DELETE MEMBER CONTROLLER", error);
  }
}

// get member
export const getMember = async (req, res) => {
  try {
    const { profileId, serverId } = req.params;
    const member = await Member.findOne({ profileId: profileId, serverId: serverId });
    if (!member) {
      return null;
    }
    return res.status(200).json(member);
  } catch (error) {
    console.log("ERROR FROM GET MEMBER CONTROLLER", error);
  }
}

// get member
export const getMemberWithProfile = async (req, res) => {
  try {
    const { profileId, serverId } = req.params;
    const member = await Member.findOne({ profileId: profileId, serverId: serverId }).populate("profileId");
    if (!member) {
      return null;
    }
    return res.status(200).json(member);
  } catch (error) {
    console.log("ERROR FROM GET MEMBER WITH PROFILE CONTROLLER", error);
  }
}