import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormTextarea,
  CRow,
  CFormSelect 
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify'

const FinanceValidation = ({ onChange }) => {
  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    employerAddress: '',
    creditType: '',
    creditPurpose: '',
    amountInWords: '',
    clientName: '',
    clientSignature: '',
    submissionDate: '',
    sellerSignature: '',
    sellerSignatureDate: '',
    managerSignature: '',
    managerSignatureDate: '',
    data: '',
    loanAmount: '',
    loanType:'',
  });

  // Form submit handler
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent form submission

    const form = event.currentTarget;
    // Validate the form
    if (!form.checkValidity()) {
      // Focus on the first invalid field
      const firstInvalidInput = form.querySelector(':invalid');
      if (firstInvalidInput) {
        firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidInput.focus();
      }
      return;
    }

    // If form is valid, call the onSubmit prop (passed from parent)
    onSubmit(formData); // Pass the formData to parent component
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;


    if (name === 'company_ID') {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
        company: { ...formData.company, id: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }

    const updatedData = { ...formData, [name]: value };
    onChange(updatedData); 
  };

  return (
    <CRow>
      <CCol xs={12}>
       
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
            >
                            <h4 className="text-warning">Dados do Empregador</h4>
                            <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="company">Nome da Entidade</CFormLabel>
                  <CFormInput type="text" id="company" name="company" value={formData.company} onChange={handleChange} required />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="address">Endereço</CFormLabel>
                  <CFormInput type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
                </CCol>
              </CRow>
              <h4 className="text-warning">Condições Específicas de Crédito</h4>
              <CRow>
                <CCol md={2} className="mb-3">
                  <CFormLabel htmlFor="loanType">Tipo</CFormLabel>
                  <CFormSelect id="loanType" name="loanType" value={formData.loanType} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    <option value="NEW">Novo</option>
                    <option value="REINFORCEMENT">Reforço</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2} className="mb-3">
                  <CFormLabel htmlFor="salary">Rendimento Líquido</CFormLabel>
                  <CFormInput type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange} required />
                </CCol>
                <CCol md={2} className="mb-3">
                  <CFormLabel htmlFor="loanAmount">Valor a Solicitar</CFormLabel>
                  <CFormInput type="number" id="loanAmount" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="amountInWords">Por Extenso</CFormLabel>
                  <CFormInput type="text" id="amountInWords" name="amountInWords" maxLength={72} value={formData.amountInWords} onChange={handleChange} required />
                </CCol>
              </CRow>
           
              <CCol md={12}>
                <CFormLabel htmlFor="creditPurpose">Finalidade do Crédito<span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormTextarea
                  id="creditPurpose"
                  name="creditPurpose"
                  rows="3"
                  maxLength={500}
                  onChange={handleChange}
                  required
                  value={formData.creditPurpose}
                />
                <CFormFeedback invalid>
                  Por favor, informe a finalidade do crédito.
                </CFormFeedback>
              </CCol>
              <h4 className="text-warning">Declaração do Cliente</h4>
              <p>
                Eu, <CFormInput type="text" className="d-inline w-50" id="name" name="name" value={formData.name} onChange={handleChange} required />, declaro que as informações fornecidas neste formulário de registro são verdadeiras, completas e precisas.
Autorizo o banco a realizar as verificações necessárias para validar os dados informados, incluindo consultas a órgãos públicos e outras fontes relevantes, conforme
permitido pela legislação vigente. Comprometo-me a informar o banco sobre qualquer alteração nos dados fornecidos, bem como a manter minhas informações actualizadas.
Declaro que li e estou ciente das condições gerais do banco, incluindo suas políticas de privacidade e de uso de dados pessoais, e aceito os termos e condições
que me foram apresentados”.
              </p>
              
              {/* Assinaturas */}
             <CRow >
          
                   
                     <CCol md={6}>
                       <CFormLabel htmlFor="clientSignature">Assinatura do Cliente</CFormLabel>
                       <CFormInput
                         type="file"
                         id="clientSignature"
                         name="clientSignature"
                         accept=".pdf"
                         required
                       />
                   <CFormFeedback invalid>Por favor, Assinatura do cliente é mandatário.</CFormFeedback>
                   </CCol>
             </CRow>
             <h4 className="text-warning">A Ser Preenchido pela Máximo Micro Banco S.A</h4>
             <CRow>
             <CCol md={10} className="mb-3">
             <CFormLabel htmlFor="sellerSignature">Assinatura do Vendedor</CFormLabel>
             <CFormInput type="file" id="sellerSignature" name="sellerSignature" onChange={handleChange}       accept=".pdf"
 required />
              </CCol>
              <CCol md={2} className="mb-3">
              <CFormLabel htmlFor="sellerSignatureDate">Data</CFormLabel>
              <CFormInput type="date" id="sellerSignatureDate" name="sellerSignatureDate" value={formData.sellerSignatureDate || new Date().toISOString().split('T')[0]} onChange={handleChange} required />
              </CCol>
             </CRow>
             <CRow>
             <CCol md={10} className="mb-3">
             <CFormLabel htmlFor="managerSignature">Assinatura do Gestor e Carimbo do Banco</CFormLabel>
             <CFormInput type="file" id="managerSignature" name="managerSignature" onChange={handleChange}       accept=".pdf"
 required />
             </CCol>
              <CCol md={2} className="mb-3">
              <CFormLabel htmlFor="managerSignatureDate">Data</CFormLabel>
              <CFormInput type="date" id="managerSignatureDate" name="managerSignatureDate" value={formData.managerSignatureDate || new Date().toISOString().split('T')[0]} onChange={handleChange} required />
              </CCol>
             </CRow>
              
            </CForm>
      </CCol>
    </CRow>
  );
};

export default FinanceValidation;
