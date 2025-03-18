import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { AppHeaderDropdown } from "./header/index";
import "./header/css.css";
import { cilContrast, cilMenu, cilMoon, cilSun } from "@coreui/icons";

const AppHeader = () => {
  const [activeNav, setActiveNav] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const { colorMode, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme"
  );

  const navigate = useNavigate();
  const location = useLocation(); // Monitora a URL atual

  const routeMapping = {
    "/dashboard": "dashboard",
    "/listagem/clientes": "clientes",
    "/listagem/financiamento": "financiamento",
    "/listagem/simulador": "simulador",
    "/cadastro": "clientes", // Mapeia "cadastro" dentro de "clientes"
  };

  // Atualiza o activeNav automaticamente quando a URL muda
  useEffect(() => {
    const path = location.pathname;
    const matchedNav = routeMapping[path] || null;

    if (matchedNav) {
      setActiveNav(matchedNav);
      localStorage.setItem("activeNav", matchedNav);
    }
  }, [location.pathname]); // Agora monitora mudanças na URL

  const handleNavClick = (id) => {
    setActiveNav(id);
    localStorage.setItem("activeNav", id);
    setMenuVisible(false);
    navigate(Object.keys(routeMapping).find((key) => routeMapping[key] === id));
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0">
      <CContainer className="border-bottom px-4" fluid>
        <CButton
          className="d-md-none"
          onClick={() => setMenuVisible(!menuVisible)}
          color="light"
        >
          <CIcon icon={cilMenu} size="lg" />
        </CButton>

        <CHeaderNav className={`d-md-flex ${menuVisible ? "" : "d-none"} flex-column flex-md-row`}>
          <CNavItem>
            <CNavLink
              onClick={() => handleNavClick("dashboard")}
              className={activeNav === "dashboard" ? "active-nav" : ""}
            >
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              onClick={() => handleNavClick("clientes")}
              className={activeNav === "clientes" ? "active-nav" : ""}
            >
              Clientes
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              onClick={() => handleNavClick("simulador")}
              className={activeNav === "simulador" ? "active-nav" : ""}
            >
              Simulador
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav>
          <CDropdown variant="nav-item">
            <CDropdownToggle caret={false}>
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === "auto" ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem active={colorMode === "light"} onClick={() => setColorMode("light")}>
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem active={colorMode === "dark"} onClick={() => setColorMode("dark")}>
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem active={colorMode === "auto"} onClick={() => setColorMode("auto")}>
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
