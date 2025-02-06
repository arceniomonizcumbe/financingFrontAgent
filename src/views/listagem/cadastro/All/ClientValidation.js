import React, { useEffect, useState } from 'react'
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
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

import {
    companyApprovedList,
    ClientList,
    ListClient,
    createClient,
    editClient,
    getLogByEntityIDName,
  } from '../../../../axios_api/clientService'
const ClientValidation = ({ onChange }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

    const [validated, setValidated] = useState(false)
    const [clients, setClients] = useState([])
    const [clientsCompare, setClientsCompare] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const [listaCompany, setListaCompany] = useState([])
    const [log, setLog] = useState([])
  
    const navigate = useNavigate()
    const [clientData, setClientData] = useState({})
    const [isAdmin, setIsAdmin] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [user, setUser] = useState([])
    const [formData, setFormData] = useState({
      name: '',
      birthDate: '',
      id_Number: '',
      company_ID: '',
      nationality: '',
      naturality: '',
      issueDate: '',
      validationDate: '',
      mother_name: '',
      father_name: '',
      address: '',
      city: '',
      nuit: '',
      marital_status: '',
      gender: '',
      pep: '',
      profession: '',
      employer: '',
      documentType: '',
      classification: '',
      salary: 0,
      contact: '',
      email: '',
      contactPersonName: '',
      formattedId: '',
      contactPersonPhone: '',
      state: 'PENDING',
      terms: false,
      inputter: '',
      authorizer: '',
      clientSignature: '',
      local:'',
      contractType:'',
      employerFisicalAddress: '',
      issueCountry:'',
      qualifications:'',
      resident: '',
      province: '',
      country: '',
      floor: '',
      local:'',
      degreeOfKinship:'',
      docSignature: null,
      docResidenceProof: null,
      docNUIT: null,
      docIdentity: null,
      docSalary: null,
      politic: '',
      businessPolitic: '',
      familyPolitic: '',
      familyPoliticPosition: '',
      politicPosition: '',
      businessRelation:'',
  
    })
    const [docSignatureFile, setDocSignatureFile] = React.useState(null);
  const [docResidenceProofFile, setDocResidenceProofFile] = React.useState(null);
  const [docNUITFile, setDocNUITFile] = React.useState(null);
  const [docIdentityFile, setDocIdentityFile] = React.useState(null);
  const [docSalaryFile, setDocSalaryFile] = React.useState(null);
  const [docClientSignatureFile, setDocClientSignatureFile] = React.useState(null);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setFile(fileURL);
    } else {
      alert("Por favor, envie um arquivo PDF válido.");
    }
  };
    const handleFullScreen = () => {
      setIsFullScreen(!isFullScreen);
    };
    const checkLoggedInUser = async () => {
      const user = JSON.parse(localStorage.getItem('user'))
      const response = await companyApprovedList()
      if (user) {
        setUser(user)
        setIsAdmin(user.role === 'ADMIN')
        if (response) {
          setListaCompany(response.data)
        }
      }
      return null
    }
    useEffect(() => {
      const user = checkLoggedInUser()
      if (user) {
        setIsAdmin(user.role === 'ADMIN')
      }
    }, [])
    useEffect(() => {
      const fetchClientData = async () => {
        try {
          let responsew
          responsew = await ListClient()
  
          const clientsArray = Array.isArray(responsew) ? responsew : Object.values(responsew || {})
          setClientsCompare(clientsArray)
          let response
          if (id) {
           // console.log("id:",id)
            response = await ClientList(id)
            
            if (response ) {
              const data = response
              setClientData(data)
              setFormData({
                name: data.name || '',
                birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
                id_Number: data.id_Number || '',
                nationality: data.nationality || '',
                naturality: data.naturality || '',
                issueDate: data.issueDate ? data.issueDate.split('T')[0] : '',
                validationDate: data.validationDate ? data.validationDate.split('T')[0] : '',
                mother_name: data.mother_name || '',
                father_name: data.father_name || '',
                address: data.address || '',
                city: data.city || '',
                contractType:data.contractType ||'',
                employerFisicalAddress: data.employerFisicalAddress || '',
                nuit: data.nuit || '',
                documentType: data.documentType || '',
                classification: data.classification || '',
                marital_status: data.marital_status || '',
                gender: data.gender || '',
                pep: data.pep || '',
                resident: data.resident || '',
                qualifications: data.qualifications || '',
                profession: data.profession || '',
                employer: data.employer || '',
                salary: data.salary || '',
                contact: data.contact || '',
                email: data.email || '',
                contactPersonName: data.contactPersonName || '',
                contactPersonPhone: data.contactPersonPhone || '',
                terms: data.terms || false,
                state: isAdmin ? formData.state || '' : 'PENDING',
                inputter: data.inputter || '',
                authorizer: data.authorizer || '',
                user: data.user || '',
                issueCountry: data.issueCountry || '',
                company: data.company || '',
                docNUIT: data.docNUIT || '',
                docResidenceProof: data.docResidenceProof || '',
                formattedId: data.formattedId || '',
                local: data.local || '',
                clientSignature: data.clientSignature || '',
                country: data.country || '',
                province: data.province || '',
                degreeOfKinship: data.degreeOfKinship || '',
                floor: data.floor || '',
                id: data.id || '',
                politic: data.politic || '',
                politicPosition: data.politicPosition || '',
                familyPolitic: data.familyPolitic || '',
                familyPoliticPosition: data.familyPoliticPosition ||'',
                businessPolitic: data.businessPolitic || '',
                businessRelation: data.businessRelation||'',
                name: data.name || '',
              })
            } else {
              console.warn('No data found for the provided ID.')
            }
          } else {
            // response = await ListClient(); // Fetching all clients
            // console.log("Response without ID:", response);
            // const clientsArray = Array.isArray(response) ? response : Object.values(response || {});
            // setClients(clientsArray);
            // console.log("Converted clients array:", clientsArray);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do cliente:', error)
        }
      }
  
      if (isAdmin !== undefined) {
        fetchClientData()
      }
    }, [id, isAdmin])
    const handleDownload = () => {
      if (pdfFile) {
        const link = document.createElement("a");
        link.href = pdfFile;
        link.download = "documento.pdf";
        link.click();
      }
    };
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      if (name === 'name' ) {

      }
  
      if (name == 'company_ID') {
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value,
          company: { ...formData.company, id: value },
         // user: { id: user.id },
        })
      } else {
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value,
        //  user: { id: user.id },
        })
      }
      const updatedData = { ...formData, [name]: value };

      onChange(updatedData); 

    }
