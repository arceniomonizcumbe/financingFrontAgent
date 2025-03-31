// src/services/ClienteService.js
import axios from 'axios'
import { useParams } from 'react-router-dom'

const API_URL = 'http://192.168.2.125:8081/extern/client/create'

export const ClientList = async (id) => {
  const API_URL = 'http://192.168.2.125:8081/extern/client'
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}
export const getClientSituation = async (nuit) => {
  const API_URL = 'http://192.168.2.125:8081/extern/getClient'
  const response = await axios.get(`${API_URL}/${nuit}`)
  return response
}

export const ListClient = async () => {
  const API_URL = 'http://192.168.2.125:8081/extern/clients'

  const response = await axios.get(`${API_URL}`)
  return response.data
}
export const getPendingClient = async () => {
  const response = await axios.get(`${API_URL}/pending`)
  return response.data
}

export const createClient = async (cliente,name) => {
  console.log('Relatório dos clientes antes do envio à BD: ', name);

  const API_URL = 'http://192.168.2.125:8081/client/createWithFiles';

  // Criar um novo FormData
  const formData = new FormData();

  // Criar um objeto sem os arquivos para evitar problemas com JSON.stringify
  const clientData = { ...cliente };
  delete clientData.docSignatureFile;
  delete clientData.docResidenceProofFile;
  delete clientData.docSalaryFile;
  delete clientData.docNUITFile;
  delete clientData.docBIFile;
  delete clientData.docClientSignature;
  delete clientData.docNUITFilePath
  delete clientData.docBIFilePath
  delete clientData.docResidenceProofFilePath
  delete clientData.docSalaryFilePath
  delete clientData.creditType
  delete clientData.clientName
  delete clientData.submissionDate
  delete clientData.sellerSignature
  delete clientData.sellerSignatureDate
  delete clientData.managerSignatureDate
  delete clientData.docManagerSignatureFile;
  delete clientData.docClientSignatureFile;
  delete clientData.docSellerSignatureFile;
  delete clientData.docSellerSignatureFilePath
  delete clientData.signatureFilePath
  delete clientData.docManagerSignatureFilePath
  delete clientData.Wallet
  delete clientData.docBankStatementFilePath
  delete clientData.docBankStatementFile
  delete clientData.docClientRegistrationFormFile
  delete clientData.docClientRegistrationFormFilePath
  delete clientData.docNibFile,
  delete clientData.docNibFilePath,
  delete clientData.docCreditApplicationFormFile,
  delete clientData.docCreditApplicationFormFilePath,
  delete clientData.docTechnicalSheetFile,
  delete clientData.docTechnicalSheetFilePath,
  delete clientData.docTermsAndConditionsFile,
  delete clientData.docTermsAndConditionsFilePath,
  delete clientData.docCreditInsuranceFormFile
  delete clientData.docCreditInsuranceFormFilePath
  delete clientData.creditInsuranceFormFinancingFilePath

  clientData.stateLoan = 'PENDING';
  // Adicionar os dados do cliente em formato JSON
  formData.append('clientData', JSON.stringify(clientData));

  // Adicionar os arquivos (somente se existirem)
  //const formData = new FormData();
  formData.append('clientData', JSON.stringify(clientData));
  
  if (cliente.docSignatureFile) {
    console.log("🔹 docSignatureFile:", cliente.docSignatureFile.name);
    formData.append('docSignatureFile', cliente.docSignatureFile);
  }
  if (cliente.docClientSignatureFile) {
    console.log("🔹 docSignatureFile:", cliente.docClientSignatureFile.name);
    formData.append('docSignatureFile', cliente.docClientSignatureFile);
  }
  
  if (cliente.docResidenceProofFile) {
    console.log("🔹 docResidenceProofFile:", cliente.docResidenceProofFile.name);
    formData.append('docResidenceProofFile', cliente.docResidenceProofFile);
  }
  
  if (cliente.docSalaryFile) {
    console.log("🔹 docSalaryFile:", cliente.docSalaryFile.name);
    formData.append('docSalaryFile', cliente.docSalaryFile);
  }
  
  if (cliente.docNUITFile) {
    console.log("🔹 docNUITFile:", cliente.docNUITFile.name);
    formData.append('docNUITFile', cliente.docNUITFile);
  }
  
  if (cliente.docBIFile) {
    console.log("🔹 docBIFile:", cliente.docBIFile.name);
    formData.append('docBIFile', cliente.docBIFile);
  }
  
  if (cliente.docManagerSignatureFile) {
    console.log("🔹 docManagerSignatureFile:", cliente.docManagerSignatureFile.name);
    formData.append('docManagerSignatureFile', cliente.docManagerSignatureFile);
  }
  
  if (cliente.docSellerSignatureFile) {
    console.log("🔹 docSellerSignatureFile:", cliente.docSellerSignatureFile.name);
    formData.append('docSellerSignatureFile', cliente.docSellerSignatureFile);
  }
  if (cliente.docBankStatementFile) {
    console.log("🔹 docBankStatementFile:", cliente.docBankStatementFile.name);
    formData.append('docBankStatementFile', cliente.docBankStatementFile);
  }
  if (cliente.docClientRegistrationFormFile) {
    console.log("🔹 docClientRegistrationFormFile:", cliente.docClientRegistrationFormFile.name);
    formData.append('docClientRegistrationFormFile', cliente.docClientRegistrationFormFile);
  }
  if (cliente.docTermsAndConditionsFile) {
    console.log("🔹 docTermsAndConditionsFile:", cliente.docTermsAndConditionsFile.name);
    formData.append('docTermsAndConditionsFile', cliente.docTermsAndConditionsFile);
  }
  if (cliente.docTechnicalSheetFile) {
    console.log("🔹 docTechnicalSheetFile:", cliente.docTechnicalSheetFile.name);
    formData.append('docTechnicalSheetFile', cliente.docTechnicalSheetFile);
  }
  if (cliente.docCreditApplicationFormFile) {
    console.log("🔹 docCreditApplicationFormFile:", cliente.docCreditApplicationFormFile.name);
    formData.append('docCreditApplicationFormFile', cliente.docCreditApplicationFormFile);
  }
  if (cliente.docNibFile) {
    console.log("🔹 docNibFile:", cliente.docNibFile.name);
    formData.append('docNibFile', cliente.docNibFile);
  }
  
  if (cliente.docCreditInsuranceFormFile) {
    console.log("🔹 docCreditInsuranceFormFile:", cliente.docCreditInsuranceFormFile.name);
    formData.append('docCreditInsuranceFormFile', cliente.docCreditInsuranceFormFile);
  }
  // Verificar se os arquivos estão no formData
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }
  
  
  try {
    // Enviar requisição usando axios
    const response = await axios.post(API_URL, formData, {
      params: { performedBy: name },
    });

    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};

