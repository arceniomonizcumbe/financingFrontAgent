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
  CSpinner,
  CFormText,
  CRow,
  CFormCheck,
  CFormTextarea,
} from '@coreui/react'
import { toast, ToastContainer } from 'react-toastify'
import { ClientList, updateClient } from '../../../axios_api/clientService'
import debounce from 'lodash.debounce'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../AuthContext'
import SignatureCanvas from 'react-signature-canvas'
import { Worker, Viewer } from "@react-pdf-viewer/core";

const FinanceValidation = ({ formData, setFormData }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const resultsRef = useRef(null)
  const navigation = useNavigate()
  const location = useLocation()
  const {  client } = location.state || {}

  // if (!loan) {
  //   return navigation(-1)
  // }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((client) => ({
      ...client,
      [name]: type === 'checkbox' ? checked : value,
    }));
    


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

  

  return (
    <div style={{ position: 'relative' }}>
      <CForm className="row g-3">
        <ToastContainer />
        <CCol md={2}>
          <CFormLabel htmlFor="clientId">ID</CFormLabel>
          <CFormInput
            type="text"
            id="clientId"
            name="id_Number"
            value={client.id}
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
            value={client.name}
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
            value={client.id_Number}
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
            value={client.nuit}
            maxLength={9}
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
            value={client.salary}
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
            value={client.employer}
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
            value={client.issueDate ? client.issueDate.split('T')[0] : ''}
            disabled
          />
          <CFormFeedback invalid>Por favor, forneça uma data de emissão válida.</CFormFeedback>
        </CCol>
        <CCol md={2}>
          <CFormLabel htmlFor="clientValidationDate">Data de Validação</CFormLabel>
          <CFormInput
            type="date"
            id="clientValidationDate"
            onChange={handleChange}
            value={client.validationDate ? client.issueDate.split('T')[0] : ''}
            disabled
          />
          <CFormFeedback invalid>Por favor, forneça uma data de validação válida.</CFormFeedback>
        </CCol>
      </CForm>
    </div>
  )
}

const Validation = () => {
  const [validated, setValidated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [prevState, setPrevState] = useState(null)
  const [submiting, setSubmiting] = useState(null)
  const [taxaMax, setTaxaMax] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { loan, client } = location.state || {}
  const {user} = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    id_Number: '',
    insurance: 0,
    nib: '',
    effortRate: 50,
    amount: 0,
    delayInterestRate: 0,
    state: 'Reembolsado',
    authorizer: '',
    state: '',
  })
  const sellerSigCanvas = useRef(null)
  const clientSigCanvas = useRef(null)
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue;

    if (type === "file") {
      const file = files[0] || null;
      newValue = file;
  
      // Generate the file preview URL
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        const filePathKey = name.replace(/File$/, "FilePath"); // Ensure consistent naming
  
        setFormData((prevData) => ({
          ...prevData,
          [filePathKey]: fileUrl,
        }));
      }
    }
    else {
      newValue = type === "checkbox" ? checked : value;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  

  };

  const handleSignatureChange = (signatureType) => {
      const canvasRef = signatureType === "seller" ? sellerSigCanvas : clientSigCanvas;
    
      // Verifica se o ref está pronto e se o canvas não está vazio
      if (!canvasRef.current || canvasRef.current.isEmpty()) {
        toast.warn("Por favor, assine antes de salvar.");
        return;
      }
    
      // Converte a assinatura para uma URL de dados
      const signatureDataUrl = canvasRef.current.toDataURL("image/png");
    
      // Converte a URL de dados em um arquivo Blob
      fetch(signatureDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `${signatureType}Signature.png`, {
            type: "image/png",
            lastModified: new Date().getTime(),
          });
    
          // Atualiza o estado do formulário com o arquivo de assinatura
          setFormData((prev) => ({
            ...prev,
            [signatureType === "seller" ? "docSellerSignatureFile" : "docClientSignatureFile"]: file,
          }));
    
          toast.success("Assinatura salva com sucesso!");
        })
        .catch((error) => {
          console.error(`Erro ao converter ${signatureType} assinatura:`, error);
          toast.error("Erro ao salvar assinatura.");
        });
    };
  useEffect(() => {
    console.log('Dados do formulário atualizados:', formData);
  }, [formData]);

  const verificarTaxaEsforco = () => {
    const taxaEsforcoMaxima = 50
    if (formData.salary > 0 && formData.amount > 0) {
      const taxaCalculada = (formData.amount / formData.salary) * 100
      if (taxaCalculada > taxaEsforcoMaxima) {
        setTaxaMax(true)
        setToastMessage(
          `Taxa de esforço excedida: ${taxaCalculada.toFixed(2)}%. Não pode prosseguir.`,
        )
        setShowToast(true)
      } else {
        setTaxaMax(false)
        setToastMessage(`Taxa de esforço dentro do limite: ${taxaCalculada.toFixed(2)}%.`)
        setShowToast(true)
      }
    }
  }
