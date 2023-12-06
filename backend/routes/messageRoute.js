import express from "express";
import { createNewDirectMessage, createNewMessage, editDirectMessage, editMessage, getChannelMessages, getDirectMessageById, getDirectMessages, getMessageById } from "../controllers/messageController.js";
const messageRouter = express.Router();

messageRouter.get('/getMessageByid/:messageId/:channelId', getMessageById);
messageRouter.post('/', getChannelMessages);
messageRouter.post("/createMessage", createNewMessage);
messageRouter.put("/editMessage/:messageId", editMessage);

// direct message routes
messageRouter.post("/directMessages", getDirectMessages);
messageRouter.post("/directMessages/createMessage", createNewDirectMessage);
messageRouter.get('/getDirectMessageById/:messageId/:conversationId', getDirectMessageById);
messageRouter.put("/editDirectMessage/:messageId", editDirectMessage);
export default messageRouter;