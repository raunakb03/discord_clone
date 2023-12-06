import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    const { data: server } = await axios.get(
      `${process.env.BASE_URL}/api/server/getServer/${serverId}?populate=members`
    );
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }
    const member = server?.members?.find(
      (member: any) => member.profileId == profile._id
    );
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const { data: channel } = await axios.get(
      `${process.env.BASE_URL}/api/channel/getChannel/${channelId}`
    );
    if (!channel || channel.serverId != serverId) {
      return res.status(404).json({ error: "Channel not found" });
    }

    let { data: message } = await axios.get(
      `${process.env.BASE_URL}/api/message/getMessageById/${messageId}/${channelId}`
    );
    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId == member._id;
    const isAdmin = member.role == "ADMIN";
    const isModerator = member.role == "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      let { data } = await axios.put(
        `${process.env.BASE_URL}/api/message/editMessage/${messageId}`,
        {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        }
      );
      message = data;
    }

    if (req.method === "PUT") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      let { data } = await axios.put(
        `${process.env.BASE_URL}/api/message/editMessage/${messageId}`,
        { content }
      );
      message = data;
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
