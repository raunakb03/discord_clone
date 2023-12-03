import axios from "axios";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation = await findConversation(memberOneId, memberTwoId);
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

// find a conversation
export const findConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    const { data: conversation } = await axios.get(
      `${process.env.BASE_URL}/api/conversation/getConversation/${memberOneId}/${memberTwoId}`
    );
    return conversation;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// create a new conversatoin
export const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    const { data: conversation } = await axios.post(
      `${process.env.BASE_URL}/api/conversation/createConversation/${memberOneId}/${memberTwoId}`
    );
    return conversation;
  } catch (error) {
    console.log(error);
    return null;
  }
};