export const editClient = async (id, sharedData, name, files) => {
  const API_URL = 'http://192.168.2.125:8081/externalclient/updateWithFiles';
  const formData = new FormData();

  // Create a cleaned version of sharedData
  const cleanData = { ...sharedData };

  // Remove unwanted fields
  [
    'docBIFilePath', 'wallet', 'clientName', 'docBIFile', 'creditType',
    'docManagerSignatureFilePath', 'employerFisicalAddress', 'terms', 'user',
    'submissionDate', 'docNUITFile', 'managerSignatureDate', 'sellerSignature',
    'sellerSignatureDate', 'docResidenceProofFile', 'docManagerSignatureFile','docClientSignatureFile',
    'docSalaryFile', 'docNUITFilePath', 'docResidenceProofFilePath','docSignatureFile',
    'docSalaryFilePath', 'docSignaturePath','docSignatureFilePath','docSellerSignatureFile',
    'docSellerSignatureFilePath','docBankStatementFile','docBankStatementFilePath',
    'docClientRegistrationFormFile','docClientRegistrationFormFilePath','docCreditInsuranceFormFile',
    'docCreditInsuranceFormFilePath' , 'docNibFile','docNibFilePath',
    'docCreditApplicationFormFile','docCreditApplicationFormFilePath',
    'docTechnicalSheetFile','docTechnicalSheetFilePath',
    'docTermsAndConditionsFile','docTermsAndConditionsFilePath','creditInsuranceFormFinancingFilePath',
  ].forEach(field => delete cleanData[field]);

  // Append cleaned data
  formData.append('clientData', JSON.stringify(cleanData));
  formData.append('performedBy', name);

  // Append files if they exist in sharedData
  const fileFields = [
    'docSignatureFile', 'docResidenceProofFile', 'docSalaryFile',
    'docNUITFile', 'docBIFile', 'docManagerSignatureFile', 
    'docSellerSignatureFile','docBankStatementFile',
    'docClientRegistrationFormFile','docCreditInsuranceFormFile',
    'docNibFile','docCreditApplicationFormFile',
    'docTechnicalSheetFile',,'docTermsAndConditionsFile',
  ];

  fileFields.forEach(field => {
    if (sharedData[field]) {
      console.log(`🔹 ${field}:`, sharedData[field].name);
      formData.append(field, sharedData[field]);
    }
  });

  // Append additional files if provided
  if (files && Array.isArray(files)) {
    files.forEach(file => {
      formData.append('docManagerSignatureFile', file);
    });
  }

  // Debugging: Print all FormData entries
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  // Send the request with 'multipart/form-data'
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};




