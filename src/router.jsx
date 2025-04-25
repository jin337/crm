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
const Auth = lazy(() => import('src/pages/system/auth'))

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
      // 应用管理
      {
        path: '/system/application',
        element: <SystemApplication />,
      },
      {
        path: '/system/app/manage/:id',
        element: <SystemAppManage />,
      },
      // 账号管理
      {
        path: '/system/account',
        element: <SystemAccount />,
      },
      // 角色权限
      {
        path: '/system/auth/:id',
        element: <Auth />,
      },
      // 人力资源管理
      {
        path: '/system/hrm/org',
        element: <SystemHrmOrg />,
      },
      {
        path: '/system/hrm/member',
        element: <SystemHrmMember />,
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
    ],
  },
]

export const router = createBrowserRouter(routes)
