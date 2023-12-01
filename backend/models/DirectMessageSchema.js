import mongoose from "mongoose";

const DirectMessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  {
    timestamps: true,
  }
);

const DirectMessage = mongoose.models.DirectMessage || mongoose.model("DirectMessage", DirectMessageSchema);

export default DirectMessage;
