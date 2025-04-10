import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

const Home = lazy(() => import('src/views/Home'))
const Login = lazy(() => import('src/views/Login'))
const NotAuth = lazy(() => import('src/views/NotAuth'))

// 仪表盘
const Workplace = lazy(() => import('src/pages/workplace'))
// 工程管理
const Project = lazy(() => import('src/pages/project'))
// 财务管理
const Finance = lazy(() => import('src/pages/finance'))
// OA
const OA = lazy(() => import('src/pages/oa'))
// 用户信息
const Person = lazy(() => import('src/pages/person'))

// 系统管理
const SettingApplication = lazy(() => import('src/pages/setting/application'))
const SettingAccount = lazy(() => import('src/pages/setting/account'))
// 角色权限
const SettingAuthSetting = lazy(() => import('src/pages/setting/auth/setting'))
const SettingAuthProject = lazy(() => import('src/pages/setting/auth/project'))
const SettingAuthFinance = lazy(() => import('src/pages/setting/auth/finance'))
const SettingAuthOA = lazy(() => import('src/pages/setting/auth/oa'))

const SettingProject = lazy(() => import('src/pages/setting/project'))
const SettingFinance = lazy(() => import('src/pages/setting/finance'))
const SettingOA = lazy(() => import('src/pages/setting/oa'))

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
        path: '/workplace',
        element: <Workplace />,
      },
      // 个人信息
      {
        path: '/person',
        element: <Person />,
      },
      // 工程管理
      {
        path: '/project',
        element: <Project />,
      },
      // 财务管理
      {
        path: '/finance',
        element: <Finance />,
      },
      // OA
      {
        path: '/oa',
        element: <OA />,
      },
      {
        path: '/setting/application',
        element: <SettingApplication />,
      },
      {
        path: '/setting/account',
        element: <SettingAccount />,
      },
      {
        path: '/setting/auth/setting',
        element: <SettingAuthSetting />,
      },
      {
        path: '/setting/auth/project',
        element: <SettingAuthProject />,
      },
      {
        path: '/setting/auth/finance',
        element: <SettingAuthFinance />,
      },
      {
        path: '/setting/auth/oa',
        element: <SettingAuthOA />,
      },
      {
        path: '/setting/project',
        element: <SettingProject />,
      },
      {
        path: '/setting/finance',
        element: <SettingFinance />,
      },
      {
        path: '/setting/oa',
        element: <SettingOA />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
