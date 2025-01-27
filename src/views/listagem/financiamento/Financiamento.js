import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cilTrash, cilLowVision } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCollapse,
  CTable,
  CTableBody,
  CFormSelect,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CInputGroup,
  CModal,
  CNav,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CBadge,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toastify'
import { deleteLoanById, LoanList, getAllLoans } from '../../../axios_api/clientService'
import { cilPlus } from '@coreui/icons'
import { CTabs, CTab, CTabList, CTabContent, CTabPanel } from '@coreui/react'
import { useAuth } from '../../../AuthContext'
const Tables = () => {
  const [loan, setLoan] = useState([])
  const [clients, setClients] = useState([])

  const [visible, setVisible] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [filters, setFilters] = useState({ role: '', plan: '', foureyes: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const getColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'AUTHORIZED':
        return 'success'
      case 'DECLINED':
        return 'danger'
      default:
        return 'primary'
    }
  }
  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const data = await getAllLoans()
        console.log(data)
        if (Array.isArray(data)) {
          setLoan(data)
          console.log('valor de toda classe ', data)
        } else {
          console.error('Os dados recebidos não são um array:', data)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    }

    fetchLoan()
  }, [])
  useEffect(() => {
    checkLoginUser()
  }, [])
  const checkLoginUser = () => {
    console.log('tonight', user)
    if (user) {
      setIsAdmin(user.role === 'ADMIN')
    }
  }
  const filteredLoans = loan.filter(
    (loan) =>
      (filters.role === '' || loan.role === filters.role) &&
      (filters.plan === '' || loan.plan === filters.plan) &&
      (filters.marital_status === '' || loan.marital_status === filters.marital_status) &&
      (filters.foureyes === '' || loan.foureyes === filters.foureyes) &&
      loan.client.name &&
      loan.client.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }
  const handleDelete = async () => {
    if (selectedClientId !== null) {
      try {
        await deleteLoanById(selectedClientId)
        const novosClientes = clientes.filter((cliente) => cliente.id !== selectedClientId)
        setLoan(novosClientes)
        toast.success('Cliente eliminado com sucesso!')
      } catch (error) {
        toast.error('Erro ao eliminar o cliente. Tente novamente.')
        console.error('Erro ao eliminar cliente:', error)
      } finally {
        setVisible(false)
        setSelectedClientId(null)
      }
    }
  }
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage)
  const currentItems = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleEdit = (id) => {
    const selectedLoan = loan.find((l) => l.id === id)
    const associatedClient = clients.find((client) => client.id === selectedLoan.clientId)

    navigate('/listagem/financiamento/edit', {
      state: { loan: selectedLoan, client: associatedClient },
    })
  }
  const [visibleRows, setVisibleRows] = useState({})

  const toggleRow = (id) => {
    setVisibleRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Sample data for the table
  const data = [
    { id: 1, name: 'John Doe', status: 'Active', details: 'More details about John Doe...' , loanAmount:"5000,00"},
  ]

  return (
    <>
                <CRow>
                  <CCol xs={12}>
                    <CCard className="mb-4">
                      <CCardHeader>
                        <CRow className="align-items-center">
                          <CCol xs={6}>
                            <strong>Listagem de Financiamento</strong>
                          </CCol>
                            <CCol xs={6} className="text-end">
                              <CButton
                                color="warning"
                                onClick={() => navigate('/listagem/financiamento/cadastro')}
                              >
                                <CIcon icon={cilPlus} className="me-2" />
                                Novo Financiamento
                              </CButton>
                            </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <CRow className="mb-4">
                          <CCol md={4}>
                            <CFormSelect
                              name="role"
                              value={filters.role}
                              onChange={handleFilterChange}
                            >
                              <option value="">Selecione a Função</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="USER">USER</option>
                            </CFormSelect>
                          </CCol>
                          <CCol md={4}>
                            <CFormSelect
                              name="marital_status"
                              value={filters.marital_status}
                              onChange={handleFilterChange}
                            >
                              <option value="">Selecione a Profissão</option>
                              <option value="SINGLE">Solteiro</option>
                              <option value="MARRIED">Casado</option>
                              <option value="DIVORCED">Divorciado</option>
                              <option value="WIDOWED">VIÚVO</option>
                            </CFormSelect>
                          </CCol>
                          <CCol md={4}>
                            <CFormSelect
                              name="foureyes"
                              value={filters.foureyes}
                              onChange={handleFilterChange}
                            >
                              <option value="">Selecione o Estado</option>
                              <option value="AUTHORIZED">AUTHORIZED</option>
                              <option value="PENDING">PENDING</option>
                              <option value="DECLINED">DECLINED</option>
                            </CFormSelect>
                          </CCol>
                        </CRow>

                        <CInputGroup className="mb-3">
                          <CFormInput
                            placeholder="Pesquisar pelo nome"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </CInputGroup>
                        <div className="table-responsive">
                          <CTable hover>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Profissão</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Salário</CTableHeaderCell>
                                <CTableHeaderCell scope="col">marital_status</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Data de Pagamento</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Situação</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Ações</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {currentItems.map((loan) => (
                                <CTableRow key={loan.id}>
                                  <CTableHeaderCell scope="row">{loan.id}</CTableHeaderCell>
                                  <CTableDataCell>{loan.client.name}</CTableDataCell>
                                  <CTableDataCell>{loan.client.profession}</CTableDataCell>
                                  <CTableDataCell>{loan.client.salary}</CTableDataCell>
                                  <CTableDataCell>{loan.client.marital_status}</CTableDataCell>
                                  <CTableDataCell>
                                    {loan.paymentDate
                                      ? new Date(loan.paymentDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                        })
                                      : 'N/A'}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge color={getColor(loan.foureyes)}>{loan.foureyes}</CBadge>
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CButton
                                      color="info"
                                      onClick={() => handleEdit(loan.id)}
                                      className="ms-2"
                                    >
                                      <CIcon icon={cilLowVision} />
                                    </CButton>
                                    <CButton
                                      color="danger"
                                      onClick={() => {
                                        setVisible(true)
                                        setSelectedClientId(loan.id)
                                      }}
                                      className="ms-2"
                                      disabled={loan.foureyes === 'AUTHORIZED'}
                                    >
                                      <CIcon icon={cilTrash} />
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

                <CModal visible={visible} alignment="center" onClose={() => setVisible(false)}>
                  <CModalBody>
                    <p>Você tem certeza que deseja eliminar este cliente?</p>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                      Cancelar
                    </CButton>
                    <CButton color="danger" onClick={handleDelete}>
                      Confirmar
                    </CButton>
                  </CModalFooter>
                </CModal>              
    </>
  )
}

export default Tables
