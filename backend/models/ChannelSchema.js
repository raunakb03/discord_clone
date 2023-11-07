import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
      enum: ["TEXT", "AUDIO", "VIDEO"],
      default: "TEXT",
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

const Channel =
  mongoose.models.Channel || mongoose.model("Channel", ChannelSchema);

export default Channel;
