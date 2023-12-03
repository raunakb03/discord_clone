import Conversation from "../models/ConversationSchema.js";
import Profile from "../models/ProfileSchema.js";

//  find a conversation from members ID
export const findConversation = async (req, res) => {
  try {
    const { memberOneId, memberTwoId } = req.params;
    let conversation = await Conversation.findOne({
      memberOneId,
      memberTwoId,
    }).populate(["memberOneId", "memberTwoId"]);

    if (!conversation || conversation == null) {
      conversation = await Conversation.findOne({
        memberTwoId: memberOneId,
        memberOneId: memberTwoId,
      }).populate(["memberOneId", "memberTwoId"]);
    }

    if (!conversation) {
      return res.status(200).json(conversation);
    }

    const memberOneProfile = await Profile.findById(conversation.memberOneId.profileId);
    const memberTwoProfile = await Profile.findById(conversation.memberTwoId.profileId);

    const returnConversation = { ...conversation._doc, memberOneProfile, memberTwoProfile };
    return res.status(200).json(returnConversation);
  } catch (error) {
    console.log("ERROR FROM FIND CONVERSATION CONTROLLER", error);
  }
}

// create a new conversatin between two members
export const createConversation = async (req, res) => {
  try {
    const { memberOneId, memberTwoId } = req.params;
    const newConversation = new Conversation({
      memberOneId,
      memberTwoId,
    });

    await newConversation.save();

    // ! TODO : also push this conversation in the member conversationInitiated or conversationRecieved array 

    const conversation = await Conversation.findOne({
      memberOneId,
      memberTwoId
    }).populate(["memberOneId", "memberTwoId"]);

    const memberOneProfile = await Profile.findById(conversation.memberOneId.profileId);
    const memberTwoProfile = await Profile.findById(conversation.memberTwoId.profileId);

    const returnConversation = { ...conversation._doc, memberOneProfile, memberTwoProfile };

    return res.status(200).json(returnConversation);
  } catch (error) {
    console.log("ERROR FROM CREATE CONVERSATION CONTROLLER", error);
  }
}