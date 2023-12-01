import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    memberOneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    memberTwoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    directMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DirectMessage",
      },
    ]
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);

export default Conversation;
