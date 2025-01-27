/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react'
import {
  CCol,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CListGroup,
  CListGroupItem,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CFormTextarea,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react' // Make sure to install this if you're using CoreUI icons
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LoanList, ClientList, saveLoanDetails } from '../../../axios_api/clientService'
import debounce from 'lodash.debounce'
import './FinanceValidation.css'
import { cilWarning } from '@coreui/icons'

const FinanceValidation = ({ formData, setFormData }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const resultsRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }
  const debouncedSearch = debounce(async (value) => {
    if (value.trim() === '') {
      setSearchResults([])
      return
    }

    try {
      const response = await ClientList(value)

      if (Array.isArray(response) && response.every((client) => client.id && client.name)) {
        setSearchResults(response.slice(0, 4))
      } else {
        setSearchResults([])
        console.error('Erro ao buscar clientes: Response format is incorrect', response)
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      setSearchResults([])
    }
  }, 300)

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  const handleSelectClient = async (client) => {
    const loanData = await LoanList()
    console.log('ola mundo ', loanData)
    console.log('ola 22 ', loanData.foureyes)

    if (client.fourEyes === 'PENDING' || client.fourEyes === 'DECLINED') {
      setVisible(true)
    } else if (loanData[0].foureyes === 'PENDING' || loanData[0].foureyes === 'DECLINED') {
      setVisible(true)
    } else {
      setFormData({
        ...formData,
        name: client.name,
        id_Number: client.id_Number,
        marital_status: client.marital_status,
        employer: client.employer,
        salary: client.salary,
        nuit: client.nuit,
        id: client.id,
        validationDate: client.validationDate,
        issueDate: client.issueDate,
      })
      setSearchResults([])
    }
  }
  const handleOkClick = () => {
    setSearchTerm('')

    setFormData({
      procurar: '',
      name: '',
      id_Number: '',
      marital_status: '',
      employer: '',
      salary: '',
      nuit: '',
      id: '',
      validationDate: '',
      issueDate: '',
    })
    setVisible(false)
  }
  const handleClickOutside = (event) => {
    if (resultsRef.current && !resultsRef.current.contains(event.target)) {
      setSearchResults([])
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <CForm className="mb-3">
        <CCol md={12}>
          <CFormInput
            name="procurar"
            type="text"
            placeholder="Buscar por ID ou Nome"
            value={searchTerm}
            onChange={handleSearch}
          />
        </CCol>
      </CForm>

      {searchResults.length > 0 && (
        <CListGroup className="search-results" ref={resultsRef}>
          {searchResults.map((client) => (
            <CListGroupItem
              key={client.id}
              action="true"
              onClick={() => handleSelectClient(client)}
            >
              {client.id} - {client.name}
            </CListGroupItem>
          ))}
        </CListGroup>
      )}
      <CForm className="row g-3">
        <CCol md={2}>
          <CFormLabel htmlFor="clientId">ID</CFormLabel>
          <CFormInput
            type="text"
            id="clientId"
            name="id_Number"
            value={formData.id}
            onChange={handleChange}
            disabled
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="clientName">Nome Completo</CFormLabel>
          <CFormInput
            type="text"
            id="clientName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientIdNumber">Nr. Identificação</CFormLabel>
          <CFormInput
            type="text"
            id="clientIdNumber"
            name="id"
            value={formData.id_Number}
            onChange={handleChange}
            disabled
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientNuit">Nuit</CFormLabel>
          <CFormInput
            type="text"
            id="clientNuit"
            name="nuit"
            value={formData.nuit}
            onChange={handleChange}
            disabled
          />
          <CFormFeedback invalid>Por favor, forneça um NUIT válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientSalary">Rendimento Líquido</CFormLabel>
          <CFormInput
            type="number"
            id="clientSalary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            disabled
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientEmployer">Empregador</CFormLabel>
          <CFormInput
            type="text"
            id="clientEmployer"
            name="employer"
            value={formData.employer}
            onChange={handleChange}
            disabled
          />
        </CCol>
        <CCol md={2}>
          <CFormLabel htmlFor="clientIssueDate">Data de Emissão</CFormLabel>
          <CFormInput
            type="date"
            id="clientIssueDate"
            onChange={handleChange}
            value={formData.validationDate ? formData.validationDate.split('T')[0] : ''} // Ensuring "yyyy-MM-dd" format
          />
          <CFormFeedback invalid>Por favor, forneça uma data de emissão válida.</CFormFeedback>
        </CCol>
        <CCol md={2}>
          <CFormLabel htmlFor="clientValidationDate">Data de Validação</CFormLabel>
          <CFormInput
            type="date"
            id="clientValidationDate"
            onChange={handleChange}
            value={formData.validationDate ? formData.issueDate.split('T')[0] : ''}
          />
          <CFormFeedback invalid>Por favor, forneça uma data de validação válida.</CFormFeedback>
        </CCol>
        <ToastContainer />
      </CForm>
      <CModal visible={visible} alignment="center" onClose={() => setVisible(false)}>
        <CModalBody className="text-center">
          <CIcon icon={cilWarning} size="xxl" className="text-warning" />
          <p className="mt-3">
            {' '}
            Para prosseguir, o cliente precisa ser autorizado pelo AUTHORIZER. Por favor, aguarde a
            confirmação.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="warning" onClick={handleOkClick}>
            Confirmado
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

const Validation = ({ isAdmin }) => {
  const [validated, setValidated] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    id_Number: '',
    salary: 0,
    nib: '',
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      client: { id: formData.id },

      [name]: type === 'checkbox' ? checked : value,
      [name]: type === 'number' ? parseFloat(value) : value,
    })
  }

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const verificarTaxaEsforco = () => {
    console.log('verificarTaxaEsforco foi chamado!', formData.id)

    const taxaEsforcoMaxima = formData.effortRate

    if (formData.salary > 0 && formData.amount > 0) {
      const taxaCalculada = (formData.amount / formData.salary) * 100
      console.log('Taxa calculada:', taxaCalculada)

      if (taxaCalculada > taxaEsforcoMaxima) {
        setToastMessage(
          `Taxa de esforço excedida: ${taxaCalculada.toFixed(2)}%. Não pode prosseguir.`,
        )
        setShowToast(true)
      } else {
        setToastMessage(`Taxa de esforço dentro do limite: ${taxaCalculada.toFixed(2)}%.`)
        setShowToast(true)
      }
    }
  }
  const calculateLoanValues = () => {
    const { amount, insurance, juro, salary, nrdediasdemora } = formData

    // Calculate imposto de selo and juro based on value
    const impostoSelo = amount * 0.003 // 0,3%
    const juroCalculado = amount * 0.1 // 10%
    const taxadeselo = juroCalculado >= 0 ? juroCalculado : 0
    // Calculate valor liquido based on insurance and imposto
    const valorLiquido =
      insurance !== 0 ? +insurance + impostoSelo : amount + impostoSelo + insurance

    // Calculate prestação
    const prestacao = amount + juroCalculado + impostoSelo

    // Calculate juro de demora if nrdediasdemora is greater than 0
    const juroDemora = nrdediasdemora > 0 ? (0.75 * amount * nrdediasdemora) / 365 : 0

    // Update the formData state with the calculated values
    setFormData((prevState) => ({
      ...prevState,
      stampDuty: impostoSelo,
      juro: juroCalculado,
      liquidAmount: valorLiquido,
      stampFee: taxadeselo,
      installment: prestacao,
      insurance,
      delayInterestRate: juroDemora,
      foureyes: 'PENDING',
    }))
  }
  useEffect(() => {
    calculateLoanValues()
    verificarTaxaEsforco()
  }, [formData.salary, formData.insurance, formData.amount])

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    console.log('client_id before submission:', formData)

    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()

      try {
        const response = await saveLoanDetails(formData)
        console.log('Form Data Submitted:', response)
        toast.success('Empréstimo criado com sucesso!')
        form.reset()
      } catch (error) {
        console.error('Error submitting form:', error)
        toast.error('Ocorreu um erro ao criar o empréstimo. Por favor, tente novamente.')
      }
    }

    setValidated(true)
  }
  const formatDate = (isoString) => {
    const date = new Date(isoString) // Convert the ISO string to a Date object
    const month = String(date.getMonth() + 1).padStart(2, '0') // Ensure two-digit month
    const day = String(date.getDate()).padStart(2, '0') // Ensure two-digit day
    const year = date.getFullYear() // Get the year

    return `${month}/${day}/${year}` // Return in MM-dd-yyyy format
  }

  const handleApprove = async () => {
    try {
      console.log('Loan approved:', { ...formData, status: 'Approved' })
      toast.success('Loan approved successfully!')
      setFormData({ ...formData, status: 'Approved' })
    } catch (error) {
      console.error('Error approving loan:', error)
      toast.error('An error occurred while approving the loan. Please try again.')
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className='bg-warning text-center'>
              <strong>Dados pessoais do cliente</strong>
            </CCardHeader>
            <CCardBody>
              <FinanceValidation formData={formData} setFormData={setFormData} />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className='bg-warning text-center'>
              <strong>Formulário de validação de financiamento</strong>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <CCol md={4}>
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
                  <CFormLabel htmlFor="juro">Taxa de Juro</CFormLabel>
                  <CFormInput
                    type="number"
                    id="juro"
                    name="juro"
                    value={formData.juro}
                    onChange={handleChange}
                    disabled
                  />
                  <CFormFeedback invalid>Por favor, forneça o valor da taxa válida.</CFormFeedback>
                </CCol>
                <CCol md={2}>
                  <CFormLabel htmlFor="stampFee">Taxa de Selo</CFormLabel>
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
                  <CFormLabel htmlFor="clientSelo">Imposto de Selo</CFormLabel>
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
                <CCol md={2}>
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
                </CCol>
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
                <CCol md={2}>
                  <CFormLabel htmlFor="clientForce">NIB</CFormLabel>
                  <CFormInput
                    type="number"
                    id="nib"
                    name="nib"
                    value={formData.nib}
                    onChange={handleChange}
                    required
                  />
                  <CFormFeedback invalid>Por favor, forneça número válido.</CFormFeedback>
                </CCol>
                <CCol md={2}>
                  <CFormLabel htmlFor="clientValidationDate">Data de Pagamento</CFormLabel>
                  <CFormInput
                    type="date"
                    id="paymentDate"
                    name="paymentDate"
                    onChange={handleChange}
                    required
                  />
                  <CFormFeedback invalid> forneça data válida.</CFormFeedback>
                </CCol>
                
                <CCol md={12}>
              <CFormLabel htmlFor="creditPurpose">Finalidade do Crédito</CFormLabel>
              <CFormTextarea
                id="creditPurpose"
                name="creditPurpose"
                rows="3"
                maxLength={500}
                onChange={handleChange}
                required
                value={formData.creditPurpose}
              />
              <CFormFeedback invalid>Por favor, Finalidade de Crédito é um mandatário.</CFormFeedback>

              </CCol>
  {/* Assinatura do Vendedor */}
<CCol md={6}>
    <CFormLabel htmlFor="sellerSignature">Assinatura do Vendedor</CFormLabel>
    <CFormInput
      type="file"
      id="sellerSignature"
      name="sellerSignature"
      accept=".png, .jpg, .jpeg"
      required
    />
<CFormFeedback invalid>Por favor, Assinatura do vendor é mandatário.</CFormFeedback>
  </CCol>

  <CCol md={6}>
    <CFormLabel htmlFor="clientSignature">Assinatura do Cliente</CFormLabel>
    <CFormInput
      type="file"
      id="clientSignature"
      name="clientSignature"
      accept=".png, .jpg, .jpeg"
      required
    />
<CFormFeedback invalid>Por favor, Assinatura do cliente é mandatário.</CFormFeedback>
</CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputter">Inputter</CFormLabel>
                  <CFormTextarea
                    id="inputter"
                    name="inputter"
                    value={formData.inputter}
                    onChange={handleChange}
                    maxLength={100}

                    required
                  />
                  <CFormFeedback invalid>Por favor, forneça detalhes do Inputter.</CFormFeedback>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="authorizer">Authorizer</CFormLabel>
                  <CFormTextarea
                    id="authorizer"
                    name="authorizer"
                    value={formData.authorizer}
                    onChange={handleChange}
                    disabled
                  />
                  <CFormFeedback invalid>Por favor, forneça detalhes do Authorizer.</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CButton color="primary" type="submit">
                    Submeter
                  </CButton>

                  {isAdmin && (
                    <CButton color="success" onClick={handleApprove} style={{ marginLeft: '10px' }}>
                      Approve Loan
                    </CButton>
                  )}
                </CCol>
              </CForm>
              {showToast && <div>{toastMessage}</div>}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal visible={visible} alignment="center" onClose={() => setVisible(false)}>
        <CModalBody>
          <p>Você tem certeza que deseja eliminar este cliente?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="danger">Confirmar</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Validation
