// LockScreen.js
import React, { useState, useContext } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../AuthContext'

const LockScreen = () => {
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [incorrectAttempts, setIncorrectAttempts] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const { userName } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleUnlock = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (confirmPassword !== 'expectedPassword') {
        setIncorrectAttempts((prev) => prev + 1)
        setErrorMessage('Senha incorreta. Tente novamente.')
        setShowToast(true)

        if (incorrectAttempts + 1 >= 3) {
          setErrorMessage('Número de tentativas excedido. Redirecionando para login.')
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        } else {
          setTimeout(() => setShowToast(false), 3000)
        }
      } else {
        setErrorMessage('')
        alert(`Bem-vindo novamente, ${userName}! Acesso desbloqueado.`)
        setIncorrectAttempts(0)
        navigate('/') // Redireciona para a tela principal
      }
    }, 2000)
  }

  return (
    <div className="lock-screen">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCard>
              <h2 className="text-center">Bloqueado</h2>
              <h6 className="text-center">Olá, {userName}. Confirme a sua senha para o acesso.</h6>

              <CForm onSubmit={handleUnlock}>
                <CFormInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <CButton type="submit" color="warning" className="w-100" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Desbloquear'}
                </CButton>
              </CForm>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <CToaster placement="top-end">
        {showToast && (
          <CToast visible={showToast}>
            <CToastHeader closeButton>Aviso</CToastHeader>
            <CToastBody>{errorMessage}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </div>
  )
}

export default LockScreen
