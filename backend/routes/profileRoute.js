import express from 'express';
import { createUser, getUserById, getUserByUserId } from '../controllers/profileController.js';
const userRouter = express.Router();

userRouter.get('/:profileId', getUserByUserId);
userRouter.get('/user/:id', getUserById);
userRouter.post('/createProfile', createUser);

export default userRouter;