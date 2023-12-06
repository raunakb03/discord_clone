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
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(401).json({ error: "Convseration Id missing" });
    }
    if (!content) {
      return res.status(401).json({ error: "Content missing" });
    }

    const { data: conversation } = await axios.get(
      `${process.env.BASE_URL}/api/conversation/getDirectConversation/${conversationId}/${profile._id}`
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const member =
      conversation.memberOneId.profileId == profile._id
        ? { ...conversation.memberOneId, profile: conversation.memberOneProfile }
        : { ...conversation.memberTwoId, profile: conversation.memberTwoProfile };

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const memberId = member._id;

    const { data: message } = await axios.post(
      `${process.env.BASE_URL}/api/message/directMessages/createMessage`,
      { content, fileUrl, conversationId, memberId }
    );

    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(["MESSAGES_POST"], error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
