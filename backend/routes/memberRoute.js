import express from "express";
import { changeMemberRole, deleteMember } from "../controllers/memberController.js";
const memberRouter = express.Router();

memberRouter.put("/changeRole/:memberId", changeMemberRole);
memberRouter.delete("/deleteMember/:memberId", deleteMember);

export default memberRouter;