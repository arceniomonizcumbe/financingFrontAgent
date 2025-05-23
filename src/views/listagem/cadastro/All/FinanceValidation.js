import React, { useState, useEffect, useRef  } from 'react';
import { useParams,  useNavigate } from 'react-router-dom'
import { Worker, Viewer } from "@react-pdf-viewer/core";


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
  CFormSelect, 
  CFormText,
  CFormCheck
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify'
import SignatureCanvas from 'react-signature-canvas'

import {
  ClientList,
  ListClient,
  companyApprovedList 

} from '../../../../axios_api/clientService'
const FinanceValidation = ({ value, onChange }) => {
  const [validated, setValidated] = useState(false);
  const [loanData, setLoanData] = useState({})
  const [listaCompany, setListaCompany] = useState([])
  const { id } = useParams()
  const [clientCompare, setClientsCompare] = useState({})
  const [formData, setFormData] = useState({
   // employerAddress: '',
    creditType: '',
    creditPurpose: '',
    amountInWords: '',
    clientName: '',
    clientSignature: '',
    submissionDate: '',
    sellerSignature: '',
    sellerSignatureDate: '',
    managerSignatureDate: '',
    data: '',
    loanAmount: '',
    loanType:'',
    address: '',
    company:   '',
    waysOfVAlueReceipt:  '',
    docManagerSignatureFile: '',
    docNibFile:'',
    docClientSignatureFile:'',
  },value);
  // const sigCanvas = useRef(null)
  const sellerSigCanvas = useRef(null)
  const clientSigCanvas = useRef(null)

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
      useEffect(() => {
        const fetchClientData = async () => {
          try {
            let responsew = await ListClient();
            const clientsArray = Array.isArray(responsew) ? responsew : Object.values(responsew || {});
            setClientsCompare(clientsArray);
            const response = await companyApprovedList()
      
              if (response) {
                setListaCompany(response.data)
              }
            
            if (id) {
              let response = await ClientList(id);
              console.log("id:", response);
      
              if (response) {
                const data = response;
                setLoanData(data);
      
                // Verifica se o estado não é "Declined" antes de definir as imagens
                //const shouldShowImages = data.state !== "DECLINED";
                const shouldShowImages = data.state ;
      
                const updatedData = {
                  name: data.name || '',
                  creditType: data.creditType || '',
                  creditPurpose: data.creditPurpose || '',
                  amountInWords: data.amountInWords || '',
                  clientName: data.clientName || '',
                  clientSignature: data.clientSignature || '',
                  submissionDate: data.submissionDate || '',
                  sellerSignature: data.sellerSignature || '',
                  sellerSignatureDate: data.sellerSignatureDate || '',
                  managerSignatureDate: data.managerSignatureDate || '',
                  data: data.managerSignatureDate || '',
                  loanAmount: data.loanAmount || '',
                  loanType: data.loanType || '',
                  address: data.address || '',
                  salary: data.salary || '',
                  company: data.company || '',
                  waysOfVAlueReceipt: data.waysOfVAlueReceipt || '',
                  bankName: data.bankName || '',
                  nib: data.nib || '',
                  wallet: data.wallet || '',
                  bankNumber: data.bankNumber || '',
                  // Se o estado for "Declined", os caminhos das imagens serão strings vazias
                  docManagerSignaturePath: shouldShowImages && data.docManagerSignaturePath
                    ? `http://192.168.2.125:8081/uploads/${data.docManagerSignaturePath}`
                    : '',
                  signatureFilePath: shouldShowImages && data.signatureFilePath
                    ? `http://192.168.2.125:8081/uploads/${data.signatureFilePath}`
                    : '',
                  docSellerSignaturePath: shouldShowImages && data.docSellerSignaturePath
                    ? `http://192.168.2.125:8081/uploads/${data.docSellerSignaturePath}`
                    : '',
                  residenceProofFilePath: shouldShowImages && data.residenceProofFilePath
                    ? `http://192.168.2.125:8081/uploads/${data.residenceProofFilePath}`
                    : '',


                  
                    docTermsAndConditionsFilePath: shouldShowImages && data.docTermsAndConditionsFilePath
                    ? `http://192.168.2.125:8081/uploads/${data.docTermsAndConditionsFilePath}`
                    : '',
                    docTechnicalSheetFilePath: shouldShowImages && data.docTechnicalSheetFilePath
                    ? `http://192.168.2.125:8081/uploads/${data.docTechnicalSheetFilePath}`
                    : '',
                    docNibFilePath: shouldShowImages && data.docNibFilePath
                    ? `http://192.168.2.125:8081/uploads/${data.docNibFilePath}`
                    : '',
                 
                    docCreditApplicationFormFilePath: shouldShowImages && data.docCreditApplicationFormFilePath
                    ? `http://192.168.2.125:8081/uploads/${data.docCreditApplicationFormFilePath}`
                    : '',
                    docCreditInsuranceFormFilePath: shouldShowImages && data.docCreditInsuranceFormFilePath
                    ? `http://192.168.2.125:8081/uploads/${data.docCreditInsuranceFormFilePath}`
                    : '',
                };
      
                setFormData(updatedData);
                onChange(data); // Aqui chamamos o `onChange` para atualizar o componente pai
                console.log('--',data)
              } else {
                console.warn('No data found for the provided ID.');
              }
            }
          } catch (error) {
            console.error('Erro ao buscar dados do cliente:', error);
          }
        };
      
        fetchClientData();
      }, [id]);
    
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
  // const handleSignatureChange = () => {
  //   if (!sigCanvas.current.isEmpty()) {
  //     const signatureDataUrl = sigCanvas.current.toDataURL("image/png");
  
  //     // Converter para Blob corretamente
  //     fetch(signatureDataUrl)
  //       .then(res => res.blob())
  //       .then(blob => {
  //         // Criar um objeto File real
  //         const file = new File([blob], "sellerSignature.png", {
  //           type: "image/png",
  //           lastModified: new Date().getTime(), // Adiciona timestamp para simular um arquivo real
  //         });
  
  //         // Atualiza o estado do formulário com um objeto File válido
  //         setFormData(prev => ({
  //           ...prev,
  //           docSellerSignatureFile: file, // Agora é um File idêntico ao docSalaryFile
  //         }));
  //       })
  //       .catch(error => console.error("Erro ao converter assinatura:", error));
  //   } else {
  //     toast.warn("Por favor, assine antes de salvar.");
  //   }
  // };

  const handleSignatureChange = (signatureType) => {
    const canvasRef = signatureType === "seller" ? sellerSigCanvas : clientSigCanvas;
  
    if (!canvasRef.current || canvasRef.current.isEmpty()) {
      toast.warn("Por favor, assine antes de salvar.");
      return;
    }
  
    const signatureDataUrl = canvasRef.current.toDataURL("image/png");
  
    fetch(signatureDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${signatureType}Signature.png`, {
          type: "image/png",
          lastModified: new Date().getTime(),
        });
  
        setFormData((prev) => {
          const updatedData = {
            ...prev,
            [signatureType === "seller" ? "docSellerSignatureFile" : "docClientSignatureFile"]: file,
          };
  
          onChange(updatedData); // Atualiza no componente pai
          return updatedData;
        });
  
        toast.success("Assinatura salva com sucesso!");
      })
      .catch((error) => {
        console.error(`Erro ao converter ${signatureType} assinatura:`, error);
        toast.error("Erro ao salvar assinatura.");
      });
  };
  
  // Monitorar mudanças no formData
  useEffect(() => {
    console.log("Atualização no formData:", formData);
  }, [formData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prevData) => {
        let updatedData = { ...prevData };

        if (name === "company") {
            updatedData = {
                ...updatedData,
                company: { id: value },
            };
        } else if (type === "file") {
            const file = files?.[0] || null;

            if (file) {
                try {
                    const fileUrl = URL.createObjectURL(file);
                    const filePathKey = name.replace(/File$/, "FilePath");

                    updatedData = {
                        ...updatedData,
                        [filePathKey]: fileUrl,
                        [name]: file
                    };
                } catch (error) {
                    console.error("Erro ao criar URL do arquivo:", error);
                }
            } else {
                updatedData = { ...updatedData, [name]: null };
            }
        } else {
            const newValue = type === "checkbox" ? checked : value;
            updatedData = { ...updatedData, [name]: newValue };
        }

        onChange(updatedData);
        return updatedData;
    });
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
    <CFormLabel htmlFor="company">Entidade</CFormLabel>
    <CFormSelect
      id="company"
      name="company"
      value={formData.company?.id || ""}
      onChange={handleChange}
      required
    >
      <option value="" disabled>
        Selecione uma entidade
      </option>
      {Array.isArray(listaCompany) &&
        listaCompany.map((company, index) => (
          <option key={index} value={company.id}>
            {company.name}
          </option>
        ))}
    </CFormSelect>
  </CCol>

  <CCol md={6} className="mb-3">
    <CFormLabel htmlFor="address">Endereço</CFormLabel>
    <CFormInput
      type="text"
      id="address"
      name="address"
      value={formData.address || ""}
      onChange={handleChange}
    />
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
                  <CFormInput type="number" id="salary" name="salary" value={formData.salary||value.salary } onChange={handleChange} required min="0" max="100000000"/>
                </CCol>
                <CCol md={2} className="mb-3">
                  <CFormLabel htmlFor="loanAmount">Valor a Solicitar</CFormLabel>
                  <CFormInput type="number" id="loanAmount" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required min="0" max="50000" />
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
  <CFormLabel htmlFor="clientSignature">
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
  <CFormLabel htmlFor="sellerSignature" >
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

             <h4 className="text-warning">Documentos necessários</h4>

             <CRow className="mt-3">
             <CCol md={6} >
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
                 
             </CCol> <CCol md={6}>
   <div className="mb-3">
     <CFormLabel htmlFor="docTermsAndConditionsFile">
       Termos e condições <span style={{ color: 'red' }}>*</span>
     </CFormLabel>
     <CFormInput
       type="file"
       id="docTermsAndConditionsFile"
       name="docTermsAndConditionsFile"
       onChange={(e) => handleChange(e)}
       accept=".pdf"
       required={!formData.docTermsAndConditionsFilePath}
     />
     <small className="form-text text-muted">Somente arquivos em PDF.</small>
   </div>
   {formData.docTermsAndConditionsFile
     ? renderPreview(URL.createObjectURL(formData.docTermsAndConditionsFile))
     : formData.docTermsAndConditionsFilePath
       ? renderPreview(formData.docTermsAndConditionsFilePath)
       : null}
 </CCol>
 <CCol md={6}>
   <div className="mb-3">
     <CFormLabel htmlFor="docTechnicalSheetFile">
       Ficha técnica <span style={{ color: 'red' }}>*</span>
     </CFormLabel>
     <CFormInput
       type="file"
       id="docTechnicalSheetFile"
       name="docTechnicalSheetFile"
       onChange={(e) => handleChange(e)}
       accept=".pdf"
       required={!formData.docTechnicalSheetFilePath}
     />
     <small className="form-text text-muted">Somente arquivos em PDF.</small>
   </div>
   {formData.docTechnicalSheetFile
     ? renderPreview(URL.createObjectURL(formData.docTechnicalSheetFile))
     : formData.docTechnicalSheetFilePath
       ? renderPreview(formData.docTechnicalSheetFilePath)
       : null}
 </CCol>
 <CCol md={6}>
   <div className="mb-3">
     <CFormLabel htmlFor="docNibFile">
       NIB <span style={{ color: 'red' }}>*</span>
     </CFormLabel>
     <CFormInput
       type="file"
       id="docNibFile"
       name="docNibFile"
       onChange={(e) => handleChange(e)}
       accept=".pdf"
       required={!formData.docNibFilePath}
     />
     <small className="form-text text-muted">Somente arquivos em PDF.</small>
   </div>
   {formData.docNibFile
     ? renderPreview(URL.createObjectURL(formData.docNibFile))
     : formData.docNibFilePath
       ? renderPreview(formData.docNibFilePath)
       : null}
 </CCol>
 <CCol md={6}>
   <div className="mb-3">
     <CFormLabel htmlFor="docCreditApplicationFormFile">
       Formulário de solicitação de crédito <span style={{ color: 'red' }}>*</span>
     </CFormLabel>
     <CFormInput
       type="file"
       id="docCreditApplicationFormFile"
       name="docCreditApplicationFormFile"
       onChange={(e) => handleChange(e)}
       accept=".pdf"
       required={!formData.docCreditApplicationFormFilePath}
     />
     <small className="form-text text-muted">Somente arquivos em PDF.</small>
   </div>
   {formData.docCreditApplicationFormFile
     ? renderPreview(URL.createObjectURL(formData.docCreditApplicationFormFile))
     : formData.docCreditApplicationFormFilePath
       ? renderPreview(formData.docCreditApplicationFormFilePath)
       : null}
 </CCol>
 <CCol md={6}>
   <div className="mb-3">
     <CFormLabel htmlFor="docCreditInsuranceFormFile">
       Formulário de seguro de crédito <span style={{ color: 'red' }}>*</span>
     </CFormLabel>
     <CFormInput
       type="file"
       id="docCreditInsuranceFormFile"
       name="docCreditInsuranceFormFile"
       onChange={(e) => handleChange(e)}
       accept=".pdf"
       required={!formData.docCreditInsuranceFormFilePath}
     />
     <small className="form-text text-muted">Somente arquivos em PDF.</small>
   </div>
   {formData.docCreditInsuranceFormFile
     ? renderPreview(URL.createObjectURL(formData.docCreditInsuranceFormFile))
     : formData.docCreditInsuranceFormFilePath
       ? renderPreview(formData.docCreditInsuranceFormFilePath)
       : null}
 </CCol>
             </CRow>
             <CCol md={2} className="mb-3">
              <CFormLabel htmlFor="managerSignatureDate">Data</CFormLabel>
              <CFormInput type="date" id="managerSignatureDate" name="managerSignatureDate" value={formData.managerSignatureDate || new Date().toISOString().split('T')[0]} onChange={handleChange} required />
              </CCol>
            </CForm>
      </CCol>
    </CRow>
  );
};

export default FinanceValidation;
