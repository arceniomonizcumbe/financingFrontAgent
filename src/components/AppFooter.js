import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://www.maximo.co.mz" target="_blank" rel="noopener noreferrer">
          Maximo
        </a>
        <span className="ms-1">&copy; 2024 </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://www.maximo.co.mz" target="_blank" rel="noopener noreferrer">
          maximo group
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
