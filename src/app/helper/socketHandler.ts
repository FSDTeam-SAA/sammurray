import { Server, Socket } from 'socket.io';

export const handleJoinUser = (socket: Socket, senderId: string) => {
  const roomName = `user:${senderId}`;
  socket.join(roomName);
  socket.emit('connected');
  console.log(`👤 User ${senderId} joined personal room: ${roomName}`);
};




export const handleJoinChat = (socket: Socket, data: any) => {
  const { conversationId } = data;

  if (!conversationId) return;

  const roomName = `chat:${conversationId}`;
  socket.join(roomName);

  console.log(`💬 Joined chat room: ${roomName}`);
  socket.emit('joined-chat', { roomName });
};



export const handleLeaveChat = (socket: Socket, data: any) => {
  const { senderId, receiverId } = data;

  if (!senderId || !receiverId) return;

  const chatRoomId = [senderId, receiverId].sort().join('-');
  const roomName = `chat:${chatRoomId}`;

  socket.leave(roomName);
  console.log(`🚪 User ${senderId} left chat room: ${roomName}`);
};




export const handleSendMessage = (io: Server, socket: Socket, data: any) => {
  try {
    const { conversationId, senderId, receiverId, message } = data;

    if (!conversationId || !senderId || !receiverId) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    const roomName = `chat:${conversationId}`;

    io.to(roomName).emit('receive-message', {
      conversationId,
      senderId,
      receiverId,
      message,
    });

    console.log(`📨 Message send to room: ${roomName}`);
  } catch (err) {
    socket.emit('error', { message: `Failed to send message ${err}` });
  }
};





// OPTIONAL TYPING EVENTS
export const handleTyping = (socket: Socket, data: any) => {
  const { senderId, receiverId } = data;
  const room = `chat:${[senderId, receiverId].sort().join('-')}`;
  socket.to(room).emit('typing', senderId);
};




export const handleStopTyping = (socket: Socket, data: any) => {
  const { senderId, receiverId } = data;
  const room = `chat:${[senderId, receiverId].sort().join('-')}`;
  socket.to(room).emit('stop-typing', senderId);
};
