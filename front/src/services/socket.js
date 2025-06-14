import { io } from 'socket.io-client'

let socket = null

export const connectSocket = (token) => {
  if (socket) {
    socket.disconnect()
  }

  socket = io('http://localhost:3000', {
    auth: {
      token
    }
  })

  socket.on('connect', () => {
    console.log('Connected to server')
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket