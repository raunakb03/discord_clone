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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    const { data: conversation } = await axios.get(
      `${process.env.BASE_URL}/api/conversation/getDirectConversation/${conversationId}/${profile._id}`
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const member =
      conversation.memberOneId.profileId == profile._id
        ? {
            ...conversation.memberOneId,
            profile: conversation.memberOneProfile,
          }
        : {
            ...conversation.memberTwoId,
            profile: conversation.memberTwoProfile,
          };

    let { data: message } = await axios.get(
      `${process.env.BASE_URL}/api/message/getDirectMessageById/${directMessageId}/${conversationId}`
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
        `${process.env.BASE_URL}/api/message/editDirectMessage/${directMessageId}`,
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
        `${process.env.BASE_URL}/api/message/editDirectMessage/${directMessageId}`,
        { content }
      );
      message = data;
    }

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
