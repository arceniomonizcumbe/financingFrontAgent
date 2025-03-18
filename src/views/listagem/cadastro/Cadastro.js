import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

import ClientValidation from './All/ClientValidation';
import FinanceValidation from './All/FinanceValidation';
import { editClient, createClient } from '../../../axios_api/clientService';
const Validation = ({ clientsCompare = [], isAdmin }) => {
  const [sharedData, setSharedData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams()
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
      }, 300);
      toast.warning('Por favor, complete o formulário de Validação de Cliente.');
      return false;
    }
  
    const financeUnfilledInput = findFirstUnfilledInput(financeRef);
    if (financeUnfilledInput) {
      setTimeout(() => {
        financeUnfilledInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        financeUnfilledInput.focus();
      }, 300);
      toast.warning('Por favor, complete o formulário de Validação de Financiamento.');
      return false;
    }
  
    return true;
  };
  

  const handleDataChange = ( data) => {
    setSharedData((prevState) => ({
      ...prevState,
      ...data ,
    }));
    console.log('ola',sharedData)
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
     
      if (id) {
        delete sharedData.state;
        console.log("----", sharedData)

        if(sharedData.nuit===null){
          toast.success('Nao tem como preceguir.');
          return;

        }else{
          await editClient(id, sharedData, 'nome');
          toast.success('Submetido 2 com sucesso.');
        }
      } else {
        // Check for duplicate entries
        if (
          clientsCompare.some(
            (client) => client.nuit === sharedData.client.nuit && client.id !== id
          )
        ) {

          return;
        }

        if (
          clientsCompare.some(
            (client) =>
              client.email?.toLowerCase() === sharedData.client.email?.toLowerCase() &&
              client.id !== id
          )
        ) {
          toast.warning('Este email já está em uso!');
          return;
        }

        if (
          clientsCompare.some(
            (client) => client.id_Number === sharedData.client.id_Number
          )
        ) {
          toast.warning('Este número de documento já está em uso!');
          return;
        }

        await createClient(sharedData);
        toast.success('Submetido com sucesso.');
      }

      setTimeout(() => {
        navigate(-1);
      }, 4700);
    } catch (error) {
      if(error.response&& error.response.data.message){
        toast.warning(error.response.data.message)
      }else{
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
        <CCol md={6} className="text-center">
          <CButton color="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submetendo...' : 'Submeter'}
          </CButton>
        </CCol>
       
      </CRow>
    </CRow>
  );
};

export default Validation;
