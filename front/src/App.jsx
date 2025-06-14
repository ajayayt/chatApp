
import './App.css'
import { Routes, Route, Navigate  } from 'react-router-dom';
import AuthForm from './components/AuthForm'
import ChatPage from './components/ChatPage'
import { useEffect, useState } from 'react';
import { connectSocket, disconnectSocket } from './services/socket'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

   useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      connectSocket(token)
    }
    
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    console.log("useState",userData)
    console.log("token",token)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    connectSocket(token)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    disconnectSocket()
  }

  return (
     <Routes>
       <Route
        path="/"
        element={!user ? <AuthForm onLogin={handleLogin} /> : <Navigate to="/chat" />}
      />
      <Route
        path="/chat"
        element={user ? <ChatPage user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
      />
    </Routes>
  )
}

export default App
