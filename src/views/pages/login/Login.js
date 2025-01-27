import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CSpinner,
  CAvatar,
  CNavbarBrand,
  CFormLabel,
  CFormCheck,
  CInputGroup,
  CCardLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import avatar7 from './../../../assets/images/avatars/7.png'
import '../../pages/login/login.css'
import { login as apiLogin } from '../../../axios_api/clientService'
import { login as reduxLogin, logout as reduxLogout } from '../../../store'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { cilTrash, cilLockLocked, cilLockUnlocked, cilPencil, cilPlus } from '@coreui/icons'

const Login = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiLogin(email, password)

      if (response.status === 200) {
        const userData = response.data
        localStorage.setItem('user', JSON.stringify(userData))
        dispatch(reduxLogin({ userData }))
        navigate('/dashboard')
        window.location.reload() // Refresh the browser

      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.warning('Email ou Senha inválidos', { position: 'top-right' })
      } else {
        toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.', {
          position: 'top-right',
        })
      }
      console.error('Erro durante o login:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(reduxLogout())
  }

  return (
    <div className="login-bg d-flex flex-column min-vh-100">
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <CNavbarBrand href="#" className="d-flex align-items-center">
            <CAvatar src={avatar7} size="md" className="me-2" />
            <span style={{ whiteSpace: 'nowrap' }}>Maximo</span>
          </CNavbarBrand>
        </div>
      </nav>
      <ToastContainer />

      <CContainer className="flex-grow-1 d-flex align-items-center justify-content-center">
        <CRow className="justify-content-center w-100">
          <CCol md={5} xs={12}>
            <CCard className="p-4">
              <h2 className="text-center mb-4">Login</h2>
              <h6 className="text-center mb-2 text-muted">"Adianta-lá" Finance Platform</h6>
              <CForm onSubmit={handleLogin}>
                <CCol md={12} className="mb-3">
                  <CFormLabel htmlFor="email">Email</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </CCol>
                <CCol md={12} className="mb-3">
                  <CFormLabel htmlFor="password">Senha</CFormLabel>
                  <CInputGroup className="mb-2" style={{ cursor: 'pointer' }}>
                    <CFormInput
                      name="password"
                      value={password}
                      type={showPassword ? 'text' : 'password'}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />{' '}
                    <CButton
                      onClick={togglePasswordVisibility}
                      type="button"
                      color="secondary"
                      variant="outline"
                      id="button-addon1"
                    >
                      <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} />
                    </CButton>
                  </CInputGroup>
                </CCol>
                <CRow className="justify-content-between">
                  {/*<CCol>*/}
                  {/*  <CFormCheck*/}
                  {/*    type="checkbox"*/}
                  {/*    id="rememberMe"*/}
                  {/*    label="Remember Me"*/}
                  {/*    checked={rememberMe}*/}
                  {/*    onChange={() => setRememberMe(!rememberMe)}*/}
                  {/*  />*/}
                  {/*</CCol>*/}
                  <CCol className="text-end">
                    <CCardLink onClick={() => navigate('/pages/password')}>
                      Forgot your password?
                    </CCardLink>
                  </CCol>
                </CRow>
                <CButton color="warning" className="w-100 mt-3" type="submit" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Login'}
                </CButton>
              </CForm>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
