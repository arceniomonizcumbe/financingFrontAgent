import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CNavItem,
  CNavLink,
  CButton,
  CDropdown,
CDropdownItem,
CDropdownMenu,
CDropdownToggle,
  useColorModes,
 
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppHeaderDropdown } from './header/index'
import './header/css.css'
import {
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
const AppHeader = () => {
  const [activeNav, setActiveNav] = useState(null) 
  const [menuVisible, setMenuVisible] = useState(false) 
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  // Map of paths to parent navigation items
  const routeMapping = {
    dashboard: 'dashboard', // Map 'dashboard' to its nav item
    clientes: 'clientes',
    financiamento: 'financiamento',
    cadastro: 'clientes', // Map 'cadastro' under 'clientes'
    simulador: 'simulador',
  }

  // Set activeNav based on the current URL or localStorage
  useEffect(() => {
    const path = window.location.hash.split('/')[2] // Extract the main section of the URL
    const savedNav = localStorage.getItem('activeNav') // Get the saved nav from localStorage
    if (path) {
      setActiveNav(routeMapping[path.toLowerCase()] || null)
    } else if (savedNav) {
      setActiveNav(savedNav)
    }
  }, [])

  const handleNavClick = (id) => {
    const normalizedId = id.toLowerCase()
    setActiveNav(normalizedId)
    localStorage.setItem('activeNav', normalizedId) // Save the active nav to localStorage
    setMenuVisible(false)
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0">
    <CContainer className="border-bottom px-4" fluid>
      {/* Hamburger Menu for Mobile */}
      <CButton
        className="d-md-none"
        onClick={() => setMenuVisible(!menuVisible)}
        color="light"
      >
        <CIcon icon={cilMenu} size="lg" />
      </CButton>
  
      {/* Navigation Menu */}
      <CHeaderNav
        className={`d-md-flex ${
          menuVisible ? "" : "d-none"
        } flex-column flex-md-row`}
      >
       
  
        {/* Navigation Links */}
        <CNavItem>
          <CNavLink
            href="#/dashboard"
            onClick={() => handleNavClick("dashboard")}
            className={activeNav === "dashboard" ? "active-nav" : ""}
          >
            Dashboard
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="#/listagem/clientes"
            onClick={() => handleNavClick("clientes")}
            className={activeNav === "clientes" ? "active-nav" : ""}
          >
            Clientes
          </CNavLink>
        </CNavItem>
        {/* <CNavItem>
          <CNavLink
            href="#/listagem/financiamento"
            onClick={() => handleNavClick("financiamento")}
            className={activeNav === "financiamento" ? "active-nav" : ""}
          >
            Financiamento
          </CNavLink>
        </CNavItem> */}
        <CNavItem>
          <CNavLink
            href="#/listagem/simulador"
            onClick={() => handleNavClick("simulador")}
            className={activeNav === "simulador" ? "active-nav" : ""}
          >
            Simulador
          </CNavLink>
          
        </CNavItem>
        
      </CHeaderNav>
  
      {/* User Dropdown */}
      <CHeaderNav>
      <CNavItem>
          <CDropdown variant="nav-item">
          <CDropdownToggle caret={false}>
  {colorMode === 'dark' ? (
    <CIcon icon={cilMoon} size="lg" />
  ) : colorMode === 'auto' ? (
    <CIcon icon={cilContrast} size="lg" />
  ) : (
    <CIcon icon={cilSun} size="lg" />
  )}
</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === "light"}
                className="d-flex align-items-center"
                onClick={() => setColorMode("light")}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "dark"}
                className="d-flex align-items-center"
                onClick={() => setColorMode("dark")}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "auto"}
                className="d-flex align-items-center"
                onClick={() => setColorMode("auto")}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CNavItem>
        <AppHeaderDropdown />
      </CHeaderNav>
    </CContainer>
  </CHeader>
  
  )
}

export default AppHeader
