import express from "express";
import { addToAServer, createServer, editServer, getServerById, leaveServer, updateInviteCode } from "../controllers/serverController.js";
const serverRouter = express.Router();

serverRouter.post("/createServer", createServer);
serverRouter.get("/getServer/:id", getServerById);
serverRouter.put("/invite-code/:serverId/:profileId", updateInviteCode);
serverRouter.get("/invite-code/:inviteCode/:profileId", addToAServer);
serverRouter.put("/editServer/:serverId", editServer);
serverRouter.put("/leaveServer/:serverId/:profileId", leaveServer);
export default serverRouter;