export const deleteClient = async (id, name) => {
  await axios.delete(`${API_URL}/${id}`, {
    params: { performedBy: name },
  })
}
export const countNewUser = async () => {
  const response = await ancios.get(API_URL)
  return response.get
}

//Loan - financiamento

export const getDeterminatedDisbursed = async () => {
  const API_URL = 'http://192.168.2.125:8081/loans/determinated'
  try {
    const response = await axios.get(API_URL)

    return response.data
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    throw error
  }
}
export const getOnlyLoans = async () => {
  const API_URL = 'http://192.168.2.125:8081/loans/onlyloans'
  try {
    const response = await axios.get(API_URL)

    return response.data
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    throw error
  }
}
export const getDisburseLoan = async () => {
  const API_URL = 'http://192.168.2.125:8081/loans/pendingDisburse'
  try {
    const response = await axios.get(API_URL)

    return response.data
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    throw error
  }
}
export const getAllLoanDisbuseList = async () => {
  const API_URL = 'http://192.168.2.125:8081/loans/clonedloans'
  try {
    const response = await axios.get(API_URL)

    return response.data
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    throw error
  }
}

export const saveLoanDetails = async (loan, name) => {
  const API_URL = 'http://192.168.2.125:8081/loans'
  const response = await axios.post(API_URL, loan, {
    params: { performedBy: name },
  })
  return response.data
}

export const LoanList = async () => {
  const API_URL = 'http://192.168.2.125:8081/loan'
  const response = await axios.get(`${API_URL}`)
  return response.data
}

export const loanList = async (partialId) => {
  const API_URL = 'http://192.168.2.125:8081/loan/search'
  const response = await axios.get(`${API_URL}/${partialId}`)
  return response.data
}
export const searchLoanByName = async (name) => {
  const API_URL = 'http://192.168.2.125:8081/loan/clientName'
  const response = await axios.get(`${API_URL}`, {
    params: { name: name },
  })
  return response.data
}
export const loanList1 = async (partialName) => {
  const API_URL = 'http://192.168.2.125:8081/loan/searchName'
  const response = await axios.get(`${API_URL}/${partialName}`)
  return response.data
}
export const getAllLoans = async () => {
  const API_URL = 'http://192.168.2.125:8081/loan'
  const response = await axios.get(`${API_URL}`)
  console.log('oioio', response.data)
  return response.data
}
export const getAprovedLoans = async () => {
  const API_URL = 'http://192.168.2.125:8081/loans/approved'
  const response = await axios.get(`${API_URL}`)
  return response.data
}
export const getPendingLoans = async () => {
  const API_URL = 'http://192.168.2.125:8081/loans/pending'
  const response = await axios.get(`${API_URL}`)
  return response.data
}
export const getPaidLoans = async () => {
  const API_URL = 'http://192.168.2.125:8081/loans/paid'
  const response = await axios.get(`${API_URL}`)
  return response.data
}
export const getLiquidLoans = async () => {
  const API_URL = 'http://192.168.2.125:8081/loans/liquidated'
  const response = await axios.get(`${API_URL}`)
  return response.data
}
export const deleteLoanById = async (id, name) => {
  const API_URL = 'http://192.168.2.125:8081/loans'
  await axios.delete(`${API_URL}/${id}`, {
    params: { performedBy: name },
  })
}

