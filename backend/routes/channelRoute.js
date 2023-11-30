import express from "express";
import { createChannel, deleteChannel, editChannel } from "../controllers/channelController.js";
const channelRouter = express.Router();

channelRouter.post('/createChannel/:serverId', createChannel);
channelRouter.put('/editChannel/:serverId/:channelId', editChannel);
channelRouter.delete('/deleteChannel/:serverId/:userId/:channelId', deleteChannel)
export default channelRouter;