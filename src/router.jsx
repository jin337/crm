import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

const routes = [
  {
    path: '/*',
    Component: lazy(() => import('src/views/NotAuth')),
  },
  {
    path: '/login',
    Component: lazy(() => import('src/views/login')),
  },
  {
    path: '/',
    Component: lazy(() => import('src/views/Home')),
    children: [
      {
        path: '/workplace',
        Component: lazy(() => import('src/pages/demo')),
      },
      // 工程管理
      {
        path: '/project',
        Component: lazy(() => import('src/pages/demo')),
      },
      // 财务管理
      {
        path: '/finance',
        Component: lazy(() => import('src/pages/demo')),
      },
      // 个人信息
      {
        path: '/person',
        Component: lazy(() => import('src/pages/person/index')),
      },
      // 应用管理
      {
        path: '/system/application',
        Component: lazy(() => import('src/pages/system/application')),
      },
      {
        path: '/system/app/manage/:id',
        Component: lazy(() => import('src/pages/system/application/manage')),
      },
      // 账号管理
      {
        path: '/system/account',
        Component: lazy(() => import('src/pages/system/account')),
      },
      // 角色权限
      {
        path: '/system/auth/:id',
        Component: lazy(() => import('src/pages/system/auth')),
      },
      // 人力资源管理
      {
        path: '/system/hrm/org',
        Component: lazy(() => import('src/pages/system/hrm/org')),
      },
      {
        path: '/system/hrm/member',
        Component: lazy(() => import('src/pages/system/hrm/member')),
      },
      // OA
      {
        path: '/oa/apply',
        Component: lazy(() => import('oaApp/apply')),
      },
      {
        path: '/oa/todo',
        Component: lazy(() => import('oaApp/todo')),
      },
      {
        path: '/oa/trace',
        Component: lazy(() => import('oaApp/trace')),
      },
      {
        path: '/oa/archive',
        Component: lazy(() => import('oaApp/archive')),
      },
      {
        path: '/oa/draft',
        Component: lazy(() => import('oaApp/draft')),
      },
      {
        path: '/oa/all',
        Component: lazy(() => import('oaApp/all')),
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
