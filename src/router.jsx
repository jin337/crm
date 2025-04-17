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
const SettingAppManage = lazy(() => import('src/pages/setting/application/manage'))
const SettingAccount = lazy(() => import('src/pages/setting/account'))
const SettingHrmOrg = lazy(() => import('src/pages/setting/hrm/org'))
const SettingHrmMember = lazy(() => import('src/pages/setting/hrm/member'))

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
      {
        path: '/setting/application',
        element: <SettingApplication />,
      },
      {
        path: '/setting/app/manage/:id',
        element: <SettingAppManage />,
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
        path: '/setting/hrm/org',
        element: <SettingHrmOrg />,
      },
      {
        path: '/setting/hrm/member',
        element: <SettingHrmMember />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
