"use client";

import { io, type Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export function createChatSocket(token: string): Socket {
  return io(`${API_URL}/chat`, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
  });
}
