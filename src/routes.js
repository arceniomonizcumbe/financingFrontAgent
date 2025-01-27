import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//Listagem
const Colors = React.lazy(() => import('./views/listagem/clientes/Clientes'))
const Cadastro = React.lazy(() => import('./views/listagem/cadastro/Cadastro.js'))
const Financiamento = React.lazy(() => import('./views/listagem/financiamento/Financiamento'))
const Simulador = React.lazy(() => import('./views/listagem/simulator/Simulador.js'))
const Cadastro_financiamento = React.lazy(()=> import ('./views/listagem/Cadastro_financiamento/Cadastro financiamento.js'))
const Edit_financiamento = React.lazy(()=> import('./views/listagem/financiamento_editar/Financiamento_editar.js'))

//rotas da listagem
const routes = [
  { path: '/', exact: true, name: 'Página Inicial' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/listagem', name: 'Listagem', element: Colors, exact: true },
  { path: '/listagem/clientes', name: 'Clientes', element: Colors },
  { path: '/listagem/cadastro', name: 'Cadastro', element: Cadastro },
  { path: '/listagem/cadastro/:id', name: 'Cadastro', element: Cadastro },
  { path: '/listagem/financiamento', name: 'Financiamento', element: Financiamento },
  { path: '/listagem/simulador', name: 'Simulador', element: Simulador },
  { path: '/listagem/financiamento/cadastro', name: 'Cadastro_financiamento', element: Cadastro_financiamento},
  {path: '/listagem/financiamento/edit', name: 'Edit_financiamento', element: Edit_financiamento}
]

export default routes
