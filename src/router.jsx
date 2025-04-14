import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

const Home = lazy(() => import('src/views/Home'))
const Login = lazy(() => import('src/views/login'))
const NotAuth = lazy(() => import('src/views/NotAuth'))

// 仪表盘
const Workplace = lazy(() => import('src/pages/workplace'))
// 工程管理
const Project = lazy(() => import('src/pages/project'))
// 财务管理
const Finance = lazy(() => import('src/pages/finance'))
// 人力资源
const HrmOrg = lazy(() => import('hrmApp/org'))
const HrmMember = lazy(() => import('hrmApp/member'))
// OA
const OAapply = lazy(() => import('oaApp/apply'))
const OAtodo = lazy(() => import('oaApp/todo'))
const OAtrace = lazy(() => import('oaApp/trace'))
const OAarchive = lazy(() => import('oaApp/archive'))
const OAdraft = lazy(() => import('oaApp/draft'))
const OAall = lazy(() => import('oaApp/all'))
// 用户信息
const Person = lazy(() => import('src/pages/person/index'))

// 系统管理
const SettingApplication = lazy(() => import('src/pages/setting/application'))
const SettingAccount = lazy(() => import('src/pages/setting/account'))
const SettingProject = lazy(() => import('src/pages/setting/project'))
const SettingFinance = lazy(() => import('src/pages/setting/finance'))
const SettingOA = lazy(() => import('src/pages/setting/oa'))
const SettingHrm = lazy(() => import('src/pages/setting/hrm'))
const SettingMenu = lazy(() => import('src/pages/setting/menu'))

// 角色权限
const SettingAuthSetting = lazy(() => import('src/pages/setting/auth/setting'))
const SettingAuthProject = lazy(() => import('src/pages/setting/auth/project'))
const SettingAuthFinance = lazy(() => import('src/pages/setting/auth/finance'))
const SettingAuthOA = lazy(() => import('src/pages/setting/auth/oa'))
const SettingAuthHrm = lazy(() => import('src/pages/setting/auth/hrm'))

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
        path: '/oa/apply',
        element: <OAapply />,
      },
      {
        path: '/oa/todo',
        element: <OAtodo />,
      },
      {
        path: '/oa/trace',
        element: <OAtrace />,
      },
      {
        path: '/oa/archive',
        element: <OAarchive />,
      },
      {
        path: '/oa/draft',
        element: <OAdraft />,
      },
      {
        path: '/oa/all',
        element: <OAall />,
      },
      // 人力资源
      {
        path: '/hrm/org',
        element: <HrmOrg />,
      },
      {
        path: '/hrm/member',
        element: <HrmMember />,
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
        path: '/setting/auth/hrm',
        element: <SettingAuthHrm />,
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
      {
        path: '/setting/hrm',
        element: <SettingHrm />,
      },
      {
        path: '/setting/menu',
        element: <SettingMenu />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