//     const handleSubmit = async (event) => {
//       event.preventDefault()
//    // Check if the form is valid
//    const form = event.currentTarget;
//    if (!form.checkValidity()) {
//      // Find the first invalid input and scroll to it
//      const firstInvalidInput = form.querySelector(':invalid');
//      if (firstInvalidInput) {
//        firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//        firstInvalidInput.focus();
//      }
//    }
  
  
//       setValidated(true);
  
//       if (form.checkValidity() === false) {
//         event.stopPropagation()
//         toast.warning('Por favor, preencha todos os campos obrigatórios.')
//         return
//       }
  
//       setLoading(true)
//       setIsSubmitting(true)
  
//       try {
//         console.log('formData:', formData)
//         console.log('clients array:', clients)
  
//         if (!Array.isArray(clients)) {
//           console.error('clients is not an array or is undefined')
//           toast.error('Erro ao carregar a lista de clientes. Tente novamente.')
//           return
//         }
  
//         if (isAdmin && (formData.state === 'Selecione' || formData.state === 'PENDING')) {
//           toast.warning('Por favor, selecione uma opção válida para Permissão.')
//           setShowToast(true)
//           return
//         }
  
//         if (id) {
//           const response = await editClient(id, formData, user.name)
//           toast.success('Submetido com sucesso.')
//           console.log('Edit response:', response)
//         } else {
//           // Check for duplicate NUIT
//           const isNuitDuplicate = clientsCompare.some(
//             (client) => client.nuit === formData.nuit && client.id !== parseInt(id),
//           )
//           if (isNuitDuplicate) {
//             toast.warning('Este NUIT já está em uso!')
//             return
//           }
  
