import { currentProfile } from "@/lib/current-profile";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import axios from "axios";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(401).json({ error: "ServerId missing" });
    }
    if (!profile) {
      return res.status(401).json({ error: "ChannelId missing" });
    }
    if (!content) {
      return res.status(401).json({ error: "Content missing" });
    }

    const { data: server } = await axios.get(
      `${process.env.BASE_URL}/api/server/getServer/${serverId}?populate=members`
    );
    const doesContainMember = server.members.find(
      (member: any) => member.profileId == profile._id
    );
    if (!server || !doesContainMember) {
      return res.status(404).json({ message: "Server not found" });
    }

    const { data: channel } = await axios.get(
      `${process.env.BASE_URL}/api/channel/getChannel/${channelId}`
    );

    if (!channel || channel.serverId != serverId) {
      return res.status(404).json({ msg: "channel not found" });
    }

    const member = server.members.find(
      (member: any) => member.profileId == profile._id
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const memberId = member._id;

    const { data: message } = await axios.post(
      `${process.env.BASE_URL}/api/message/createMessage`,
      { content, fileUrl, channelId, memberId }
    );

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(["MESSAGES_POST"], error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
