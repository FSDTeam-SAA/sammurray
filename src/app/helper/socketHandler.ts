import { Server, Socket } from 'socket.io';

export const handleJoinUser = (socket: Socket, senderId: string) => {
  const roomName = `user:${senderId}`;
  socket.join(roomName);
  socket.emit('connected');
  console.log(`👤 User ${senderId} joined personal room: ${roomName}`);
};




export const handleJoinChat = (socket: Socket, data: any) => {
  const { senderId, receiverId } = data;

  if (!senderId || !receiverId) {
    console.log('❌ Missing senderId or receiverId in join-chat');
    return;
  }

  const chatRoomId = [senderId, receiverId].sort().join('-');
  const roomName = `chat:${chatRoomId}`;

  socket.join(roomName);
  console.log(`💬 User ${senderId} joined chat room: ${roomName}`);

  socket.emit('joined-chat', { chatRoomId });
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
    const { receiverId, senderId, message } = data;

    if (!receiverId || !senderId || !message) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    const chatRoomId = [senderId, receiverId].sort().join('-');
    const roomName = `chat:${chatRoomId}`;

    io.to(roomName).emit('receive-message', {
      senderId,
      receiverId,
      message,
    });

    console.log(`✅ Message sent to room: ${roomName}`);
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
