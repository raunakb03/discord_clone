import express from "express";
import { createChannel, deleteChannel, editChannel, getChannelById } from "../controllers/channelController.js";
const channelRouter = express.Router();

channelRouter.get('/getChannel/:channelId', getChannelById);
channelRouter.post('/createChannel/:serverId', createChannel);
channelRouter.put('/editChannel/:serverId/:channelId', editChannel);
channelRouter.delete('/deleteChannel/:serverId/:userId/:channelId', deleteChannel)
export default channelRouter;