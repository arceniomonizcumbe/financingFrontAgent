// LockScreenRedirect.js
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LockScreenRedirect = ({ isLocked }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (isLocked) {
      navigate('/lockscreen')
    }
  }, [isLocked, navigate])

  return null
}

export default LockScreenRedirect
