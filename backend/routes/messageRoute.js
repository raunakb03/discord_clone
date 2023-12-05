import express from "express";
import { createNewMessage } from "../controllers/messageController.js";
const messageRouter = express.Router();

messageRouter.post("/createMessage", createNewMessage);

export default messageRouter;