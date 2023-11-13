import express from "express";
import { changeMemberRole } from "../controllers/memberController.js";
const memberRouter = express.Router();

memberRouter.put("/changeRole/:memberId", changeMemberRole);

export default memberRouter;