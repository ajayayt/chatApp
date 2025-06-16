// server.js
import express from 'express';
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.js'
import { authenticateSocket } from './src/middleware/auth.js'
import User from './src/models/User.js'
import Message from './src/models/Message.js'

dotenv.config()
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})


app.use(cors())
app.use(express.json())

const MONGO_URI = 'mongodb+srv://ajaysharan:Ajay123@cluster0.0mp5m.mongodb.net/chatapp'; // Local MongoDB

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes)

const onlineUsers = new Map()

io.use(authenticateSocket)

io.on('connection', (socket) => {
   console.log(`connection ${socket.user.username} `)
  onlineUsers.set(socket.user._id.toString(), {
    socketId: socket.id,
    user: socket.user
  })

  const onlineUserIds = Array.from(onlineUsers.keys())
  
  io.emit('onlineUsers', onlineUserIds)


  socket.on('getUsers', async () => {
    try {
      const users = await User.find({}, 'username email').lean()
      socket.emit('users', users)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  })


  socket.on('getChatHistory', async ({ userId, otherUserId }) => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      })
      .sort({ timestamp: 1 })
      .lean()

      socket.emit('chatHistory', messages)
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  })


  socket.on('sendMessage', async (messageData) => {
    try {
      const { senderId, receiverId, content } = messageData

    
      const message = new Message({
        senderId,
        receiverId,
        content,
        timestamp: new Date()
      })

      await message.save()

    
      const receiverOnline = onlineUsers.get(receiverId)
      if (receiverOnline) {
        io.to(receiverOnline.socketId).emit('newMessage', message)
      }
      
      socket.emit('newMessage', message)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  })


  socket.on('disconnect', () => {
    console.log(`User ${socket.user.username} disconnected`)
    onlineUsers.delete(socket.user._id.toString())
    
   
    const onlineUserIds = Array.from(onlineUsers.keys())
    io.emit('onlineUsers', onlineUserIds)
  })
})

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
