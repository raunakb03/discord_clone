import express from "express";
import { changeMemberRole, deleteMember, getMember, getMemberWithProfile } from "../controllers/memberController.js";
const memberRouter = express.Router();

memberRouter.get("/getMember/:profileId/:serverId", getMember);
memberRouter.get("/getMemberProfile/:profileId/:serverId", getMemberWithProfile);
memberRouter.put("/changeRole/:memberId", changeMemberRole);
memberRouter.delete("/deleteMember/:memberId", deleteMember);

export default memberRouter;