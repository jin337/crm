import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
// redux
import { Provider } from 'react-redux'
import { store } from './store'
// 路由
import { RouterProvider } from 'react-router'
import { router } from './router'
// 样式
import 'src/index.scss'
// 过渡效果
import { Loading } from 'src/components'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Suspense fallback={<Loading dot size={20} />}>
      <RouterProvider router={router} />
    </Suspense>
  </Provider>
)
