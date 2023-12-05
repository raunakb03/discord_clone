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