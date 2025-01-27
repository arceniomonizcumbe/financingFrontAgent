import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedInUser = checkLoggedInUser()
    if (loggedInUser) {
      setUser(loggedInUser)
    }
  }, [])

  const checkLoggedInUser = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log('Client:', user)

    return user
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.reload() // Refresh the browser

    navigate('/login')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="ms" className="mb-1" />
        <span style={{ marginLeft: '8px' }}>{user?.name}</span>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
          {' '}
          <a>({user?.role})</a>
        </CDropdownHeader>

        <CDropdownItem onClick={() => navigate('/pages/perfil')}>
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>

        <CDropdownItem onClick={() => navigate('/settings')}>
          <CIcon icon={cilSettings} className="me-2" />
          Definições
        </CDropdownItem>

        <CDropdownDivider />

        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Sair
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
