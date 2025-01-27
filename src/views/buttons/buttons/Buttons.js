import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CFormCheck,
  CFormSelect,
  CInputGroup,
  CFormInput,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CForm,
  CFormFeedback,
} from '@coreui/react'
import {
  cilTrash,
  cilLockLocked,
  cilLockUnlocked,
  cilPencil,
  cilPlus,
  cilWarning,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { userList, save, deleteUser, update } from '../../../axios_api/clientService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Usuarios = () => {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [filters, setFilters] = useState({ role: '', plan: '', status: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [visible, setVisible] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    password1: '',
    role: '',
  })
  const [validated, setValidated] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'password' || name === 'password1') {
      const password = name === 'password' ? value : formData.password
      const password1 = name === 'password1' ? value : formData.password1

      if (password.length < 5) {
        setPasswordError('A senha deve ter pelo menos 5 caracteres.')
      } else if (password && password1 && password !== password1) {
        setPasswordError('As senhas devem ser iguais.')
      } else {
        setPasswordError('')
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false || passwordError) {
      event.stopPropagation()
    } else {
      const emailExists = users.some(
        (user) => user.email === formData.email && user.id !== selectedUserId,
      )
      if (emailExists) {
        toast.error('Este e-mail já está em uso!')
        return
      }
      try {
        let response
        if (selectedUserId) {
          console.log('antes do envio', formData)
          response = await update(selectedUserId, formData)
          toast.success('Usuário atualizado com sucesso!')
        } else {
          response = await save(formData)
          toast.success('Usuário criado com sucesso!')
        }
        console.log('Form submitted successfully:', response)

        if (response) {
          setShowModal(false)
          setFormData({
            name: '',
            email: '',
            age: '',
            password: '',
            password1: '',
            role: '',
          });
          await fetchUsers(); 

          setSelectedUserId(null)
        } else {
          toast.error('Falha na submissão!')
        }
      } catch (error) {
        toast.error('Ocorreu um erro durante a submissão')
        console.error('Error occurred during submission:', error)
      }
    }
    setValidated(true)
  }
  const fetchUsers = async () => {
    try {
      const usersData = await userList();
      setUsers(usersData); 
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os usuários.');
      console.error('Error fetching users:', error);
    }
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userList()
        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          console.error('Received data is not an array:', data)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleCheckboxChange = (email) => {
    setSelectedUsers((prev) =>
      prev.includes(email) ? prev.filter((user) => user !== email) : [...prev, email],
    )
  }
  const handleDelete = async () => {
    if (selectedUserId !== null) {
      const userToDelete = users.find(user => user.id === selectedUserId);

    if (userToDelete && userToDelete.role === 'ADMIN') {
      toast.warning('Usuários com a função "ADMIN" não podem ser deletados.');
      return; 
    }

      try {
        await deleteUser(selectedUserId)
        setUsers(users.filter((user) => user.id !== selectedUserId))
        toast.success('Usuário foi deletado!')
      } catch (error) {
        toast.error('Erro ao deletar usuário. Tente novamente.')
        console.error('Error:', error)
      } finally {
        setVisible(false)
        setSelectedUserId(null)
      }
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }
  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id)
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      age: userToEdit.age,
      role: userToEdit.role,
      password: '', // Password fields are cleared for security
      password1: '',
    })
    setSelectedUserId(id)
    setShowModal(true)
  }
  const filteredUsers = users.filter(
    (user) =>
      (filters.role === '' || user.role === filters.role) &&
      (filters.plan === '' || user.plan === filters.plan) &&
      (filters.status === '' || user.status === filters.status) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())), // Verifica nome ou email
  )

  const usersPerPage = 10
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  )

  const toggleModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <ToastContainer />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow className="align-items-center">
                <CCol xs={6}>
                  <strong>Listagem de Usuários</strong>
                </CCol>
                <CCol xs={6} className="text-end">
                  <CButton color="warning" onClick={() => setShowModal(true)}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Novo Usuário
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {/* Filter Section */}
              <CRow className="mb-4">
                <CCol md={4}>
                  <CFormSelect name="role" value={filters.role} onChange={handleFilterChange}>
                    <option value="">Selecione a Função</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect name="plan" value={filters.plan} onChange={handleFilterChange}>
                    <option value="">Selecione a Profissão</option>
                    <option>Desenvolvedor de Software</option>
                    <option>Analista de Software</option>
                    <option>Analista de Projetos</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">Selecione o estado</option>
                    <option value="Active">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Pending">Pendente</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Pesquisar usuário"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      <CFormCheck />
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Função</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Profissão</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Acção</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedUsers.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <CFormCheck
                          checked={selectedUsers.includes(user.email)}
                          onChange={() => handleCheckboxChange(user.email)}
                        />
                      </CTableDataCell>
                      <CTableDataCell>{user.name}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.role}</CTableDataCell>
                      <CTableDataCell>{user.plan}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={user.status === 'Active' ? 'success' : 'warning'}>
                          {user.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          onClick={() => handleEdit(user.id)}
                          color="primary"
                          className="me-2"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          onClick={() => {
                            setVisible(true)
                            setSelectedUserId(user.id)
                          }}
                          color="danger"
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <CPagination className="justify-content-center">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Anterior
                </CPaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <CPaginationItem
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Próximo
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>

        <CModal visible={showModal} onClose={toggleModal}>
          <CModalHeader closeButton>Novo Usuário</CModalHeader>
          <CModalBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <CRow>
                <CCol md={12} className="mb-3">
                  <CFormInput
                    type="text"
                    name="name"
                    label="Nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <CFormFeedback invalid>Por favor, insira o nome.</CFormFeedback>
                </CCol>
                <CCol md={12} className="mb-3">
                  <CFormInput
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <CFormFeedback invalid>Por favor, insira um email válido.</CFormFeedback>
                </CCol>
                <CCol md={12} className="mb-3">
                  <CFormSelect
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Selecione a função"
                    required
                  >
                    <option value="USER">Usuário</option>
                    <option value="ADMIN">Administrador</option>
                  </CFormSelect>
                </CCol>

                <CInputGroup className="mb-2" style={{ cursor: 'pointer' }}>
                  <CFormInput
                    name="password"
                    value={formData.password}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    onChange={handleChange}
                  />{' '}
                  <CButton
                    onClick={togglePasswordVisibility}
                    type="button"
                    color="secondary"
                    variant="outline"
                    id="button-addon1"
                  >
                    <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} />
                  </CButton>
                </CInputGroup>
                <CInputGroup className="mb-2" style={{ cursor: 'pointer' }}>
                  <CFormInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmar Senha"
                    value={formData.password1}
                    onChange={handleChange}
                    name="password1"
                  />
                  <CButton
                    onClick={toggleConfirmPasswordVisibility}
                    type="button"
                    color="secondary"
                    variant="outline"
                    id="button-addon2"
                  >
                    <CIcon icon={showConfirmPassword ? cilLockUnlocked : cilLockLocked} />
                  </CButton>
                </CInputGroup>
                {passwordError && (
                  <small className="text-danger mb-2" style={{ display: 'block' }}>
                    {passwordError}
                  </small>
                )}
              </CRow>
              <CModalFooter>
                <CButton color="secondary" onClick={toggleModal}>
                  Cancelar
                </CButton>
                <CButton type="submit" color="primary">
                  Salvar
                </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>

        <CModal visible={visible} alignment="center" onClose={() => setVisible(false)}>
          <CModalHeader></CModalHeader>
          <CModalBody>
            Você tem certeza que deseja eliminar o cliente{' '}
            <strong>{users.find((user) => user.id === selectedUserId)?.name}</strong>?
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
      </CRow>
    </>
  )
}

export default Usuarios