export const getLoanById = async (id) => {
  const API_URL = 'http://192.168.2.125:8081/loans'
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const getLoansByClientId = async (formattedClientId) => {
  const API_URL = 'http://192.168.2.125:8081/loans/client'

  try {
    const response = await axios.get(`${API_URL}/${encodeURIComponent(formattedClientId)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching loans by client ID:', error)
    throw error
  }
}

export const updateLoanDetails = async (id, loans, name) => {
  const API_URL = 'http://192.168.2.125:8081/loans'

  try {
    const response = await axios.put(`${API_URL}/${id}`, loans, {
      params: { performedBy: name },
    })
    console.log(name)
    return response
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    throw error
  }
}
export const updateClient = async ( clients, id) => {
  const API_URL = 'http://192.168.2.125:8081/externalclient'

  try {
    const response = await axios.put(`${API_URL}/${id}`, clients)
    return response
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    throw error
  }
}
// User - Usuário
export const login = async (email, password) => {
  const API_URL = 'http://192.168.2.125:8081/login'

  const response = await axios.post(API_URL, { email, password })
  console.log(response)
  return response
}

export const save = async (user) => {
  const API_URL = 'http://192.168.2.125:8081/register'

  try {
    const response = await axios.post(API_URL, user)
    return response
  } catch (error) {
    throw error
  }
}
export const userList = async () => {
  const API_URL = 'http://192.168.2.125:8081/users'

  const response = await axios.get(`${API_URL}`)
  return response.data
}
export const deleteUser = async (id) => {
  const API_URL = 'http://192.168.2.125:8081/users'

  await axios.delete(`${API_URL}/${id}`)
}

export const update = async (id, users) => {
  const API_URL = 'http://192.168.2.125:8081/users'

  try {
    const response = await axios.put(`${API_URL}/${id}`, users)
    return response
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    throw error
  }
}

//Payment-pagamento

export const savePaymentDetails = async (payment) => {
  const API_URL = 'http://192.168.2.125:8081/payments'

  const response = await axios.post(`${API_URL}`, payment)
  return response.data
}
export const getAllPayment = async (params) => {
  const API_URL = 'http://192.168.2.125:8081/payments'
  try {
    const response = await axios.get(API_URL)

    //const response = await axios.get(API_URL, {
    //  params: {
    //    page: params.page,
    //    size: params.size,
    //  },
    //})
    return response.data
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    throw error
  }
}
export const paymentList = async () => {
  const API_URL = 'http://192.168.2.125:8081/payments'
  try {
    const response = await axios.get(API_URL)

    return response.data
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    throw error
  }
}

export const deletePaymentById = async (id) => {
  const API_URL = 'http://192.168.2.125:8081/Payments'

  await axios.delete(`${API_URL}/${id}`)
}

//Company - Empresa

export const companyList = async () => {
  const API_URL = 'http://192.168.2.125:8081/company'
  const response = await axios.get(`${API_URL}`)
  console.log(response)
  return response
}
export const companyApprovedList = async () => {
  const API_URL = 'http://192.168.2.125:8081/internal/company/approved'
  const response = await axios.get(`${API_URL}`)
  console.log(response)
  return response
}

export const companyPendingList = async () => {
  const API_URL = 'http://192.168.2.125:8081/company/pending'
  const response = await axios.get(`${API_URL}`)
  console.log(response)
  return response
}
export const saveCompanyDetails = async (payment, name) => {
  const API_URL = 'http://192.168.2.125:8081/company'

  const response = await axios.post(`${API_URL}`, payment, {
    params: { performedBy: name },
  })
  return response.data
}
export const updateCompanyDetails = async (id, payment, name) => {
  const API_URL = 'http://192.168.2.125:8081/company'
  console.log('olaolaolaolaolaolaolaola', payment)
  const response = await axios.put(`${API_URL}/${id}`, payment, {
    params: { performedBy: name },
  })
  return response.data
}

// ActionLog = logs de Acçao

export const getAllLogs = async () => {
  const API_URL = 'http://192.168.2.125:8081/api/logs'
  const response = await axios.post(`${API_URL}`)
  return response.data
}
export const getLogByEntityIDName = async (entityId, entityname) => {
  const API_URL = 'http://192.168.2.125:8081/api/logs'
  const response = await axios.get(`${API_URL}/${entityId}/${entityname}`)
  return response.data
}

// CLientes externos

export const getExternClients = async () => {
  const API_URL = 'http://192.168.2.125:8081/api/sync'
  const response = await axios.get(`${API_URL}`)
  return response.data
}
export const getExternDBDATA = async () => {
  const API_URL = 'http://192.168.2.125:8081/api/clients/sync'
  const response = await axios.get(`${API_URL}`)
  return response.data
}
export const getExternClientsById = async (id) => {
  const API_URL = 'http://192.168.2.125:8081/api/sync'
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}
export const readExternalClientById = async (id) => {
  const API_URL = 'http://192.168.2.125:8081/externalclient'
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}
export const createFromExternalClient = async (client, name) => {
  console.log('Dados do clientes: ', client)
  const API_URL = 'http://192.168.2.125:8081/externalclient/create'
  const response = await axios.post(API_URL, client
  //   , {
  //   params: { performedBy: name },
  // }
)
  console.log('---------: ', response.data)

  return response.data
}
export const getExternClientsByUserId = async (userid) => {
  const API_URL = 'http://192.168.2.125:8081/extern/clients'
  const response = await axios.get(`${API_URL}/${userid}`)
  return response.data
}
