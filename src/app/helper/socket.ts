import { Server, Socket } from 'socket.io';
import {
  handleJoinChat,
  handleJoinUser,
  handleLeaveChat,
  handleSendMessage,
  handleStopTyping,
  handleTyping,
} from './socketHandler';

export const socketHandler = (io: Server, socket: Socket) => {
  console.log(`🟢 New socket connected: ${socket.id}`);

  socket.on('join', (senderId: string) => {
    if (senderId) {
      handleJoinUser(socket, senderId);
    } else {
      console.log('❌ No senderId');
    }
  });

  socket.on('join-chat', (data) => handleJoinChat(socket, data));

  socket.on('leave-chat', (data) => handleLeaveChat(socket, data));

  socket.on('send-message', (data) => handleSendMessage(io, socket, data));

  socket.on('typing', (data) => handleTyping(socket, data));

  socket.on('stop-typing', (data) => handleStopTyping(socket, data));

  socket.on('disconnect', () => {
    console.log(`🔴 Disconnected: ${socket.id}`);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
};