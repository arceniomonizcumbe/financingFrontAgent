import React, { useEffect, useState,useRef  } from 'react'
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useParams,  useNavigate } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'

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
const ClientValidation = ({ value, onChange }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const sigCanvas = useRef(null)

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
    const [filePreview, setFilePreview] = useState(null);
    const [fileName, setFileName] = useState(null);

    const mockJsonResponse = {
      docSalaryFile: "17ddc39c-6b49-493b-95c1-0ecead658e35.pdf",
    } 
    useEffect(() => {
      if (mockJsonResponse.docSalaryFile) {
        // Simulando um caminho local da pasta pública (public folder)
        const filePath = `http://localhost:8081/uploads/${mockJsonResponse.docSalaryFile}`;
        console.log("Caminho do arquivo:", filePath); // Debugging  
              setFilePreview(filePath);
        setFileName(mockJsonResponse.docSalaryFile);
      }
    }, []);
    const [formData, setFormData] = useState({
      name: '',
      birthDate: '',
      id_Number: '',
      // company_ID: '',
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
      inputter: '',
      authorizer: '',
      clientSignature: '',
      local:'',
      contractType:'',
      issueCountry:'',
      qualifications:'',
      resident: '',
      province: '',
      country: '',
      floor: '',
      degreeOfKinship:'',
      residenceProofFilePath:'',
      // docFormSignatureFile: null,
      docSignatureFile: null,
      docResidenceProofFile: null,
      docNUITFile: null,
      docBIFile: null,
      docSalaryFile: null,
      politic: '',
      businessPolitic: '',
      familyPolitic: '',
      familyPoliticPosition: '',
      politicPosition: '',
      businessRelation:'',
      // docClientSignatureFilePath: '',
      // docSalaryFilePath: '',
      // docSignatureFilePath:  '',
      // docFormSignatureFilePath: '',
      // docResidenceProofFilePath:  '',
      // docNUITFilePath:  '',
      // docBIFilePath:  '',
      
  
    })
 

  // const handleFileChange = (event, setFile) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     const fileURL = URL.createObjectURL(file);
  //     setFile(fileURL);
  //   } else {
  //     alert("Por favor, envie um arquivo PDF válido.");
  //   }
  // };
  const handleSignatureChange = () => {
    if (!sigCanvas.current.isEmpty()) {
      const signatureDataUrl = sigCanvas.current.toDataURL("image/png");
  
      // Converter para Blob corretamente
      fetch(signatureDataUrl)
        .then(res => res.blob())
        .then(blob => {
          // Criar um objeto File real
          const file = new File([blob], "signature.png", {
            type: "image/png",
            lastModified: new Date().getTime(), // Adiciona timestamp para simular um arquivo real
          });
  
          // Atualiza o estado do formulário com um objeto File válido
          setFormData(prev => ({
            ...prev,
            docSignatureFile: file,
          }));
                  toast.success("Assinatura salva com sucesso!");         
        })
        .catch(error => console.error("Erro ao converter assinatura:", error));
    } else {
      toast.warn("Por favor, assine antes de salvar.");
    }
  };
  
  
  

  
  
  
  const uploadFile = async (file) => {
    if (!file) {
      alert("Nenhum arquivo selecionado.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file); // "file" deve ser o nome do parâmetro esperado no backend
  
    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        alert("Arquivo enviado com sucesso!");
      } else {
        alert("Falha ao enviar o arquivo.");
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      alert("Erro ao enviar o arquivo.");
    }
  };
  

  // const handleFileChange = (event, setFile) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     setFile(file); // Armazena o arquivo diretamente
  //   } else {
  //     alert("Por favor, envie um arquivo PDF válido.");
  //   }
  // };
  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
  
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file); // Converte para um URL Blob
      setFile(fileUrl);
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
    // useEffect(() => {
    //   const fetchClientData = async () => {
    //     try {
    //       let responsew
    //       responsew = await ListClient()
  
    //       const clientsArray = Array.isArray(responsew) ? responsew : Object.values(responsew || {})
    //       setClientsCompare(clientsArray)
    //       let response
    //       if (id) {
    //        // console.log("id:",id)
    //         response = await ClientList(id)
            
    //         if (response ) {
    //           const data = response
    //           console.log(data)
    //           setClientData(data)
    //           setFormData({
    //             name: data.name || '',
    //             birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
    //             id_Number: data.id_Number || '',
    //             nationality: data.nationality || '',
    //             naturality: data.naturality || '',
    //             issueDate: data.issueDate ? data.issueDate.split('T')[0] : '',
    //             validationDate: data.validationDate ? data.validationDate.split('T')[0] : '',
    //             mother_name: data.mother_name || '',
    //             father_name: data.father_name || '',
    //             address: data.address || '',
    //             city: data.city || '',
    //             contractType:data.contractType ||'',
    //             employerFisicalAddress: data.employerFisicalAddress || '',
    //             nuit: data.nuit || '',
    //             documentType: data.documentType || '',
    //             classification: data.classification || '',
    //             marital_status: data.marital_status || '',
    //             gender: data.gender || '',
    //             pep: data.pep || '',
    //             resident: data.resident || '',
    //             qualifications: data.qualifications || '',
    //             profession: data.profession || '',
    //             employer: data.employer || '',
    //             salary: data.salary || '',
    //             contact: data.contact || '',
    //             email: data.email || '',
    //             contactPersonName: data.contactPersonName || '',
    //             contactPersonPhone: data.contactPersonPhone || '',
    //             terms: data.terms || false,
    //             state: isAdmin ? formData.state || '' : 'PENDING',
    //             inputter: data.inputter || '',
    //             authorizer: data.authorizer || '',
    //             user: data.user || '',
    //             issueCountry: data.issueCountry || '',
    //             company: data.company || '',
    //             docNUITFile: data.docNUITFile || '',
    //             docResidenceProofFile: data.docResidenceProofFile || '',
    //             formattedId: data.formattedId || '',
    //             local: data.local || '',
    //             clientSignature: data.clientSignature || '',
    //             country: data.country || '',
    //             province: data.province || '',
    //             degreeOfKinship: data.degreeOfKinship || '',
    //             floor: data.floor || '',
    //             id: data.id || '',
    //             politic: data.politic || '',
    //             politicPosition: data.politicPosition || '',
    //             familyPolitic: data.familyPolitic || '',
    //             familyPoliticPosition: data.familyPoliticPosition ||'',
    //             businessPolitic: data.businessPolitic || '',
    //             businessRelation: data.businessRelation||'',
    //             name: data.name || '',
    //             salaryFilePath: data.salaryFilePath 
    //             ? `http://localhost:8081/uploads/${data.salaryFilePath}` : 
    //             salaryFilePath: data.salaryFilePath 
    //             ? `http://localhost:8080/uploads/${data.salaryFilePath}` 
    //             : '',
    //         residenceProofFilePath: data.residenceProofFilePath 
    //             ? `http://localhost:8081/uploads/${data.residenceProofFilePath}` 
    //             : '',
    //         biFilePath: data.biFilePath 
    //             ? `http://localhost:8081/uploads/${data.biFilePath}` 
    //             : '',
    //         nuitFilePath: data.nuitFilePath 
    //             ? `http://localhost:8081/uploads/${data.nuitFilePath}` 
    //             : '',
         
    //             signatureFilePath: data.signatureFilePath 
    //             ? `http://localhost:8081/uploads/${data.signatureFilePath}` 
    //             : '',
            
    //                         })
    //                         console.log("Arquivo PDF gerado:", formData.residenceProofFilePath);

    //         } else {
    //           console.warn('No data found for the provided ID.')
    //         } 
    //       } else {
    //         // response = await ListClient(); // Fetching all clients
    //         // console.log("Response without ID:", response);
    //         // const clientsArray = Array.isArray(response) ? response : Object.values(response || {});
    //         // setClients(clientsArray);
    //         // console.log("Converted clients array:", clientsArray);
    //       }
    //     } catch (error) {
    //       console.error('Erro ao buscar dados do cliente:', error)
    //     }
    //   }
  
    //   if (isAdmin !== undefined) {
    //     fetchClientData()
    //   }
    // }, [id, isAdmin])
    useEffect(() => {
      const fetchClientData = async () => {
          try {
              let responsew = await ListClient();
              const clientsArray = Array.isArray(responsew) ? responsew : Object.values(responsew || {});
              setClientsCompare(clientsArray);
              
              if (id) {
                  let response = await ClientList(id);
  
                  if (response) {
                      const data = response;
                      console.log(data);
  
                      // Função para verificar se a imagem existe na porta 8081, caso contrário, usar 8080
                      const getFilePath = async (fileName) => {
                          if (!fileName) return ''; // Retorna vazio se não houver nome de arquivo
                          
                          const url8081 = `http://localhost:8081/uploads/${fileName}`;
                          const url8080 = `http://localhost:8080/uploads/${fileName}`;
  
                          try {
                              const res = await fetch(url8081, { method: 'HEAD' });
                              if (res.ok) return url8081;
                          } catch (error) {
                              console.warn(`Arquivo não encontrado na porta 8081: ${fileName}, tentando 8080...`);
                          }
                          
                          return url8080; // Retorna a URL na porta 8080 se a 8081 falhar
                      };
  
                      // Buscar caminhos das imagens de forma assíncrona
                      const salaryFilePath = await getFilePath(data.salaryFilePath);
                      const residenceProofFilePath = await getFilePath(data.residenceProofFilePath);
                      const biFilePath = await getFilePath(data.biFilePath);
                      const nuitFilePath = await getFilePath(data.nuitFilePath);
                      const signatureFilePath = await getFilePath(data.signatureFilePath);
  
                      setClientData(data);
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
                          contractType: data.contractType || '',
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
                          docNUITFile: data.docNUITFile || '',
                          docResidenceProofFile: data.docResidenceProofFile || '',
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
                          familyPoliticPosition: data.familyPoliticPosition || '',
                          businessPolitic: data.businessPolitic || '',
                          businessRelation: data.businessRelation || '',
                          salaryFilePath,
                          residenceProofFilePath,
                          biFilePath,
                          nuitFilePath,
                          signatureFilePath
                      });
  
                      console.log("Arquivo PDF gerado:", residenceProofFilePath);
                  } else {
                      console.warn('Nenhum dado encontrado para o ID fornecido.');
                  }
              }
          } catch (error) {
              console.error('Erro ao buscar dados do cliente:', error);
          }
      };
  
      if (isAdmin !== undefined) {
          fetchClientData();
      }
  }, [id, isAdmin]);
  
    const handleDownload = () => {
      if (pdfFile) {
        const link = document.createElement("a");
        link.href = pdfFile;
        link.download = "documento.pdf";
        link.click();
      }
    };
    const handleChange = (e) => {
      const { name, type, checked, files, value } = e.target;
    
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
      } else {
        newValue = type === "checkbox" ? checked : value;
      }
    
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    
      // Update the data in `onChange`, if necessary
      const updatedData = { ...formData, [name]: newValue };
      onChange(updatedData);
    };
    

    
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
            // required
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
            // required
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
            value={formData.salary || value.salary}
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

