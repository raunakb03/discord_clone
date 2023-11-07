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
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);

export default Member;
