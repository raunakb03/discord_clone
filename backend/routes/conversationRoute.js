import express from "express";
import { createConversation, findConversation } from "../controllers/conversationController.js";
const conversationRouter = express.Router();

conversationRouter.get('/getConversation/:memberOneId/:memberTwoId', findConversation);
conversationRouter.post('/createConversation/:memberOneId/:memberTwoId', createConversation);

export default conversationRouter;