import Channel from '../models/ChannelSchema.js';
import Member from '../models/MemberSchema.js';
import Message from '../models/MessageSchema.js';
import Profile from '../models/ProfileSchema.js';


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
      console.log("with cursor is exe")
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