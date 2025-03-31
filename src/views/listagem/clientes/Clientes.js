import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CBadge,
  CModal,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CInputGroup,
  CFormInput,
  CPagination,
  CModalHeader,
  CPaginationItem,
} from '@coreui/react'
import { cilEthernet, cilPencil, cilFlipToFront, cilPlus } from '@coreui/icons'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CIcon from '@coreui/icons-react'
import {
  getPendingClient,
  ListClient,
  getExternClientsByUserId,
  deleteClient,
  getLogByEntityIDName,
  getClientSituation
} from '../../../axios_api/clientService'
import { useAuth } from '../../../AuthContext'

const Tables = () => {
  const [clientes, setClientes] = useState([])
  const [visible, setVisible] = useState(false)
  const [visibleb, setVisibleb] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    marital_status: '',
    gender: '',
    state: '',
    stateLoan: '',
  })
  const itemsPerPage = 8
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [file, setFile] = useState(null)
  const [log, setLog] = useState([])
  const { user } = useAuth()

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }
  useEffect(() => {
    const fetchClientes = async () => {
      if (!user?.id) return // Prevents execution if user is undefined or id is missing
  
      try {
                //const data = user?.role === 'ADMIN' ? await getPendingClient() : await ListClient()

        const data = await getExternClientsByUserId(user.id) // Use user.id correctly
  
        if (Array.isArray(data)) {
          setClientes(data)
        } else {
          console.error('Os dados recebidos não são um array:', data)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    }
  
    fetchClientes()
  }, [user?.id]) // Add dependency
  
  useEffect(() => {
    checkLoginUser()
  }, [])

  const checkLoginUser = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log('usuario', user)
    if (user) {
      setIsAdmin(user.role === 'ADMIN')
    }
  }

  const getBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success'
      case 'DECLINED':
        return 'danger'
      case 'PENDING':
        return 'warning'
      default:
        return 'primary'
    }
  }
  const fetchLogs = async (id) => {
    try {
      const response = await getLogByEntityIDName(id, 'Cliente')
      if (response) {
        setLog(response)
        setVisibleb(true)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const handleLogButtonClick = (id) => {
    fetchLogs(id)
  }

  const handleEdit = (id) => {
    navigate(`/listagem/cadastro/${id}`)
  }
  const handleNovoFinance = async (nuit) => {
    try {
      const response = await getClientSituation(nuit)
      if(response.data){
        const selectedLoan = null
        
        const associatedClient = response.data
        console.log(associatedClient)
        navigate('/listagem/financiamento/edit', {
          state: {  client: associatedClient },
        })
      
    }
    } catch (error) {
      if (error.response && error.response.data.message) {
          toast.warning(error.response.data.message);
      } else {
          toast.error("An unexpected error occurred.");
      }
  }
  
    
  }
  const handleImportClick = async () => {
    if (!file) return toast.warning('Por favor, selecione um arquivo primeiro.')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/import/excel', {
        method: 'POST',
        body: formData,
      })
      const message = await response.text()
      toast.success(message)
    } catch (error) {
      toast.error('Erro ao importar o arquivo.')
    }
  }

  // const handleDelete = async () => {
  //   if (selectedClientId !== null) {
  //     try {
  //       await deleteClient(selectedClientId, user.name)
  //       const novosClientes = clientes.filter((cliente) => cliente.id !== selectedClientId)
  //       setClientes(novosClientes)
  //       toast.success('Cliente eliminado com sucesso!')
  //     } catch (error) {
  //       toast.error('Erro ao eliminar o cliente. Tente novamente.')
  //       console.error('Erro ao eliminar cliente:', error)
  //     } finally {
  //       setVisible(false)
  //       setSelectedClientId(null)
  //     }
  //   }
  // }
  const handleFinancing = async ()=>{
    // if(selectedClientId!=null){
    //   try{
    //     awai
    //   }
    // }
  }
  const filteredClients = clientes.filter(
    (client) =>
      ((filters.gender === '' || client.gender === filters.gender) && (filters.name =='' || client.name === filters.name) &&
        (filters.state== '' || client.state == filters.state) && (filters.stateLoan == '' || client.stateLoan === filters.stateLoan)&&
        (client.name.toLowerCase().includes(searchTerm.toLowerCase()) || (client.id_Number.toLowerCase().includes(searchTerm.toLowerCase())) 
  )))
  

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }
  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(direction)
  }

  const sortedClientes = [...clientes].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (a[sortColumn] > b[sortColumn]) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })
  const clientsPerPage = 8

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage,
  )
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <ToastContainer />
              <CRow className="align-items-center">
                <CCol xs={6}>
                  <strong>Listagem de Clientes</strong>
                </CCol>
                {!isAdmin && (
                  <CCol xs={6} className="text-end">
                    <CButton
                      color="warning"
                      onClick={() => navigate('/listagem/cadastro')}
                      disabled={isAdmin}
                    >
                      <CIcon icon={cilPlus} className="me-2" />
                      Novo Cliente
                    </CButton>
                  </CCol>
                )}
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                <CCol md={4}>
                  <CFormSelect name="gender" value={filters.gender} onChange={handleFilterChange}>
                    <option value="">Selecione o Gênero</option>
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Feminino</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    name="state"
                    value={filters.state}
                    onChange={handleFilterChange}
                  >
                    <option value="">Selecione a Situação do Cliente</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DECLINED">DECLINED</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect name="stateLoan" value={filters.stateLoan} onChange={handleFilterChange}>
                    <option value="">Selecione a Situação do Financiamento</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DECLINED">DECLINED</option>
                    <option value="LIQUIDATED">LIQUIDATED</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12}>
                  <CInputGroup className="mb-3">
                    <CFormInput
                      placeholder="Pesquisar por nome,  email, NUIT ou número de documento"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <div className="table-responsive" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('id')}>
                        ID {sortColumn === 'id' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('name')}>
                        Nome {sortColumn === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('email')}>
                        Email {sortColumn === 'email' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('contact')}>
                        Telefone{' '}
                        {sortColumn === 'contact' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('gender')}>
                        Gênero{' '}
                        {sortColumn === 'contact' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('nuit')}>
                        NUIT {sortColumn === 'nuit' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('id_number')}>
                        Nr.Documento{' '}
                        {sortColumn === 'id-number' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('state')}>
                        Situação(C){' '}
                        {sortColumn === 'state' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" onClick={() => handleSort('state')}>
                        Situação(F){' '}
                        {sortColumn === 'state' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Ações</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {paginatedClients.map((cliente) => (
                      <CTableRow key={cliente.id}>
                        <CTableHeaderCell scope="row">{cliente.id}</CTableHeaderCell>
                        <CTableDataCell>{cliente.name}</CTableDataCell>
                        <CTableDataCell>{cliente.email}</CTableDataCell>
                        <CTableDataCell>{cliente.contact}</CTableDataCell>
                        <CTableDataCell>{cliente.gender}</CTableDataCell>
                        <CTableDataCell>{cliente.nuit}</CTableDataCell>
                        <CTableDataCell>{cliente.id_Number}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getBadge(cliente.state)}>{cliente.state}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getBadge(cliente.stateLoan)}>{cliente.stateLoan}</CBadge>
                        </CTableDataCell>
                       
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            className="ms-1"
                            onClick={() => handleEdit(cliente.id)}
                            // disabled={cliente.state=="PENDING" || cliente.loanState=="PENDING"}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                           {/*
                          <CButton
                            color="secondary"
                            className="ms-1"
                            onClick={() => handleLogButtonClick(cliente.id)}
                            >
                            <CIcon icon={cilFlipToFront} />
                          </CButton> */}
                          <CButton
                            color="info"
                            onClick={() => {
                              setVisible(true)
                              handleNovoFinance(cliente.nuit)
                            }}
                            className="ms-1"
                            // disabled={cliente.state === 'APPROVED'}
                          >
                            <CIcon icon={cilEthernet} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
              <CPagination align="center" aria-label="Page navigation example">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </CPaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próximo
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal visible={visibleb} onClose={() => setVisibleb(false)} size="lg">
        <CModalHeader>Detalhes do Histórico</CModalHeader>
        <CModalBody>
          <div style={{ overflowX: 'auto' }}>
            <CTable hover responsive style={{ minWidth: '800px' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Data</CTableHeaderCell>
                  <CTableHeaderCell>Comentários (Inputter)</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Comentários (Authorizer)</CTableHeaderCell>
                  <CTableHeaderCell>Nome</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {log.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        : 'N/A'}
                    </CTableDataCell>

                    <CTableDataCell>{item.inputterComment}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getBadge(item.estado)}>{item.estado}</CBadge>
                    </CTableDataCell>
                    
                    <CTableDataCell>{item.authorizerComment}</CTableDataCell>
                    <CTableDataCell>{item.performedBy}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleb(false)}>
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* <CModal visible={visible} alignment="center" onClose={() => setVisible(false)}>
        <CModalBody>
          Você tem certeza que deseja eliminar o cliente{' '}
          <strong>{clientes.find((cliente) => cliente.id === selectedClientId)?.name}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Confirmar
          </CButton>
        </CModalFooter>
      </CModal> */}
    </>
  )
}

export default Tables
