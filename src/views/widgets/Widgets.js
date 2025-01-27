import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CCollapse,
  CCard,
  CCardBody,
} from '@coreui/react'

const CollapsibleRowTable = () => {
  const [visibleRows, setVisibleRows] = useState({})

  const toggleRow = (id) => {
    setVisibleRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Sample data for the table
  const data = [
    { id: 1, name: 'John Doe', status: 'Active', details: 'More details about John Doe...' },
    { id: 2, name: 'Jane Smith', status: 'Inactive', details: 'More details about Jane Smith...' },
    {
      id: 3,
      name: 'Mike Johnson',
      status: 'Pending',
      details: 'More details about Mike Johnson...',
    },
  ]

  return (
    <CTable hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>ID</CTableHeaderCell>
          <CTableHeaderCell>Name</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Action</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {data.map((row) => (
          <React.Fragment key={row.id}>
            <CTableRow>
              <CTableDataCell>{row.id}</CTableDataCell>
              <CTableDataCell>{row.name}</CTableDataCell>
              <CTableDataCell>{row.status}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => toggleRow(row.id)}
                >
                  {visibleRows[row.id] ? 'Hide' : 'Show'}
                </CButton>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell colSpan="4" className="p-0">
                <CCollapse visible={visibleRows[row.id]}>
                  <CCard className="m-0">
                    <CCardBody className="p-3">
                      <h4>{row.name}</h4>
                      <p className="text-body-secondary">User since: </p>
                      <CButton size="sm" color="info">
                        Pagar
                      </CButton>
                      <CButton size="sm" color="danger" className="ms-1">
                        Rejeitar
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCollapse>
              </CTableDataCell>
            </CTableRow>
          </React.Fragment>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default CollapsibleRowTable
