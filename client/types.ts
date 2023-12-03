import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIOServer;
    };
  };
};
