import React, { useEffect, useState } from 'react'
import { useParams,  useNavigate } from 'react-router-dom'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CFormSelect,
    CListGroup,
    CListGroupItem,
    CSpinner,
    CFormTextarea,
    CRow,
    CFormText,
    CInputGroup,
  } from '@coreui/react'
  import { ToastContainer, toast } from 'react-toastify'

const DocumentValidation = () => {
    const [formData, setFormData] = useState({
      docSignature: null,
      docResidenceProof: null,
      docNUIT: null,
      docIdentity: null,
      docSalary: null,
  })
    return(
    <CRow>
      {/* Documento NUIT */}
  
      <CCol md={3}>
        {formData.docNUIT && (
          <CCard className="document-card">
            <CCardHeader>
              <strong>Documento NUIT</strong>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex align-items-center">
                <span>{formData.docNUIT}</span>
              </div>
            </CCardBody>
            <CCardFooter className="text-center">
              <a
                  href={`/uploads/docResidenceProof/${formData.docNUIT}`}
                  target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info btn-sm mr-2"
              >
                <FaEye /> Visualizar
              </a>
            </CCardFooter>
          </CCard>
        )}
      </CCol>
  
      <CCol md={3}>
        {/* Comprovante de Residência */}
        {formData.docResidenceProof && (
          <CCard className="document-card">
            <CCardHeader>
              <strong>Comprovante de Residência</strong>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex align-items-center">
                <span>{formData.docIdentity}</span>
              </div>
            </CCardBody>
            <CCardFooter className="text-center">
              <a
                href={`/uploads/docResidenceProof/${formData.docIdentity}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info btn-sm mr-2"
              >
                <FaEye /> Visualizar
              </a>
            </CCardFooter>
          </CCard>
        )}
      </CCol>
      <CCol md={3}>
        {/* Comprovante de Residência */}
        {formData.docResidenceProof && (
          <CCard className="document-card">
            <CCardHeader>
              <strong>Comprovante de Residência</strong>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex align-items-center">
                <span>{formData.docResidenceProof}</span>
              </div>
            </CCardBody>
            <CCardFooter className="text-center">
              <a
                href={`/uploads/docResidenceProof/${formData.docResidenceProof}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info btn-sm mr-2"
              >
                <FaEye /> Visualizar
              </a>
            </CCardFooter>
          </CCard>
        )}
      </CCol>
      <CCol md={3}>
        {/* Comprovante de Residência */}
        {formData.docResidenceProof && (
          <CCard className="document-card">
            <CCardHeader>
              <strong>Comprovante de Residência</strong>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex align-items-center">
                <span>{formData.docResidenceProof}</span>
              </div>
            </CCardBody>
            <CCardFooter className="text-center">
              <a
                href={`/uploads/docResidenceProof/${formData.docResidenceProof}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info btn-sm mr-2"
              >
                <FaEye /> Visualizar
              </a>
            </CCardFooter>
          </CCard>
        )}
      </CCol>
      <CFormText
        component="p"
        className="text-muted mt-3"
        style={{ fontSize: "12px", textAlign: "justify" }}
      >
        Este documento é válido apenas para fins de registro interno do Maximo
        Microbanco S.A e não possui validade legal sem a devida assinatura.
      </CFormText>
    </CRow>
    )
  }
  
  export default DocumentValidation