const renderPreview = (fileUrl) =>
      !fileUrl ? null :
      (fileUrl instanceof Blob ? URL.createObjectURL(fileUrl) : fileUrl).startsWith("data:image") ? (
        <div>
          <h5>Pré-visualização da Assinatura</h5>
          <h6></h6>
          <img src={fileUrl instanceof Blob ? URL.createObjectURL(fileUrl) : fileUrl} alt="Assinatura" className="border rounded" width="200px" />
        </div>
      ) : (
        <div>
        <h6></h6>
          <h5>Pré-visualização do Arquivo</h5>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div
              style={{
                border: "1px solid #ccc",
                height: "500px",
                overflow: "auto",
              }}
            >
              <Viewer fileUrl={fileUrl instanceof Blob ? URL.createObjectURL(fileUrl) : fileUrl} />
            </div>
          </Worker>
        </div>
      );
  const checkLogedUser = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) return user
  }

  useEffect(() => {
    const user = checkLogedUser()
    if (user) {
      setIsAdmin(user.role === 'ADMIN')
    }
  }, [])

  // useEffect(() => {
  //   if (loan) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       ...loan,
  //     }))
  //     setPrevState(loan.state)
  //   }
  // }, [loan])
  //console.log('antes:', loan.client)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log(' updated formData:',client.id)

      if (client.id) {
        setSubmiting(true)

        console.log(' updated formData:', formData)
        const response = await updateClient(formData,client.id )
        if (response) {
          toast.success('Submetido com sucesso')

          setShowToast(true)

          setTimeout(() => {
            navigate('/listagem/clientes')
          }, 3000)
        }
      }
    } catch (error) {
      toast.error('Um erro inesperado ocorreu.')
    } finally {
      setTimeout(() => {
        setSubmiting(false)
      }, 3000)
    }
  }
  const calculateLoanValues = () => {
    const { amount, insurance, interestRate, salary, nrdediasdemora } = formData

    // Helper para garantir que as valor sejam números válidos
    const ensureNumber = (value) => (isNaN(value) || value === null ? 0 : Number(value))

    const calcularjuro = parseFloat((ensureNumber(amount) * 0.1).toFixed(2))
    const calculartaxaselo = parseFloat((ensureNumber(amount) * 0.003).toFixed(2))
    const calcularimpostoselo = parseFloat((calcularjuro * 0.02).toFixed(2))
    const calcularvalorliquido = parseFloat(
      (ensureNumber(amount) - ensureNumber(insurance) - calculartaxaselo).toFixed(2),
    )
    const calcularprestacao = parseFloat(
      (ensureNumber(amount) + calcularjuro + calcularimpostoselo).toFixed(2),
    )
    const calcularjurodemora =
      ensureNumber(nrdediasdemora) > 0
        ? parseFloat(((0.0075 * ensureNumber(amount) * nrdediasdemora) / 365).toFixed(2))
        : 0
    setFormData((prevState) => ({
      ...prevState,
      interestRate: calcularjuro,
      stampFee: calculartaxaselo,
      stampDuty: calcularimpostoselo,
      liquidAmount: calcularvalorliquido,
      installment: calcularprestacao,
      state: isAdmin ? formData.state : 'PENDING',
    }))
  }
  useEffect(() => {
    calculateLoanValues()
    verificarTaxaEsforco()
  }, [formData.salary, formData.insurance, formData.amount])

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const today = new Date();

// Minimum date as today
const minDate = today;

// Maximum date as next month + 1 day
const maxDate = new Date(today);
maxDate.setMonth(maxDate.getMonth() + 1);
maxDate.setDate(maxDate.getDate() + 1);

const formatDate = (date) => date.toISOString().split("T")[0];

