import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
  CFormFeedback,
  CAvatar,
  CNavbarBrand,
  CFormLabel,
  CFormCheck,
  CCardLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import avatar7 from './../../../assets/images/avatars/7.png'
import '../../pages/login/login.css'
import '../../../assets/images/background.jpg'

const Password = () => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (password !== '12345') {
        setErrorMessage('Senha incorreta. Tente novamente.')
        alert('Senha incorreta. Tente novamente.')

        setTimeout(() => {
          setErrorMessage('')
        }, 2000)
      } else {
        setErrorMessage('')
        alert('Login realizado com sucesso!')
      }
    }, 2000)
  }

  return (
    <div className="login-bg d-flex flex-column min-vh-100">
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <CNavbarBrand href="#" className="d-flex align-items-center">
            <CAvatar src={avatar7} size="md" className="me-2" />
            <span style={{ whiteSpace: 'nowrap' }}>Empresta-lá</span>
          </CNavbarBrand>
        </div>
      </nav>

      {errorMessage && (
        <CAlert
          color="danger"
          className="text-center mb-3"
          style={{
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {errorMessage}
        </CAlert>
      )}
      <div className="navbar-space"></div>

      <CContainer className="flex-grow-1 d-flex align-items-center justify-content-center">
        <CRow className="justify-content-center w-100">
          <CCol md={5} xs={12}>
            <CCard className="p-4">
              <h2 className="text-center mb-4">Login</h2>
              <h6 className="text-center mb-2 text-muted">Entre e empreste a mola</h6>
              <CForm onSubmit={handleLogin}>
                <CCol md={12} className="mb-3">
                  <CFormLabel htmlFor="email">E-mail</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <CFormFeedback invalid>Por favor, forneça um e-mail válido.</CFormFeedback>
                </CCol>
                <CCol md={12} className="mb-3">
                  <CFormLabel htmlFor="password">Senha</CFormLabel>
                  <CFormInput
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <CFormFeedback invalid>Por favor, forneça uma senha.</CFormFeedback>
                </CCol>
                <CRow className="justify-content-center w-100">
                  <CCol className="mb-3">
                    <CFormCheck
                      type="checkbox"
                      id="rememberMe"
                      label="Lembrete"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                  </CCol>
                  <CCol className="mb-3 text-end">
                    <CCardLink onClick={() => navigate('/pages/password')}>
                      Esqueceu senha?
                    </CCardLink>
                  </CCol>
                </CRow>
                <CButton color="warning" className="w-100 mb-3" type="submit" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'a'}
                </CButton>
              </CForm>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Password