{/* <CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docFormSignature">
      Formulário com Assinatura<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docFormSignature"
      name="docFormSignature"
      onChange={(e) => handleChange(e)}
      accept=".pdf"
      // required
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>
  {renderPreview(formData.docFormSignatureFilePath)}
</CCol> */}

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docResidenceProofFile">
      Comprovante de Residência<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docResidenceProofFile"
      name="docResidenceProofFile"
      onChange={handleChange}
      accept=".pdf"
      required={!formData.residenceProofFilePath}
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>

  {formData.docResidenceProofFile
    ? renderPreview(URL.createObjectURL(formData.docResidenceProofFile))
    : formData.residenceProofFilePath
    ? renderPreview(formData.residenceProofFilePath)
    : null}
</CCol>

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docNUITFile">
      NUIT<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docNUITFile"
      name="docNUITFile"
      onChange={(e) => handleChange(e)}
      accept=".pdf"
      required={!formData.nuitFilePath}

      // required
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>
  {/* {renderPreview(formData.docNUITFilePath)} */}
  {formData.docNUITFile
    ? renderPreview(URL.createObjectURL(formData.docNUITFile))
    : formData.nuitFilePath
    ? renderPreview(formData.nuitFilePath)
    : null}
  
</CCol>

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docBIFile">
      Bilhete de Identidade Válido <span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docBIFile"
      name="docBIFile"
      onChange={(e) => handleChange(e)}
      accept=".pdf"
      required={!formData.biFilePath}

    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>

  {/* Exibir pré-visualização do PDF se disponível */}
  {/* {formData.docBIFile && (
    <iframe
      src={URL.createObjectURL(formData.biFilePath
      )}
      width="100%"
      height="300px"
      title="Pré-visualização do Documento BI"
    />
  )} */}

  {/* Link para Download */}
  {/* {formData.docBIFile && (
    <a
      href={URL.createObjectURL(formData.biFilePath)}
      download={formData.docBIFile.name}
      className="btn btn-primary mt-2"
    >
      Baixar Documento
    </a>
  )} */}
  {formData.docBIFile
    ? renderPreview(URL.createObjectURL(formData.docBIFile))
    : formData.biFilePath
    ? renderPreview(formData.biFilePath)
    : null}
  
