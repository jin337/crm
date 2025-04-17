import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

const Home = lazy(() => import('src/views/Home'))
const Login = lazy(() => import('src/views/login'))
const NotAuth = lazy(() => import('src/views/NotAuth'))

const Workplace = lazy(() => import('src/pages/demo'))
const Project = lazy(() => import('src/pages/demo'))
const Finance = lazy(() => import('src/pages/demo'))

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
const SystemApplication = lazy(() => import('src/pages/system/application'))
const SystemAppManage = lazy(() => import('src/pages/system/application/manage'))
const SystemAccount = lazy(() => import('src/pages/system/account'))
const SystemHrmOrg = lazy(() => import('src/pages/system/hrm/org'))
const SystemHrmMember = lazy(() => import('src/pages/system/hrm/member'))

// 角色权限
const AuthSetting = lazy(() => import('src/pages/system/auth/setting'))
const AuthProject = lazy(() => import('src/pages/system/auth/project'))
const AuthFinance = lazy(() => import('src/pages/system/auth/finance'))
const AuthOA = lazy(() => import('src/pages/system/auth/oa'))

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
        path: '/system/application',
        element: <SystemApplication />,
      },
      {
        path: '/system/app/manage/:id',
        element: <SystemAppManage />,
      },
      {
        path: '/system/account',
        element: <SystemAccount />,
      },
      {
        path: '/system/auth/setting',
        element: <AuthSetting />,
      },
      {
        path: '/system/auth/project',
        element: <AuthProject />,
      },
      {
        path: '/system/auth/finance',
        element: <AuthFinance />,
      },
      {
        path: '/system/auth/oa',
        element: <AuthOA />,
      },
      {
        path: '/system/hrm/org',
        element: <SystemHrmOrg />,
      },
      {
        path: '/system/hrm/member',
        element: <SystemHrmMember />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
