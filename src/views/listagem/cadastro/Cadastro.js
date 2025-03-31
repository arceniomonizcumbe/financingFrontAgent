import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../AuthContext'
import ClientValidation from './All/ClientValidation';
import FinanceValidation from './All/FinanceValidation';
import { editClient, createClient } from '../../../axios_api/clientService';
const Validation = ({ clientsCompare = [], isAdmin }) => {
  const [sharedData, setSharedData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams()
    const { user } = useAuth()
  
  const clientRef = useRef(null);
  const financeRef = useRef(null);
  // Helper to find unfilled inputs
  const findFirstUnfilledInput = (ref) => {
    if (!ref?.current) return null;
    return ref.current.querySelector('input:invalid, select:invalid, textarea:invalid');
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await companyApprovedList();
  //       if (response) {
  //         setListaCompany(response);
  //       }
  //     } catch (error) {
  //       console.error("Erro ao buscar a lista de empresas aprovadas:", error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  
  // Validate both forms
  const validateForm = () => {
    const clientUnfilledInput = findFirstUnfilledInput(clientRef);
    if (clientUnfilledInput) {
      setTimeout(() => {
        clientUnfilledInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clientUnfilledInput.focus();
        clientUnfilledInput.style.borderColor = 'red';  // Change border to red
  
        // Reset the border color after 3 seconds
        setTimeout(() => {
          clientUnfilledInput.style.borderColor = '';  // Remove the red border after 3 seconds
        }, 5000);
      }, 500);
      toast.warning('Por favor, complete o formulário de Validação de Cliente.');
      return false;
    }
  
    const financeUnfilledInput = findFirstUnfilledInput(financeRef);
    if (financeUnfilledInput) {
      setTimeout(() => {
        financeUnfilledInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        financeUnfilledInput.focus();
        financeUnfilledInput.style.borderColor = 'red';  // Change border to red
  
        // Reset the border color after 3 seconds
        setTimeout(() => {
          financeUnfilledInput.style.borderColor = '';  // Remove the red border after 3 seconds
        }, 5000);
      }, 500);
      toast.warning('Por favor, complete o formulário de Validação de Financiamento.');
      return false;
    }
  
    return true;
  };
  
  

  const handleDataChange = (data) => {
    setSharedData((prevState) => {
      const updatedData = { 
        ...prevState, 
        ...data };
      console.log("Updated SharedData:", data); // Now it logs the correct value
      return updatedData;
    });
  };
  

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      // Função para remover o prefixo de URL do caminho do arquivo
      const removehostPrefix = (path) => {
        if (!path) return '';
        return path.replace(/^http:\/\/localhost:808[01]\/uploads\//, '');
      };
      
      // Processar dados para remover a URL local dos caminhos dos arquivos
      const processedData = {
        ...sharedData,
        salaryFilePath: removehostPrefix(sharedData.salaryFilePath),
        signatureFilePath: removehostPrefix(sharedData.signatureFilePath),
        biFilePath: removehostPrefix(sharedData.biFilePath),
        residenceProofFilePath: removehostPrefix(sharedData.residenceProofFilePath),
        docManagerSignaturePath: removehostPrefix(sharedData.docManagerSignaturePath),
        docSellerSignaturePath: removehostPrefix(sharedData.docSellerSignaturePath),
        docResidenceProofFilePath: removehostPrefix(sharedData.docResidenceProofFilePath),
        nuitFilePath: removehostPrefix(sharedData.nuitFilePath),


        docBankStatementFilePath: removehostPrefix(sharedData.docBankStatementFilePath),
        docClientRegistrationFormFilePath: removehostPrefix(sharedData.docClientRegistrationFormFilePath),
        docTermsAndConditionsFilePath: removehostPrefix(sharedData.docTermsAndConditionsFilePath),
        docTechnicalSheetFilePath: removehostPrefix(sharedData.docTechnicalSheetFilePath),
        docNibFilePath: removehostPrefix(sharedData.docNibFilePath),
        docCreditApplicationFormFilePath: removehostPrefix(sharedData.docCreditApplicationFormFilePath),
        creditInsuranceFormFinancingFilePath: removehostPrefix(sharedData.creditInsuranceFormFinancingFilePath),
        docCreditInsuranceFormFilePath: removehostPrefix(sharedData.docCreditInsuranceFormFilePath),

      };

      if (id) {
       // delete processedData.state;
        console.log("----", processedData);
        
        if (processedData.nuit === null) {
          toast.success('Não tem como prosseguir.');
          return;
        } else {
          await editClient(id, processedData, user.name);
          toast.success('Submetido com sucesso.');
        }
      } else {
        // Verificar se já existe um cliente com os mesmos dados
        if (
          clientsCompare.some(
            (client) => client.nuit === processedData.client.nuit && client.id !== id
          )
        ) {
          return;
        }
  
        if (
          clientsCompare.some(
            (client) =>
              client.email?.toLowerCase() === processedData.client.email?.toLowerCase() &&
              client.id !== id
          )
        ) {
          toast.warning('Este email já está em uso!');
          return;
        }
  
        if (
          clientsCompare.some(
            (client) => client.id_Number === processedData.client.id_Number
          )
        ) {
          toast.warning('Este número de documento já está em uso!');
          return;
        }
  
        await createClient(processedData,user.name);
        toast.success('Submetido com sucesso.');
      }
  
      setTimeout(() => {
        navigate(-1);
      }, 5000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.warning(error.response.data.message);
      } else {
        console.error('Erro ao submeter os dados:', error);
        toast.error('Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  return (
    <CRow >
      <CCol md={12}>
        <CCard className="mb-4" ref={clientRef}>
          <CCardHeader className="bg-warning text-black text-center">
            <strong>Formulário de Validação de Cliente</strong>
          </CCardHeader>
          <CCardBody>
            <ClientValidation
            value={sharedData}
              onChange={(data) => handleDataChange(data)}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={12}>
        <CCard className="mb-4" ref={financeRef}>
          <CCardHeader className="bg-warning text-black text-center">
            <strong>Formulário de Validação de Financiamento</strong>
          </CCardHeader>
          <CCardBody>
            <FinanceValidation value = {sharedData} onChange={(data) => handleDataChange(data)} />
          </CCardBody>
        </CCard>
      </CCol>
      <CRow>
        <CCol md={6} className="text-left">
          <CButton color="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submetendo...' : 'Submeter'}
          </CButton>
        </CCol>
       
      </CRow>
    </CRow>
  );
};

export default Validation;