</CCol>

<CCol xs={12} md={6}>
  <div className="mb-3">
    <CFormLabel htmlFor="docSalaryFile">
      Declaração de Salário<span style={{ color: "red" }}>*</span>
    </CFormLabel>
    <CFormInput
      type="file"
      id="docSalaryFile"
      name="docSalaryFile"
      onChange={(e) => handleChange(e)}
      accept=".pdf"
      required={!formData.salaryFilePath}
    />
    <small className="form-text text-muted">Somente arquivos em PDF.</small>
  </div>
  {formData.docSalaryFile
    ? renderPreview(URL.createObjectURL(formData.docSalaryFile))
    : formData.salaryFilePath
    ? renderPreview(formData.salaryFilePath)
    : null}
    
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
 {/* <CCol md={6}>
  <CFormLabel htmlFor="clientSignatureFile" className="fw-bold">
    ASSINATURA DO CLIENTE: <span style={{ color: "red" }}>*</span>
  </CFormLabel>
  <CFormInput
    type="file"
    id="clientSignatureFile"
    name="clientSignatureFile"
    onChange={handleChange}
    accept=".pdf, .png, .jpg"
  />
</CCol> */}
{/* 
<CCol md={6}>
  <CFormLabel htmlFor="clientSignature" className="fw-bold">
    ASSINATURA DO CLIENTE:
  </CFormLabel>

  <div className="border rounded p-2">
    {formData.clientSignatureFile ? (
      <img
        src={URL.createObjectURL(formData.clientSignatureFile)}
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
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 150,
          className: "border rounded",
        }}
      />
    )}
  </div>

  {!formData.clientSignatureFile && !formData.signatureFilePath && (
    <div className="mt-2">
      <CButton color="danger" className="me-2" onClick={() => sigCanvas.current.clear()}>
        Limpar
      </CButton>
      <CButton color="primary" onClick={handleSignatureChange}>
        Salvar
      </CButton>
    </div>
  )}
</CCol> */}
{/* olamundo */}
<CCol md={6}>
  <CFormLabel htmlFor="clientSignature" className="fw-bold">
    ASSINATURA DO CLIENTE:
  </CFormLabel>

  <div className="border rounded p-2">
    {formData.docSignatureFile ? (
      <img
        src={URL.createObjectURL(formData.docSignatureFile)}
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
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 150,
          className: "border rounded",
        }}
      />
    )}
  </div>

  {!formData.docSignatureFile && !formData.signatureFilePath && (
    <div className="mt-2">
      <CButton color="danger" className="me-2" onClick={() => sigCanvas.current.clear()}>
        Limpar
      </CButton>
      <CButton color="primary" onClick={() => handleSignatureChange()}>
        Salvar
      </CButton>
    </div>
  )}
</CCol>
  {/* Pré-visualização da assinatura */}
  {renderPreview(formData.docSignatureFilePath)}

</div>

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