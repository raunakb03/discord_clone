import express from "express";
import { createNewMessage, getChannelMessages } from "../controllers/messageController.js";
const messageRouter = express.Router();

messageRouter.post('/', getChannelMessages)
messageRouter.post("/createMessage", createNewMessage);

export default messageRouter;