//           // Check for duplicate email
//           const isEmailDuplicate = clientsCompare.some(
//             (client) =>
//               client.email.toLowerCase() === formData.email.toLowerCase() &&
//               client.id !== parseInt(id),
//           )
//           if (isEmailDuplicate) {
//             toast.warning('Este email já está em uso!')
//             return
//           }
  
//           // Check for duplicate ID number
//           const isIdNumberDuplicate = clientsCompare.some(
//             (client) => client.id_Number === formData.id_Number,
//           )
//           if (isIdNumberDuplicate) {
//             toast.warning('Este número de documento já está em uso!')
//             return
//           }
//           const response = await createClient(formData, user.name)
//           toast.success('Submetido com sucesso.')
//           console.log('Create response:', response)
//         }
  
//         form.reset()
//         setValidated(true)
  
//         // Navigate back after success
//         setTimeout(() => {
//           navigate(-1)
//         }, 4700)
//       } catch (error) {
//         console.error('Erro ao submeter os dados:', error)
//         toast.error('Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.')
//       } finally {
//         setLoading(false)
//         setTimeout(() => setIsSubmitting(false), 4700)
//       }
//     }
  
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
    const minDate1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    const minDate2 = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate() + 1)
    const maxDate = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate())
    const maxDate1 = new Date(today.getFullYear() + 5, today.getMonth(), today.getDate() + 5)
    const maxDate2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  
    const formatDate = (date) => date.toISOString().split('T')[0]
    const minDateString = formatDate(minDate)
    const minDateString1 = formatDate(minDate1)
    const minDateString2 = formatDate(minDate2)
    const maxDateString = formatDate(maxDate)
    const maxDateString1 = formatDate(maxDate1)
    const maxDateString2 = formatDate(maxDate2)
    const renderPreview = (fileUrl) =>
      fileUrl && (
        <div>
          <h5>Pré-visualização do Arquivo</h5>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <div
              style={{
                border: "1px solid #ccc",
                height: "500px",
                overflow: "auto",
              }}
            >
              <Viewer fileUrl={fileUrl} />
            </div>
          </Worker>
        </div>
      );
    return (
      <CForm
        className=" row g-3 needs-validation"
        noValidate
        validated={validated}
        // onSubmit={handleSubmit}
      >
  
        {/* {id && (
          <CCol md={2}>
            <CFormLabel htmlFor="id"> ID</CFormLabel>
            <CFormInput
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              disabled={true}
            />
            <CFormFeedback invalid>Por favor, forneça um nome válido.</CFormFeedback>
          </CCol>
        )}
   */}
        <CCol md={4}>
          <CFormLabel htmlFor="name">Nome Completo <span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um nome válido.</CFormFeedback>
        </CCol>
        <CCol md={ 4}>
          <CFormLabel htmlFor="documentType">Tipo de Documento<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormSelect
            id="documentType"
            name="documentType"
            value={formData.documentType || ''}
            onChange={handleChange}
            disabled={isAdmin}
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            <option value="ID">Bilhete de Identidade</option>
            <option value="PASSPORT">Passaporte</option>
            <option value="DRIVERLICENCE">Carta de Condução</option>
            <option value="DIRE">DIRE</option>
          </CFormSelect>
          <CFormFeedback invalid>Por favor, selecione um tipo válido.</CFormFeedback>
        </CCol>
        <CCol md={ 4}>
          <CFormLabel htmlFor="clientIdNumber">Número de Identificação<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientIdNumber"
            name="id_Number"
            value={formData.id_Number}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um número de identificação válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientNationality">Nacionalidade<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientNationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça uma nacionalidade válida.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientNaturalidade">Naturalidade<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientNaturalidade"
            name="naturality"
            value={formData.naturality}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça uma naturalidade válida.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientEmail">Email<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="email"
            id="clientEmail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um email válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientContact">Contato<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="tel"
            id="clientContact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um número de contato válido.</CFormFeedback>
        </CCol>
  
        <CCol md={3}>
          <CFormLabel htmlFor="clientBirthDate">Data de Nascimento<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="date"
            id="clientBirthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            disabled={isAdmin}
            required
            min={minDateString}
            max={maxDateString}
          />
          <CFormFeedback invalid>Por favor, forneça uma data de nascimento válida.</CFormFeedback>
        </CCol>
        <CCol md={3}>
          <CFormLabel htmlFor="clientIssueDate">Data de Emissão<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="date"
            id="clientIssueDate"
            name="issueDate"
            value={formData.issueDate}
            min={minDateString2}
            max={maxDateString2}
            onChange={(e) => {
              handleChange(e) // Atualiza a data de emissão no estado
              const issueDate = new Date(e.target.value)
              if (!isNaN(issueDate)) {
                const validationDate = new Date(issueDate)
                validationDate.setFullYear(validationDate.getFullYear() + 5)
                setFormData((prevData) => ({
                  ...prevData,
                  validationDate: validationDate.toISOString().split('T')[0],
                }))
              }
            }}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça uma data de emissão válida.</CFormFeedback>
        </CCol>
  
        <CCol md={2}>
          <CFormLabel htmlFor="clientValidationDate">Data de Validade<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="date"
            id="clientValidationDate"
            name="validationDate"
            value={formData.validationDate}
            onChange={handleChange}
            disabled={isAdmin}
            required
            min={minDateString1}
            max={maxDateString1}
          />
          <CFormFeedback invalid>Por favor, forneça uma data de validade válida.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="issueCountry">Local de Emissão<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="issueCountry"
            name="issueCountry"
            value={formData.issueCountry}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça o local válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="resident">Residente<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormSelect
            type="text"
            id="resident"
            name="resident"
            value={formData.resident}
            onChange={handleChange}
            disabled={isAdmin}
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            <option value="SIM">Sim</option>
            <option value="NÃO">Não</option>
          </CFormSelect>
          <CFormFeedback invalid>Por favor, forneça um status válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="country">País<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um nome do país válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="province">Província</CFormLabel>
          <CFormInput
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            disabled={isAdmin}
          />
          <CFormFeedback invalid>Por favor, forneça um nome do país válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientFatherName">Nome do Pai<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientFatherName"
            name="father_name"
            value={formData.father_name}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um nome de pai válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientMotherName">Nome da Mãe<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientMotherName"
            name="mother_name"
            value={formData.mother_name}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um nome de mãe válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientAddress">Endereço Físico (Av/Rua)<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientAddress"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um endereço válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientCity">Cidade<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientCity"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça uma cidade válida.</CFormFeedback>
        </CCol>
        
       
        <CCol md={4}>
          <CFormLabel htmlFor="floor">Andar</CFormLabel>
          <CFormInput
            type="number"
            id="floor"
            name="floor"
            value={formData.floor}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 3) {
                  handleChange(e);
                }
              }}
            disabled={isAdmin}
            
          />
          <CFormFeedback invalid>Por favor, forneça um número válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientNuit">NUIT<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientNuit"
            name="nuit"
            value={formData.nuit}
            onChange={handleChange}
            disabled={id}
            required
            maxLength={9}
          />
          <CFormFeedback invalid>Por favor, forneça um NUIT válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientMaritalStatus">Estado Civil<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormSelect
            id="clientMaritalStatus"
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            disabled={isAdmin}
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            <option value="MARRIED">CASADO</option>
            <option value="DIVORCED">DIVORCIADO</option>
            <option value="SINGLE">SOLTEIRO</option>
            <option value="WIDOWED">VIÚVO</option>
          </CFormSelect>
          <CFormFeedback invalid>Por favor, selecione um estado civil válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientGender">Gênero<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormSelect
            id="clientGender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={isAdmin}
            required
          >
            <option value="" disabled>
              Escolha..
            </option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
          </CFormSelect>
          <CFormFeedback invalid>Por favor, selecione um campo válido.</CFormFeedback>
        </CCol>
         {/*ALGO NOVO */}
           {/* Section Title */}
           <hr style={{ border: '1px solid #FCAF2E', margin: '20px 0' }} />
           <h4
          style={{
            color: "#ffb732", // Orange title color
            fontWeight: "bold", // Bold text
            marginBottom: "5px", // Spacing below title
          }}
        >
