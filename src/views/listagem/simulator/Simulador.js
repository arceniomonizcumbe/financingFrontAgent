import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CAlert,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { toast } from 'react-toastify'

const ValidationModal = ({ isAdmin }) => {
  const [validated, setValidated] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    id_Number: '',
    salary: 0,
    nib: '0000 0000 0000 0000 0000 000',
    effortRate: 50,
    nrdediasdemora: 0,
    insurance: 0,
    amount: 0,
    authorizer: '',
    liquidAmount: '',
    paymentDate: '',
    payments: '',
    stampDuty: '',
    stampFee: '',
  })
  const [visible, setVisible] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [paymentDate, setPaymentDate] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'number') {
        const newValue = value >= 0 ? value : 0;
        setFormData((prevState) => ({
          ...prevState,
          [name]: newValue,
        }));
      } else  {
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
          }))
      }

    
  }

  const verificarTaxaEsforco = () => {
    const taxaEsforcoMaxima = formData.effortRate;
  
    if (formData.salary > 0 && formData.amount > 0) {
      const taxaCalculada = (formData.amount / formData.salary) * 100;
      let message = '';
      let messageColor = '';  // Variable to store the color
      let isBold = '';  // Variable to apply bold style to the percentage
  
      if (taxaCalculada > taxaEsforcoMaxima) {
        message = `Taxa de esforço excedida: ${taxaCalculada.toFixed(2)}%. Não pode prosseguir.`;
        messageColor = 'red';  // Set the color to red
        <CAlert color="red" variant="solid">
        A simple solid primary alert—check it out!
      </CAlert>
      } else {
        message = `Taxa de esforço dentro do limite: ${taxaCalculada.toFixed(2)}%.`;
        messageColor = 'green';  // Set the color to green
      }
  
      setToastMessage(
        <span style={{ color: messageColor }}>
          {message.split(':')[0]}: <span style={{ fontWeight: 'bold' }}>{message.split(':')[1]}</span>
        </span>
      );
      setShowToast(true);
    }  else if (formData.amount === 0 || formData.amount === '') {
        // If the amount is empty, do not remove the toast
        setToastMessage(null);
        setShowToast(false);
      }
  };
  
  useEffect(() => {
    // Get the current date
    const currentDate = new Date();

    // Add one day to the current date
    currentDate.setDate(currentDate.getDate() + 1);

    // Get the day, month, and year components
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 2; // Months are 0-based
    const year = currentDate.getFullYear();

    // Format it as MM/DD/YYYY
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    // Set the value as the current day + 1
    setPaymentDate(formattedDate);
  }, []);


  const calculateLoanValues = () => {
    const { amount, insurance, interestRate, salary, nrdediasdemora } = formData
 
    // Helper para garantir que as valor sejam números válidos
    const ensureNumber = (value) => (isNaN(value) || value === null ? 0 : Number(value))
 
    const calcularjuro = parseFloat((ensureNumber(amount) * 0.1).toFixed(2))
    const calculartaxaselo = parseFloat((ensureNumber(amount) * 0.0003).toFixed(2))
    const calcularimpostoselo = parseFloat((calcularjuro * 0.02).toFixed(2))
    const calcularvalorliquido = parseFloat(
      (ensureNumber(amount) - ensureNumber(insurance)).toFixed(2),
    )
    const calcularprestacao = parseFloat(
      (ensureNumber(amount) + calcularjuro + calcularimpostoselo + calculartaxaselo).toFixed(2),
    )
    const calcularjurodemora =
      ensureNumber(nrdediasdemora) > 0
        ? parseFloat(((0.75 * ensureNumber(amount) * nrdediasdemora) / 365).toFixed(2))
        : 0
    console.log(amount)
    console.log(calculartaxaselo)
    console.log(insurance)
    setFormData((prevState) => ({
      ...prevState,
      interestRate: calcularjuro,
      stampFee: calculartaxaselo,
      stampDuty: calcularimpostoselo,
      liquidAmount: calcularvalorliquido,
      installment: calcularprestacao,
      insurance,
      delayInterestRate: calcularjurodemora,
      state: 'PENDING',
      payments: [],
    }))
  }

  useEffect(() => {
    calculateLoanValues()
    verificarTaxaEsforco()
  }, [formData.salary, formData.insurance, formData.amount])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      event.stopPropagation()
    } else {
      try {
        console.log('Form data submitted:', formData)
        toast.success('Empréstimo criado com sucesso!')
      } catch (error) {
        toast.error('Ocorreu um erro ao criar o empréstimo.')
      }
    }
    setValidated(true)
  }

  const handleApprove = () => {
    toast.success('Loan approved successfully!')
  }

  return (
    <>

      <CCard className="mb-4">
            <CCardHeader className='bg-warning text-center'>
              <strong>Formulário de Simulação do Financiamento</strong>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <CCol md={2}>
                  <CFormLabel htmlFor="salary">Rendimento Mensal</CFormLabel>
                  <CFormInput
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="0"  
                    required
                  />
                  <CFormFeedback invalid>
                    Por favor, insira um valor de empréstimo válido.
                  </CFormFeedback>
                </CCol>
                <CCol md={2}>
                  <CFormLabel htmlFor="loanAmount">Valor do Empréstimo</CFormLabel>
                  <CFormInput
                    type="number"
                    id="loanAmount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                  <CFormFeedback invalid>
                    Por favor, insira um valor de empréstimo válido.
                  </CFormFeedback>
                </CCol>
                <CCol md={2}>
   <CFormLabel htmlFor="clientForce">Taxa de Esforço</CFormLabel>
   <CFormInput
     type="number"
     id="clientForce"
     name="effortRate"
     value={formData.effortRate}
     onChange={handleChange}
     disabled
   />
   <CFormFeedback invalid>Por favor, forneça o valor da taixa válida.</CFormFeedback>
 </CCol>
 <CCol md={2}>
   <CFormLabel htmlFor="interestRate">Juros a Pagar(10%)</CFormLabel>
   <CFormInput
     type="number"
     id="interestRate"
     name="interestRate"
     value={formData.interestRate} // ou interestrate
     onChange={handleChange}
     disabled
   />
   <CFormFeedback invalid>Por favor, forneça o valor da taxa válida.</CFormFeedback>
 </CCol>
 <CCol md={2}>
   <CFormLabel htmlFor="stampFee">Imposto s/o Capital(0,03%)</CFormLabel>
   <CFormInput
     type="number"
     id="stampFee"
     name="stampFee"
     value={formData.stampFee}
     onChange={handleChange}
     disabled
   />
   <CFormFeedback invalid>Por favor, forneça o valor da taxa válida.</CFormFeedback>
 </CCol>
 <CCol md={2}>
   <CFormLabel htmlFor="clientSelo">Imposto de Selo(2%)</CFormLabel>
   <CFormInput
     type="number"
     id="clientSelo"
     name="stampDuty"
     value={formData.stampDuty}
     onChange={handleChange}
     disabled
   />
   <CFormFeedback invalid>
     Por favor, forneça o valor do imposto válida.
   </CFormFeedback>
 </CCol>
 {/* <CCol md={2}>
   <CFormLabel htmlFor="clientdelayInterestRate">Juro de Mora</CFormLabel>
   <CFormInput
     type="number"
     id="clientdelayInterestRate"
     name="delayInterestRate"
     value={formData.delayInterestRate}
     onChange={handleChange}
     disabled
   />
   <CFormFeedback invalid>Por favor, forneça o valor da taxa válida.</CFormFeedback>
 </CCol> */}
 <CCol md={2}>
   <CFormLabel htmlFor="loanEnsurance">Seguros</CFormLabel>
   <CFormInput
     type="number"
     id="insurance"
     name="insurance"
     value={formData.insurance}
     onChange={handleChange}
     required
   ></CFormInput>
   <CFormFeedback invalid>Por favor, selecione um insurance.</CFormFeedback>
 </CCol>
 <CCol md={2}>
   <CFormLabel htmlFor="liquidAmount">Valor Líquido</CFormLabel>
   <CFormInput
     type="number"
     id="liquidAmount"
     name="liquidAmount"
     value={formData.liquidAmount}
     onChange={handleChange}
     disabled
   />
   <CFormFeedback invalid>
     Por favor, forneça o valor do imposto válida.
   </CFormFeedback>
 </CCol>
 <CCol md={2}>
   <CFormLabel htmlFor="clientForce">Prestação</CFormLabel>
   <CFormInput
     type="number"
     id="installment"
     name="installment"
     value={formData.installment}
     disabled
   />
   <CFormFeedback invalid>Por favor, forneça da presatação válida.</CFormFeedback>
 </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="clientForce">NIB</CFormLabel>
                  <CFormInput
                    type="text"
                    id="nib"
                    name="nib"
                    value="0000 0000 0000 0000 0000 000"
                    disabled
                    
                  />
                  <CFormFeedback invalid>Por favor, forneça número válido.</CFormFeedback>
                </CCol>
                <CCol md={2}>
                  <CFormLabel htmlFor="clientValidationDate">Data de Pagamento</CFormLabel>
                  <CFormInput
                    type="date"
                    id="paymentDate"
                    name="paymentDate"
                    value={paymentDate}
                    disabled
                  />
                  <CFormFeedback invalid> forneça data válida.</CFormFeedback>
                </CCol>
                
              </CForm>
              {showToast && <div>{toastMessage}</div>}
            </CCardBody>
          </CCard>
    </>
  )
}

export default ValidationModal
