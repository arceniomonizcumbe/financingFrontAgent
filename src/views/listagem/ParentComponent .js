import React, { useState } from 'react'
import ClientSelection from './Cadastro_financiamento/Cadastro financiamento'
import Validation from './Cadastro_financiamento/Cadastro financiamento'

const ParentComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    id_Number: '',
    marital_status: '',
    employer: '',
    nuit: '',
    id: '',
    nib: '',
    validationDate: '',
    issueDate: '',
    valorEmprestimo: '',
    insurance: '',
    paymentDate: '',
    taxaEsforco: 0,
    salary: 0,
  })

  return (
    <div>
      <ClientSelection setFormData={setFormData} />
      <Validation formData={formData} />
    </div>
  )
}

export default ParentComponent
