import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(userId: string) {
  if (!socket) {
    socket = io("http://localhost:3001", {
      transports: ["websocket"],
    });
  }
  return socket;
}

export function joinProjectRoom(projectId: string, userId: string) {
  if (socket) {
    socket.emit("joinRoom", { userId, projectId });
  }
}

export function sendMessage(projectId: string, userId: string, message: string) {
  if (socket) {
    socket.emit("sendMessage", { projectId, userId, message });
  }
}

export function onNewMessage(callback: (data: any) => void) {
  if (socket) {
    socket.on("newMessage", callback);
  }
}