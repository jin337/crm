import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

const Demo = lazy(() => import('src/pages/demo'))

const Home = lazy(() => import('src/views/Home'))
const Login = lazy(() => import('src/views/Login'))
const NotAuth = lazy(() => import('src/views/NotAuth'))

const routes = [
  {
    path: '/*',
    element: <NotAuth />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/demo',
        element: <Demo />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