const minDateString = formatDate(minDate);
const maxDateString = formatDate(maxDate);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
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
                    <h4 className="text-warning">Dados do Empregador</h4>

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
     {/* <CCol md={6}>
         <CFormLabel htmlFor="sellerSignature">Assinatura do Vendedor</CFormLabel>
         <CFormInput
           type="file"
           id="sellerSignature"
           name="sellerSignature"
           accept=".png, .jpg, .jpeg"
           required
         />
     <CFormFeedback invalid>Por favor, Assinatura do vendor é mandatário.</CFormFeedback>
       </CCol> */}
     
       {/* <CCol md={6}>
         <CFormLabel htmlFor="clientSignature">Assinatura do Cliente</CFormLabel>
         <CFormInput
           type="file"
           id="clientSignature"
           name="clientSignature"
           accept=".png, .jpg, .jpeg"
           required
         />
     <CFormFeedback invalid>Por favor, Assinatura do cliente é mandatário.</CFormFeedback>
     </CCol> */}
     {/* ola mundo */}
                   <h4 className='text-warning'>Meios de Transferência</h4>
                   
                           <CFormText
                           component="p"
                           className="text-warning mt-3"
                           style={{ fontSize: "12px", textAlign: "center" }}
                         >
                          (Escolha o meio no qual quer receber o valor do crédito. Para garantir que o valor solicitado seja transferido corretamente, preencha com atenção
                           os dados da sua conta bancária ou carteira móvel, certifique-se de inserir todas as informações de forma clara e precisa)
                         </CFormText>
                        
                         <CRow className="mb-3">
       <CCol>
         <CFormLabel style={{ fontWeight: "bold" }}>
           Que meio pretende receber o valor do crédito?
           <span style={{ color: 'red' }}>*</span>
         </CFormLabel>
         <CFormCheck
           type="radio"
           id="BANK"
           name="waysOfVAlueReceipt"
           value="BANK"
           label="Banco"
           checked={formData.waysOfVAlueReceipt === "BANK"}
           onChange={handleChange}
           required
         />
         <CFormCheck
           type="radio"
           id="MOBILEWALLET"
           name="waysOfVAlueReceipt"
           value="MOBILEWALLET"
           label="Carteira Móvel"
           checked={formData.waysOfVAlueReceipt === "MOBILEWALLET"}
           onChange={handleChange}
           required
         />
       </CCol>
       {formData.waysOfVAlueReceipt === "BANK" && (
         <CRow>
           <CCol md={6} className="mb-3">
             <CFormLabel htmlFor="bankName">Nome do Banco</CFormLabel>
             <CFormInput
               type="text"
               id="bankName"
               name="bankName"
               value={formData.bankName}
               onChange={handleChange}
               required
             />
           </CCol>
           <CCol md={6} className="mb-3">
             <CFormLabel htmlFor="nib">NIB</CFormLabel>
             <CFormInput
               type="number"
               id="nib"
               name="nib"
               value={formData.nib}
               onChange={handleChange}
               required
               min={0}
               maxLength={21}
             />
           </CCol>
         </CRow>
       )}
       {formData.waysOfVAlueReceipt === "MOBILEWALLET" && (
         <CRow className="mb-3 align-items-center"> {/* Adicionei align-items-center aqui */}
           <CCol md={6}>
             <CFormLabel htmlFor="wallet">Carteira Móvel</CFormLabel>
             <CFormSelect
               id="wallet"
               name="wallet"
               value={formData.wallet}
               onChange={handleChange}
               required
             >
               <option value="">Selecione</option>
               <option value="MPESA">M-Pesa</option>
               <option value="EMOLA">E-Mola</option>
               <option value="MKESH">Mkesh</option>
             </CFormSelect>
           </CCol>
           <CCol md={6}>
             <CFormLabel htmlFor="bankNumber">Número à receber</CFormLabel>
             <CFormInput
               type="number"
               id="bankNumber"
               name="bankNumber"
               value={formData.bankNumber}
               onChange={handleChange}
               required
             />
           </CCol>
         </CRow>
       )}
     </CRow>
     
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
       <CFormLabel htmlFor="clientSignature" className="fw-bold">
         ASSINATURA DO CLIENTE:
       </CFormLabel>
     
       <div className="border rounded p-2">
         {formData.docClientSignatureFile ? (
           <img
             src={URL.createObjectURL(formData.docClientSignatureFile)}
             alt="Assinatura do Cliente"
             className="border rounded"
             style={{ width: "100%", height: "150px", objectFit: "contain" }}
           />
         ) : formData.signatureFilePath ? (
           <img
             src={formData.signatureFilePath}
             alt="Assinatura do Cliente"
             className="border rounded"
             style={{ width: "100%", height: "150px", objectFit: "contain" }}
           />
         ) : (
           <SignatureCanvas
             ref={clientSigCanvas}
             penColor="black"
             canvasProps={{
               width: 400,
               height: 150,
               className: "border rounded",
             }}
           />
         )}
       </div>
     
       {!formData.docClientSignatureFile && !formData.signatureFilePath && (
         <div className="mt-2">
           <CButton color="danger" className="me-2" onClick={() => clientSigCanvas.current.clear()}>
             Limpar
           </CButton>
           <CButton color="primary" onClick={() => handleSignatureChange("client")}>
             Salvar
           </CButton>
         </div>
       )}
     </CCol>
                  </CRow>
                  <h4 className="text-warning">A Ser Preenchido pela Máximo Micro Banco S.A</h4>
                  <CRow>
                  <CCol md={10} className="mb-3">
                  {/* <CFormLabel htmlFor="sellerSignature">Assinatura do Vendedor</CFormLabel>
                  <CFormInput type="file" id="sellerSignature" name="sellerSignature" onChange={handleChange}       accept=".pdf"
     
      required /> */}
                   </CCol>
    <CCol md={6}>
      <CFormLabel htmlFor="sellerSignature" className="fw-bold">
        ASSINATURA DO VENDEDOR:
      </CFormLabel>
    
      <div className="border rounded p-2">
        {formData.docSellerSignatureFile ? (
          <img
            src={URL.createObjectURL(formData.docSellerSignatureFile)}
            alt="Assinatura do Vendedor"
            className="border rounded"
            style={{ width: "100%", height: "150px", objectFit: "contain" }}
          />
        ) : formData.docSellerSignaturePath ? (
          <img
            src={formData.docSellerSignaturePath}
            alt="Assinatura do Vendedor"
            className="border rounded"
            style={{ width: "100%", height: "150px", objectFit: "contain" }}
          />
        ) : (
          <SignatureCanvas
            ref={sellerSigCanvas}
            penColor="black"
            canvasProps={{
              width: 400,
              height: 150,
              className: "border rounded",
            }}
          />
        )}
      </div>
    
      {!formData.docSellerSignatureFile && !formData.docSellerSignaturePath && (
        <div className="mt-2">
          <CButton color="danger" className="me-2" onClick={() => sellerSigCanvas.current.clear()}>
            Limpar
          </CButton>
          <CButton color="primary" onClick={() => handleSignatureChange("seller")}>
            Salvar
          </CButton>
        </div>
      )}
    </CCol>
                   <CCol md={2} className="mb-3">
                   <CFormLabel htmlFor="sellerSignatureDate">Data</CFormLabel>
                   <CFormInput type="date" id="sellerSignatureDate" name="sellerSignatureDate" value={formData.sellerSignatureDate || new Date().toISOString().split('T')[0]} onChange={handleChange} required />
                   </CCol>
                  </CRow>
                  <CRow>
  <CCol md={10} >
               <div className="mb-3">
                 <CFormLabel htmlFor="docManagerSignatureFile">
                 Assinatura do Gestor e Carimbo do Banco<span style={{ color: "red" }}>*</span>
                 </CFormLabel>
                 <CFormInput
                   type="file"
                   id="docManagerSignatureFile"
                   name="docManagerSignatureFile"
                   onChange={(e) => handleChange(e)}
                   accept=".pdf"
                   required={!formData.docManagerSignaturePath}
                 />
                 <small className="form-text text-muted">Somente arquivos em PDF.</small>
               </div>
               {formData.docManagerSignatureFile
                 ? renderPreview(URL.createObjectURL(formData.docManagerSignatureFile))
                 : formData.docManagerSignaturePath
                 ? renderPreview(formData.docManagerSignaturePath)
                 : null}
                 
             </CCol>
                   <CCol md={2} className="mb-3">
                   <CFormLabel htmlFor="managerSignatureDate">Data</CFormLabel>
                   <CFormInput type="date" id="managerSignatureDate" name="managerSignatureDate" value={formData.managerSignatureDate || new Date().toISOString().split('T')[0]} onChange={handleChange} required />
                   </CCol>
                  </CRow>
                  
     {/* ola mundo */}
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
     
                       {/* {isAdmin && (
                         <CButton color="success" onClick={handleApprove} style={{ marginLeft: '10px' }}>
                           Approve Loan
                         </CButton>
                       )} */}
                     </CCol>
                   </CForm>
                   {showToast && <div>{toastMessage}</div>}
                 </CCardBody>
               </CCard>
             </CCol>
    </CRow>
  )
}

export default Validation
