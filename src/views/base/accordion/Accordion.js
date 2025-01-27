import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CFormInput,
  CButton,
} from '@coreui/react'

const Accordion = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CAccordion>
          <CAccordionItem>
            <CAccordionHeader>Cadastro de Cliente</CAccordionHeader>
            <CAccordionBody>
              <CCard>
                <CCardHeader>Formulário de Cadastro</CCardHeader>
                <CCardBody>
                  <form>
                    <CFormInput type="text" label="Nome" required />
                    <CFormInput type="email" label="E-mail" required />
                    <CFormInput type="tel" label="Telefone" required />
                    <CFormInput type="text" label="Endereço" required />
                    <CFormInput type="text" label="Cidade" required />
                    <CFormInput type="text" label="Estado" required />
                    <CFormInput type="text" label="Código Postal" required />
                    <CFormInput type="date" label="Data de Nascimento" required />
                    <CFormInput type="text" label="Gênero" required />
                    <CFormInput type="text" label="CPF" required />
                    <CFormInput type="text" label="Ocupação" required />
                    <CFormInput type="text" label="Observação" />
                    <CButton type="submit" color="primary">
                      Cadastrar
                    </CButton>
                  </form>
                </CCardBody>
              </CCard>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CCol>
    </CRow>
  )
}

export default Accordion