DADOS PROFISSIONAIS        
</h4>
  
        <CCol md={4}>
          
          <CFormLabel htmlFor="qualifications">Habilitações Literárias<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormSelect
            id="qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            disabled={isAdmin}
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            <option value="MEDIO">Ensino Médio</option>
              <option value="LICENCIATURA">Licenciatura</option>
              <option value="MESTRADO">Mestrado</option>
              <option value="OUTRO">Outro</option>
          </CFormSelect>
          <CFormFeedback invalid>Por favor, selecione um campo válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientPep">PEP<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormSelect
            type="text"
            id="clientPep"
            name="pep"
            value={formData.pep}
            onChange={handleChange}
            disabled={isAdmin}
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            <option value="SIM">Sim</option>
            <option value="NÃO">Não</option>
          </CFormSelect>
          <CFormFeedback invalid>Por favor, forneça um status de PEP válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientProfession">Profissão<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientProfession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça uma profissão válida.</CFormFeedback>
        </CCol>
      
          <CCol md={4}>
          <CFormLabel htmlFor="contractType">Tipo de Contrato<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormSelect
            id="contractType"
            name="contractType"
            value={formData.contractType || ''}
            onChange={handleChange}
            disabled={isAdmin}
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            <option value="INDETERMINADO">Indeterminado</option>
              <option value="DETERMINADO_PRAZO">Determinado Prazo</option>
              <option value="CERTO_DETERMINADO">Determinado Prazo certo</option>
              <option value="PRAZO_INCERTO">Determinado Prazo Incerto</option>
              <option value="OUTRO">Outro</option>
          </CFormSelect>
          <CFormFeedback invalid>Por favor, selecione um contrato válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientEmployer">Empregador<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientEmployer"
            name="employer"
            value={formData.employer}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um nome de empregador válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="salary">Rendimento Líquido<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um rendimento válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientContactPersonName">Nome do Contato<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="clientContactPersonName"
            name="contactPersonName"
            value={formData.contactPersonName}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um nome de contato válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientContactPersonPhone">Telefone do Contato<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="tel"
            id="clientContactPersonPhone"
            name="contactPersonPhone"
            value={formData.contactPersonPhone}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um número de telefone válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="classification">Risco do cliente<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormSelect
            id="classification"
            name="classification"
            value={formData.classification || ''}
            onChange={handleChange}
            disabled={isAdmin}
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
          </CFormSelect>
          <CFormFeedback invalid>Por favor, selecione um campo válido.</CFormFeedback>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="clientEmcompanyployer">Entidade<span style={{ color: 'red' }}>*</span></CFormLabel>
          <CFormInput
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={isAdmin}
            required
          />
          <CFormFeedback invalid>Por favor, forneça um nome de empregador válido.</CFormFeedback>
        </CCol>
        {/*ALGO NOVO */}
           {/* Section Title */}
           <hr style={{ border: '1px solid #FCAF2E', margin: '20px 0' }} />
           <h4          style={{
            color: "#ffb732", // Orange title color
            fontWeight: "bold", // Bold text
            marginBottom: "5px", // Spacing below title
          }}
        >
