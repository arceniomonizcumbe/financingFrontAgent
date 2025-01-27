import React, { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext() // Explicitly export AuthContext

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from localStorage if it exists
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    // Persist user data in localStorage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    dispatch(loginAction(userData)) // Update Redux state
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user') // Clear user from localStorage
    dispatch(logoutAction()) // Update Redux state
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
