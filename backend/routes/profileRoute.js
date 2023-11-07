import express from 'express';
import { createUser, getUserByUserId } from '../controllers/profileController.js';
const userRouter = express.Router();

userRouter.get('/:profileId', getUserByUserId);
userRouter.post('/createProfile', createUser);

export default userRouter;