DADOS PESSOAIS DO CLIENTE</h4>
  
       
        {/* Posição Relevante/Sénior */}
        <CRow className="mb-3">
          <CCol>
            <CFormLabel style={{ fontWeight: "bold" }}>
              DETÉM OU DETEVE ALGUMA POSIÇÃO RELEVANTE/SÉNIOR A NÍVEL POLÍTICO OU PÚBLICO?
            <span style={{ color: 'red' }}>*</span></CFormLabel>
            <CFormCheck
              type="radio"
              id="politicSim"
              name="politic"
              value="sim"
              label="SIM"
              checked={formData.politic === "sim"}
              onChange={handleChange}
              required
            />
            <CFormCheck
              type="radio"
              id="politicNao"
              name="politic"
              value="nao"
              label="NÃO"
              checked={formData.politic === "nao"}
              onChange={handleChange}
              required
            />
            {formData.politic === "sim" && (
              <CCol className="mt-2">
                <CFormLabel htmlFor="politicPosition">
                  SE ASSINALOU SIM, IDENTIFIQUE A POSIÇÃO:
                <span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="politicPosition"
                  name="politicPosition"
                  placeholder="Descreva aqui"
                  value={formData.politicPosition || ""}
                  onChange={handleChange}
                  required
  
                />
              </CCol>
            )}
          </CCol>
        </CRow>
  
        {/* Familiar em Cargo Político */}
        <CRow className="mb-3">
          <CCol>
            <CFormLabel style={{ fontWeight: "bold" }}>
              POSSUI ALGUM FAMILIAR QUE EXERCE OU EXERCEU CARGO POLÍTICO RELEVANTE NOS ÚLTIMOS 2 ANOS?
            <span style={{ color: 'red' }}>*</span></CFormLabel>
            <CFormCheck
              type="radio"
              id="familyPoliticSim"
              name="familyPolitic"
              value="sim"
              label="SIM"
              checked={formData.familyPolitic === "sim"}
              onChange={handleChange}
              required
  
            />
            <CFormCheck
              type="radio"
              id="familyPoliticNao"
              name="familyPolitic"
              value="nao"
              label="NÃO"
              checked={formData.familyPolitic === "nao"}
              onChange={handleChange}
              required
  
            />
            {formData.familyPolitic === "sim" && (
              <CCol className="mt-2">
                <CFormLabel htmlFor="familyPoliticPosition">
                  SE ASSINALOU SIM, IDENTIFIQUE A POSIÇÃO:
                <span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="familyPoliticPosition"
                  name="familyPoliticPosition"
                  placeholder="Descreva aqui"
                  value={formData.familyPoliticPosition || ""}
                  onChange={handleChange}
                  required
  
                />
              </CCol>
            )}
          </CCol>
        </CRow>
  
        {/* Negócio ou Relação Comercial */}
        <CRow className="mb-3">
          <CCol>
            <CFormLabel style={{ fontWeight: "bold" }}>
              DETÉM NEGÓCIO OU RELAÇÃO COMERCIAL COM UM DETENTOR DE CARGO SÉNIOR A NÍVEL POLÍTICO OU PÚBLICO?
            <span style={{ color: 'red' }}>*</span></CFormLabel>
            <CFormCheck
              type="radio"
              id="businessPoliticSim"
              name="businessPolitic"
              value="sim"
              label="SIM"
              checked={formData.businessPolitic === "sim"}
              onChange={handleChange}
              required
  
            />
            <CFormCheck
              type="radio"
              id="businessPoliticNao"
              name="businessPolitic"
              value="nao"
              label="NÃO"
              checked={formData.businessPolitic === "nao"}
              onChange={handleChange}
              required
  
            />
            {formData.businessPolitic === "sim" && (
              <CCol className="mt-2">
                <CFormLabel htmlFor="businessRelation">
                  SE ASSINALOU SIM, IDENTIFIQUE O NEGÓCIO OU A RELAÇÃO COMERCIAL:
                <span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="businessRelation"
                  name="businessRelation"
                  placeholder="Descreva aqui"
                  value={formData.businessRelation || ""}
                  onChange={handleChange}
                  required
  
                />
              </CCol>
            )}
          </CCol>
        </CRow>
        {/* Formulário com Assinatura */}
        <hr style={{ border: "1px solid #ffc107", margin: "20px 0" }} />
        <h4>Documentos Necessários</h4>

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docSignature">
      Formulário com Assinatura<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docSignature"
      name="docSignature"
      onChange={(e) => handleFileChange(e, setDocSignatureFile)}
      accept=".pdf"
      required
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>
  {renderPreview(docSignatureFile)}
