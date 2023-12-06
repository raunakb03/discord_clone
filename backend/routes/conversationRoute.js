import express from "express";
import { createConversation, findConversation, getConversationByConversationId } from "../controllers/conversationController.js";
const conversationRouter = express.Router();

conversationRouter.get('/getConversation/:memberOneId/:memberTwoId', findConversation);
conversationRouter.get('/getDirectConversation/:conversationId/:profileId', getConversationByConversationId);
conversationRouter.post('/createConversation/:memberOneId/:memberTwoId', createConversation);

export default conversationRouter;