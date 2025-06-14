const UserList = ({ users, onlineUsers, selectedUser, onUserSelect }) => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Conversations
        </h3>
        
        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No users available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => {
              const isOnline = onlineUsers.includes(user._id)
              const isSelected = selectedUser?._id === user._id
              
              return (
                <button
                  key={user._id}
                  onClick={() => onUserSelect(user._id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                    isSelected ? 'bg-primary-50 border border-primary-200' : 'hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                        isSelected ? 'bg-primary-600' : 'bg-gray-400'
                      }`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${
                          isSelected ? 'text-primary-900' : 'text-gray-900'
                        }`}>
                          {user.username}
                        </p>
                      </div>
                      <p className={`text-xs ${
                        isSelected ? 'text-primary-600' : 'text-gray-500'
                      }`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserList