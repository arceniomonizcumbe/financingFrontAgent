import React, { useState, useEffect } from 'react'
import { CCol, CRow, CWidgetStatsC } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilDollar } from '@coreui/icons'
import { ListClient, LoanList, paymentList, companyList } from '../../axios_api/clientService'

const Dashboard = () => {
  const [clients, setClients] = useState([])
  const [loans, setLoans] = useState([])
  const [payments, setPayments] = useState([])
  const [company, setCompany] = useState([])

  const fetchData = async (fetchFn, setState, errorMsg) => {
    try {
      const data = await fetchFn()
      if (data) {
        setState(data)
      } else {
        console.error(`Invalid data for ${errorMsg}:`, data)
      }
    } catch (error) {
      console.error(`Error fetching ${errorMsg}:`, error)
    }
  }

  useEffect(() => {
    fetchData(ListClient, setClients, 'clients')
    fetchData(paymentList, setPayments, 'payments')
    fetchData(companyList, (data) => setCompany(data.data || []), 'company')

    const fetchLoans = async () => {
      try {
        const data = await LoanList()
        if (Array.isArray(data)) {
          setLoans(data)
        } else {
          console.error('Invalid loans data:', data)
        }
      } catch (error) {
        console.error('Error fetching loans:', error)
      }
    }

    fetchLoans()
  }, [])

  const totalClients = clients.length
  const totalLoans = loans.length

  return (
    <>
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={4} xxl={3}>
          <CWidgetStatsC
            color="info"
            icon={<CIcon icon={cilPeople} height={30} />}
            value={totalClients}
            title="Clientes"
            inverse
            progress={{ value: 75 }}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4} xxl={3}>
          <CWidgetStatsC
            color="primary"
            icon={<CIcon icon={cilDollar} height={30} />}
            value={totalLoans}
            title="Financiamento"
            inverse
            progress={{ value: 99 }}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