</CCol>

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docResidenceProof">
      Comprovante de Residência<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docResidenceProof"
      name="docResidenceProof"
      onChange={(e) => handleFileChange(e, setDocResidenceProofFile)}
      accept=".pdf"
      required
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>
  {renderPreview(docResidenceProofFile)}
</CCol>

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docNUIT">
      NUIT<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docNUIT"
      name="docNUIT"
      onChange={(e) => handleFileChange(e, setDocNUITFile)}
      accept=".pdf"
      required
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>
  {renderPreview(docNUITFile)}
</CCol>

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docIdentity">
      Bilhete de Identidade Válido<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docIdentity"
      name="docIdentity"
      onChange={(e) => handleFileChange(e, setDocIdentityFile)}
      accept=".pdf"
      required
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>
  {renderPreview(docIdentityFile)}
</CCol>

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docSalary">
      Declaração de Salário<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docSalary"
      name="docSalary"
      onChange={(e) => handleFileChange(e, setDocSalaryFile)}
      accept=".pdf"
      required
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>
  {renderPreview(docSalaryFile)}
</CCol>
        <hr style={{ border: '1px solid #ffc107', margin: '20px 0' }} />
        <div className="mb-3">
            <p>
              Eu,{" "}
              <CFormInput
                type="text"
                className="d-inline w-50"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Informe o nome do cliente"
                required
              />{" "}
              , declaro que as informações fornecidas neste formulário de
              registro são verdadeiras, completas e precisas. Autorizo o banco a
              realizar as verificações necessárias para validar os dados
              informados, incluindo consultas a órgãos públicos e outras fontes
              relevantes, conforme permitido pela legislação vigente.
            </p>
          </div>
  
          {/* Campos: Assinatura, Local e Data */}
          <CRow className="mb-3">
            {/* Assinatura do Cliente */}
            <div className="mb-3">

            <CCol md={6}>
              <CFormLabel htmlFor="docClientSignature" className="fw-bold">
                ASSINATURA DO CLIENTE:
              <span style={{ color: 'red' }}>*</span></CFormLabel>
             <CFormInput
                type="file"
                id="docClientSignature"
                name="docClientSignature"
                onChange={(e) => handleFileChange(e, setDocClientSignatureFile)}
                accept=".pdf"
                required
              />
            </CCol>
  </div>
  {renderPreview(docClientSignatureFile)}

            {/* Local */}
            <CCol md={4}>
              <CFormLabel htmlFor="local" className="fw-bold">
                LOCAL:
              <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormInput
                type="text"
                id="local"
                name="local"
                placeholder="Informe o local"
                value={formData.local}
                onChange={handleChange}
                required
              />
            </CCol>
  
            {/* Data */}
            <CCol md={2}>
              <CFormLabel htmlFor="data" className="fw-bold">
                DATA:
              </CFormLabel>
              <CFormInput
                type="date"
                id="data"
                name="data"
                value={
                  formData.dateAuthorizationClient ||
                  new Date().toISOString().split("T")[0]
                }
                disabled
              />
            </CCol>
          </CRow>
  
          {/* Nota de rodapé */}
         
        <CRow>
  
          {/* Botão de Submissão */}
          <CCol md={6}>
            <CFormLabel htmlFor="inputter">Inputter<span style={{ color: 'red' }}>*</span></CFormLabel>
            <CFormTextarea
              id="inputter"
              name="inputter"
              value={formData.inputter}
              onChange={handleChange}
              required
              disabled={isAdmin}
            />
            <CFormFeedback invalid>Por favor, forneça detalhes do Inputter.</CFormFeedback>
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="authorizer">Authorizer<span style={{ color: 'red' }}>*</span></CFormLabel>
            <CFormTextarea
              id="authorizer"
              name="authorizer"
              value={formData.authorizer}
              onChange={handleChange}
              required
              disabled={!isAdmin}
            />
            <CFormFeedback invalid>Por favor, forneça detalhes do Authorizer.</CFormFeedback>
          </CCol>
          {/* {isAdmin && (
            <CCol md={4}>
              <CFormLabel htmlFor="state">Permissão<span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormSelect
                id="state"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                required
              >
                <option value="selecione">Selecione...</option>
                <option value="APPROVED">Autorizado</option>
                <option value="DECLINED">Recusado</option>
              </CFormSelect>
              <CFormFeedback invalid>Por favor, selecione um status válido.</CFormFeedback>
            </CCol>
          )} */}
        </CRow>

        <CFormText
        component="p"
        className="text-muted mt-3"
        style={{ fontSize: "12px", textAlign: "justify" }}
      >
        Este documento é válido apenas para fins de registro interno do Maximo
        Microbanco S.A e não possui validade legal sem a devida assinatura.
      </CFormText>

        <ToastContainer />
      </CForm>
       
    )
  }
  export  default ClientValidation;