import { useState, useEffect, useRef } from 'react'

const ChatWindow = ({ currentUser, selectedUser, messages, onSendMessage, isOnline }) => {
  const [messageText, setMessageText] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (messageText.trim()) {
      onSendMessage(messageText.trim())
      setMessageText('')
      inputRef.current?.focus()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const groupMessagesByDate = (messages) => {
    const groups = []
    let currentGroup = null

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString()
      
      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = { date: messageDate, messages: [] }
        groups.push(currentGroup)
      }
      
      currentGroup.messages.push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <>
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {selectedUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{selectedUser.username}</h3>
            <p className="text-sm text-gray-500">
              {isOnline ? 'Online' : 'Offline'}
              {typing && isOnline && ' • typing...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 scrollbar-thin">
        {messageGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date separator */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                    <span className="text-xs font-medium text-gray-500">
                      {formatDate(group.messages[0].timestamp)}
                    </span>
                  </div>
                </div>

                {/* Messages for this date */}
                <div className="space-y-4">
                  {group.messages.map((message, index) => {
                    const isOwnMessage = message.senderId === currentUser._id
                    const showAvatar = index === 0 || 
                      group.messages[index - 1].senderId !== message.senderId

                    return (
                      <div
                        key={message._id || index}
                        className={`flex items-end space-x-2 animate-slide-in ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {!isOwnMessage && showAvatar && (
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {selectedUser.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        
                        {!isOwnMessage && !showAvatar && (
                          <div className="w-8 h-8 flex-shrink-0"></div>
                        )}

                        <div className={`message-bubble ${
                          isOwnMessage ? 'message-sent' : 'message-received'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-primary-200' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '120px',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors duration-200 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </>
  )
}

export default ChatWindow