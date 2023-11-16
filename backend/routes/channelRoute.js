import express from "express";
import { createChannel } from "../controllers/channelController.js";
const channelRouter = express.Router();

channelRouter.post('/createChannel/:serverId', createChannel);

export default channelRouter;