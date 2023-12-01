import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["ADMIN", "MODERATOR", "GUEST"],
      default: "GUEST",
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    serverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    // this will be the member one
    conversationsInitiated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
    // this will be the member two
    conversationsReceived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
    directMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DirectMessage",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);

export default Member;
