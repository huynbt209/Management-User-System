const dbContext = require("../dbInit/dbcontext");
const {Room, Message} = dbContext
const { Server } = require("socket.io");

const chat = async (server) => {
    const io = new Server(server, {
        cors: {
          origin: "*",
        },
      });

    io.on("connection", (socket) => {
        socket.on('user-online', async (userId) => {
          await User.findByIdAndUpdate(userId, {isOnline: true, socketId: socket.id})
        })
    
        socket.on('disconnect', async () => {
          await User.findOneAndUpdate({socketId: socket.id}, {isOnline: false})
        })
    
        socket.on('message-sent', async ({roomId, senderId, content}) => {
          const newMessage = new Message ({
              content : content,
              sender: senderId,
          })
          await newMessage.save();
          const chatroom = await Room.findById(roomId).populate([{ path: 'users' },
          {path: 'messages', populate: {path: 'sender'}}
          ]);
          const updateMessage = [...chatroom.messages, newMessage]
          chatroom.messages = updateMessage
          await chatroom.save();
          const listMessage = await Chatroom.findById(roomId).populate([{ path: 'users' },
          {path: 'messages', populate: {path: 'sender'}}
          ]);
          io.emit('message-received', listMessage.messages)
        })
      });
}


module.exports = chat;