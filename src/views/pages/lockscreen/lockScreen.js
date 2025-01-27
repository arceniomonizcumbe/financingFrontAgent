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
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleUnlock = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (confirmPassword !== 'expectedPassword') {
        setIncorrectAttempts((prev) => prev + 1)
        const newAttempts = incorrectAttempts + 1

        if (newAttempts >= 3) {
          setErrorMessage('Número de tentativas excedido. Redirecionando para login.')
          setShowToast(true)
          setTimeout(() => navigate('/login'), 3000) // Redireciona para login após 3 segundos
        } else {
          setErrorMessage('Senha incorreta. Tente novamente.')
          setShowToast(true)
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

  const handleSwitchUser = () => {
    navigate('/login')
  }

  return (
    <div className="lock-screen d-flex align-items-center justify-content-center vh-100">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCard className="p-4">
              <h2 className="text-center">Bloqueado</h2>
              <h6 className="text-center">Olá, {userName}. Confirme a sua senha para o acesso.</h6>

              <CForm onSubmit={handleUnlock} className="mt-3">
                <CFormInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
                <CButton type="submit" color="warning" className="w-100 mt-3" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Desbloquear'}
                </CButton>
              </CForm>

              <CButton color="secondary" className="w-100 mt-3" onClick={handleSwitchUser}>
                Entrar com outro usuário
              </CButton>
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
