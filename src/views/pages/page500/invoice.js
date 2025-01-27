import React from 'react'
import { Typography, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'

const Invoice = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <Typography variant="h6">Materialize</Typography>
    <Typography>Office 149, 450 South Brand Brooklyn</Typography>
    <Typography>San Diego County, CA 91905, USA</Typography>
    <Typography>+1 (123) 456 7891, +44 (876) 543 2198</Typography>

    <Typography variant="h6" style={{ marginTop: 20 }}>
      Invoice #4987
    </Typography>
    <Typography>Date Issued: 13 Nov 2024</Typography>
    <Typography>Date Due: 23 Nov 2024</Typography>

    <Typography variant="h6" style={{ marginTop: 20 }}>
      Invoice To:
    </Typography>
    <Typography>Jordan Stevenson</Typography>
    <Typography>Hall-Robbins PLC</Typography>
    <Typography>7777 Mendez Plains</Typography>
    <Typography>(616) 865-4180</Typography>
    <Typography>don85@johnson.com</Typography>

    <Typography variant="h6" style={{ marginTop: 20 }}>
      Bill To:
    </Typography>
    <Typography>Total Due: $12,110.55</Typography>
    <Typography>Bank name: American Bank</Typography>
    <Typography>Country: United States</Typography>
    <Typography>IBAN: ETD95476213874685</Typography>
    <Typography>SWIFT code: BR91905</Typography>

    <TableContainer style={{ marginTop: 20 }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>ITEM</TableCell>
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>HOURS</TableCell>
            <TableCell>QTY</TableCell>
            <TableCell>TOTAL</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Premium Branding Package</TableCell>
            <TableCell>Branding & Promotion</TableCell>
            <TableCell>48</TableCell>
            <TableCell>1</TableCell>
            <TableCell>$32</TableCell>
          </TableRow>
          {/* Adicione mais linhas conforme necessário */}
        </TableBody>
      </Table>
    </TableContainer>

    <Typography style={{ marginTop: 20 }}>Subtotal: $1800</Typography>
    <Typography>Discount: $28</Typography>
    <Typography>Tax: 21%</Typography>
    <Typography>Total: $1690</Typography>

    <Typography style={{ marginTop: 20, fontSize: 12 }}>
      Note: It was a pleasure working with you and your team. We hope you will keep us in mind for
      future freelance projects. Thank You!
    </Typography>
  </div>
))

export default Invoice
