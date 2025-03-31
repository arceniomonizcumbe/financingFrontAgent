import React, { useState, useEffect,useRef  } from 'react'
import { CCol, CRow, CWidgetStatsC } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilDollar } from '@coreui/icons'
import { ListClient, LoanList, paymentList, companyList,getExternClientsByUserId  } from '../../axios_api/clientService'
import { CChart } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { useAuth } from '../../AuthContext'

const Dashboard = () => {
  const [clients, setClients] = useState([])
  const [loans, setLoans] = useState([])
  const [payments, setPayments] = useState([])
  const [company, setCompany] = useState([])
  const {user} = useAuth()
  const chartRef = useRef(null)
  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chartInstance = chartRef.current
      if (chartInstance) {
        const { options } = chartInstance

        if (options.plugins?.legend?.labels) {
          options.plugins.legend.labels.color = getStyle('--cui-body-color')
        }

        if (options.scales?.x) {
          if (options.scales.x.grid) {
            options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          }
          if (options.scales.x.ticks) {
            options.scales.x.ticks.color = getStyle('--cui-body-color')
          }
        }

        if (options.scales?.y) {
          if (options.scales.y.grid) {
            options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          }
          if (options.scales.y.ticks) {
            options.scales.y.ticks.color = getStyle('--cui-body-color')
          }
        }

        chartInstance.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)

    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
    }
  }, [])

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
        fill: true,
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [50, 12, 28, 29, 7, 25, 12, 70, 60],
        fill: true,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        labels: {
          color: getStyle('--cui-body-color'),
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: getStyle('--cui-border-color-translucent'),
        },
        ticks: {
          color: getStyle('--cui-body-color'),
        },
        type: 'category',
      },
      y: {
        grid: {
          color: getStyle('--cui-border-color-translucent'),
        },
        ticks: {
          color: getStyle('--cui-body-color'),
        },
        beginAtZero: true,
      },
    },
  }

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
    if (!user?.id) return // Prevent execution if user.id is missing
  
    fetchData(() => getExternClientsByUserId(user.id), setClients, 'clients') 
  }, [user?.id]) // Depend on user.id, not function
  

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
            progress={{ value: 29 }}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4} xxl={3}>
          <CWidgetStatsC
            color="secondary"
            icon={<CIcon icon={cilPeople} height={30} />}
            value={totalLoans}
            title="Usuários"
            inverse
            progress={{ value: 0 }}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4} xxl={3}>
          <CWidgetStatsC
            color="warning"
            icon={<CIcon icon={cilPeople} height={30} />}
            value={totalLoans}
            title="Usuários (Admin)"
            inverse
            progress={{ value: 0 }}
          />
        </CCol>
      </CRow>
      <CChart type="line" data={data} options={options} ref={chartRef} />
    </>
  )
}

export default Dashboard
