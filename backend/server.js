import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectDb } from './utils/db.js';
import userRouter from './routes/profileRoute.js';

const app = express();
dotenv.config();

connectDb();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/profile', userRouter)

const PORT = process.env.port || 5001
app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`)
})