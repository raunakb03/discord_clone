import express from "express";
import { createServer } from "../controllers/serverController.js";
const serverRouter = express.Router();

serverRouter.post("/createServer", createServer);

export default serverRouter;