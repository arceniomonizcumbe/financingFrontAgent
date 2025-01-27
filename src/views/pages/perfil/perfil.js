import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTabs,
  CTab,
  CTabList,
  CTabContent,
  CListGroupItem,
  CTabPanel,
  CCardBody,
  CListGroup,
  CCardHeader,
  CCard,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBriefcase,
  cilCheckCircle,
  cilUser,
  cilEnvelopeOpen,
  cilMagnifyingGlass,
  cilMap,
  cilPhone,
  cilLanguage,
} from '@coreui/icons'

const Perfil = () => {
  return (
    <CTabs activeItemKey={1}>
      <CTabList variant="underline-border">
        <CTab aria-controls="profile-tab-pane" itemKey={1}>
          Perfil
        </CTab>
        <CTab aria-controls="contact-tab-pane" itemKey={2}>
          Contactos
        </CTab>
        <CTab aria-controls="disabled-tab-pane" disabled itemKey={3}>
          Desabilitado
        </CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={1}>
          <CCard style={{ width: '22rem' }}>
            <CCardHeader className="text-uppercase fw-bold">Sobre</CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem>
                  <CIcon icon={cilUser} className="me-2" /> Nome : Arcénio Cumbe
                </CListGroupItem>
                <CListGroupItem>
                  <CIcon icon={cilCheckCircle} className="me-2" /> Estado: Active
                </CListGroupItem>
                <CListGroupItem>
                  <CIcon icon={cilBriefcase} className="me-2" /> Função: Developer
                </CListGroupItem>
                <CListGroupItem>
                  <CIcon icon={cilMap} className="me-2" /> País: MZ
                </CListGroupItem>
                <CListGroupItem>
                  <CIcon icon={cilLanguage} className="me-2" /> Idioma: Portuguese
                </CListGroupItem>
                <CListGroupItem>
                  <CIcon icon={cilPhone} className="me-2" /> Contacto: (+258) 843 456-112
                </CListGroupItem>
                <CListGroupItem>
                  <CIcon icon={cilEnvelopeOpen} className="me-2" /> Email: arcenio.cumbe@example.com
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CTabPanel>
        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={2}>
          Contact tab content
        </CTabPanel>
        <CTabPanel className="py-3" aria-labelledby="disabled-tab-pane" itemKey={3}>
          Disabled tab content
        </CTabPanel>
      </CTabContent>
    </CTabs>
  )
}

export default Perfil
