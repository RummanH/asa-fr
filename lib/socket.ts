"use client";

import { io, type Socket } from "socket.io-client";

const PRODUCTION_API_URL = "https://alasatizah.onrender.com";
const LOCAL_API_URL = "http://localhost:5001";

function isLocalhostUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(parsedUrl.hostname);
  } catch {
    return false;
  }
}

function resolveApiUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isProduction = process.env.NODE_ENV === "production";
  const shouldIgnoreConfiguredLocalhost =
    isProduction && configuredUrl ? isLocalhostUrl(configuredUrl) : false;
  const baseUrl =
    configuredUrl && configuredUrl.length > 0 && !shouldIgnoreConfiguredLocalhost
      ? configuredUrl
      : isProduction
        ? PRODUCTION_API_URL
        : LOCAL_API_URL;

  return baseUrl.replace(/\/+$/, "");
}

const API_URL = resolveApiUrl();

export function createChatSocket(token: string): Socket {
  return io(`${API_URL}/chat`, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
  });
}
