import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from './config';

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: config.socketCorsOrigins,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    // Basic room join by userId if provided in query
    const userId = socket.handshake.auth?.userId || socket.handshake.query.userId;
    if (userId && typeof userId === 'string') {
      socket.join(`user:${userId}`);
    }

    socket.on('join', (room: string) => {
      if (room && typeof room === 'string') socket.join(room);
    });

    socket.on('disconnect', () => {
      // no-op for now
    });
  });

  return io;
};

export const getIo = (): Server => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};


