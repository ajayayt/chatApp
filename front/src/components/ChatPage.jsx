import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import { getSocket } from '../services/socket'


const ChatPage = ( user, onLogout) => {
     const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])

    useEffect(() => {
    const socket = getSocket()
    
    if (socket) {
      // Listen for users list
      socket.on('users', (usersList) => {
        setUsers(usersList.filter(u => u._id !== user._id))
      })

      // Listen for online users
      socket.on('onlineUsers', (online) => {
        setOnlineUsers(online)
      })

      // Listen for new messages
      socket.on('newMessage', (message) => {
        setMessages(prev => [...prev, message])
      })

      // Listen for chat history
      socket.on('chatHistory', (history) => {
        setMessages(history)
      })

      // Request users list
      socket.emit('getUsers')
    }

    return () => {
      if (socket) {
        socket.off('users')
        socket.off('onlineUsers')
        socket.off('newMessage')
        socket.off('chatHistory')
      }
    }
  }, [user._id])
   
    const handleUserSelect = (selectedUserId) => {
      const selected = users.find(u => u._id === selectedUserId)
      setSelectedUser(selected)
      setMessages([])
      
      // Request chat history
      const socket = getSocket()
      if (socket) {
        socket.emit('getChatHistory', { userId: user._id, otherUserId: selectedUserId })
      }
    }

    const handleSendMessage = (content) => {
      if (!selectedUser) return
      console.log("user", user)
      const socket = getSocket()
      if (socket) {
        socket.emit('sendMessage', {
          senderId: user._id,
          receiverId: selectedUser._id,
          content
        })
      }
    }
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.username}
                </span>
              </div>
              <div>
                <h2 className="text-white font-semibold">{user?.username}</h2>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-primary-100 text-sm">Online</span>
                </div>
              </div>
            </div>
            <button className="text-primary-100 cursor-pointer transition-colors duration-200 p-1"
              title="Logout" >
              Log Out
            </button>
          </div>
        </div>

        {/* Users List */}
        <UserList
          users={users}
          onlineUsers={onlineUsers}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatWindow
            currentUser={user}
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            isOnline={onlineUsers.includes(selectedUser._id)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-8 8a9.863 9.863 0 01-4.906-1.289l-3.637 3.637c-.18.18-.43.29-.707.29-.552 0-1-.448-1-1 0-.277.11-.527.29-.707l3.637-3.637A9.863 9.863 0 013 12c0-4.418 4.418-8 8-8s8 3.582 8 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage