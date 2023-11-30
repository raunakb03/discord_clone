import express from "express";
import { createChannel, deleteChannel } from "../controllers/channelController.js";
const channelRouter = express.Router();

channelRouter.post('/createChannel/:serverId', createChannel);
channelRouter.delete('/deleteChannel/:serverId/:userId/:channelId', deleteChannel)
export default channelRouter;