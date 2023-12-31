import Channel from '../models/ChannelSchema.js';
import Member from '../models/MemberSchema.js';
import Message from '../models/MessageSchema.js';
import Profile from '../models/ProfileSchema.js';
import DirectMessage from '../models/DirectMessageSchema.js';
import Conversation from '../models/ConversationSchema.js';

// create a new message
export const createNewMessage = async (req, res) => {
  try {
    const { content, fileUrl, channelId, memberId } = req.body;
    const newMessage = await Message.create({
      content,
      fileUrl,
      channelId,
      memberId,
    });

    // push this message into channel
    const channel = await Channel.findByIdAndUpdate(
      channelId,
      { $push: { messages: newMessage._id } },
      { new: true }
    );

    // push this message into member
    const member = await Member.findByIdAndUpdate(
      memberId,
      { $push: { messages: newMessage._id } },
      { new: true }
    );

    const message = await Message.findById(newMessage._id).populate("memberId");
    const profile = await Profile.findById(message.memberId.profileId);

    const returnMessage = {
      ...message._doc,
      profile
    }

    return res.status(200).json(returnMessage);
  } catch (error) {
    console.log(["ERROR FROM CREATE A NEW MESSAGE CONTROLLER"], error);
    return res.status(500).json({ message: error.message });
  }
}

// get all messages
export const getChannelMessages = async (req, res) => {
  try {
    const { cursor, channelId } = req.body;
    let messages;
    if (cursor) {
      messages = await Message.find({
        channelId: channelId,
        _id: { $lt: cursor },
      })
        .populate("memberId")
        .sort({ createdAt: -1 })
        .skip(1)
        .limit(10)
        .exec();
    } else {
      messages = await Message.find({
        channelId: channelId,
      })
        .populate("memberId")
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();
    }

    const returnMessage = await Promise.all(messages.map(async (message) => {
      const profile = await Profile.findById(message.memberId.profileId);
      return {
        ...message._doc,
        profile
      }
    }))

    let nextCursor = null;
    if (returnMessage.length === 10) {
      nextCursor = returnMessage[9]._id;
    }

    return res.status(200).json({
      items: returnMessage,
      nextCursor
    });
  } catch (error) {
    console.log(["ERROR FROM GET ALL MESSAGES CONTROLLER"], error);
    return res.status(500).json({ message: error.message })
  }
}

// get message by id
export const getMessageById = async (req, res) => {
  try {
    const { messageId, channelId } = req.params;
    const message = await Message.findOne({
      _id: messageId,
      channelId: channelId
    });

    if (!message) {
      throw new Error("No message found");
    }

    return res.status(200).json(message);

  } catch (error) {
    console.log(["ERROR FROM GET MESSAGE BY ID CONTROLLER"], error);
    return res.status(500).json({ message: error.message })
  }
}

// edit a message
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const data = req.body;
    const message = await Message.findByIdAndUpdate(
      messageId,
      data,
      { new: true }
    ).populate("memberId");

    const profile = await Profile.findById(message.memberId.profileId);
    const returnMessage = {
      ...message._doc,
      profile
    }

    return res.status(200).json(returnMessage);
  } catch (error) {
    console.log(["ERROR FROM EDIT MESSAGE CONTROLLER"], error);
    return res.status(500).json({ message: error.message })
  }
}

// ----------------DIRECT MESSAGE CONTROLLERS-------------------------//

// get all direct messages
export const getDirectMessages = async (req, res) => {
  try {
    const { cursor, conversationId } = req.body;
    let messages;
    if (cursor) {
      messages = await DirectMessage.find({
        conversationId: conversationId,
        _id: { $lt: cursor },
      })
        .populate("memberId")
        .sort({ createdAt: -1 })
        .skip(1)
        .limit(10)
        .exec();
    } else {
      messages = await DirectMessage.find({
        conversationId: conversationId,
      })
        .populate("memberId")
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();
    }

    const returnMessage = await Promise.all(messages.map(async (message) => {
      const profile = await Profile.findById(message.memberId.profileId);
      return {
        ...message._doc,
        profile
      }
    }))

    let nextCursor = null;
    if (returnMessage.length === 10) {
      nextCursor = returnMessage[9]._id;
    }

    return res.status(200).json({
      items: returnMessage,
      nextCursor
    });
  } catch (error) {
    console.log(["ERROR FROM GET ALL DIRECT MESSAGES CONTROLLER"], error);
    return res.status(500).json({ message: error.message })
  }
}

// create a new message
export const createNewDirectMessage = async (req, res) => {
  try {
    const { content, fileUrl, conversationId, memberId } = req.body;

    const newMessage = await DirectMessage.create({
      content,
      fileUrl,
      conversationId,
      memberId,
    });

    // push this message into conversation
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $push: { directMessages: newMessage._id } },
      { new: true }
    );

    // push this message into member
    const member = await Member.findByIdAndUpdate(
      memberId,
      { $push: { directMessages: newMessage._id } },
      { new: true }
    );

    const message = await DirectMessage.findById(newMessage._id).populate("memberId");
    const profile = await Profile.findById(message.memberId.profileId);

    const returnMessage = {
      ...message._doc,
      profile
    }

    return res.status(200).json(returnMessage);
  } catch (error) {
    console.log(["ERROR FROM CREATE A NEW DIRECT MESSAGE CONTROLLER"], error);
    return res.status(500).json({ message: error.message });
  }
}

// get direct message by id
export const getDirectMessageById = async (req, res) => {
  try {
    const { messageId, conversationId } = req.params;
    const message = await DirectMessage.findOne({
      _id: messageId,
      conversationId: conversationId
    });

    if (!message) {
      throw new Error("No message found");
    }

    return res.status(200).json(message);

  } catch (error) {
    console.log(["ERROR FROM GET DIRECT MESSAGE BY ID CONTROLLER"], error);
    return res.status(500).json({ message: error.message })
  }
}

// edit a direct message
export const editDirectMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const data = req.body;
    const message = await DirectMessage.findByIdAndUpdate(
      messageId,
      data,
      { new: true }
    ).populate("memberId");

    const profile = await Profile.findById(message.memberId.profileId);
    const returnMessage = {
      ...message._doc,
      profile
    }

    return res.status(200).json(returnMessage);
  } catch (error) {
    console.log(["ERROR FROM EDIT DIRECT MESSAGE CONTROLLER"], error);
    return res.status(500).json({ message: error.message })
  }
}