import express from "express";
import { createNewMessage, editMessage, getChannelMessages, getMessageById } from "../controllers/messageController.js";
const messageRouter = express.Router();

messageRouter.get('/getMessageByid/:messageId/:channelId', getMessageById)
messageRouter.post('/', getChannelMessages)
messageRouter.post("/createMessage", createNewMessage);
messageRouter.put("/editMessage/:messageId", editMessage);

export default messageRouter;