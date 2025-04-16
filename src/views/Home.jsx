import { Drawer, Layout } from '@arco-design/web-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router'

// 组件
import { MenuCustom } from 'src/components'

import { getMenu, getMenuSelect, getSystemMenu, setUserInfo } from 'src/store/reducers/common'
// 公共方法
import { findRootNode, flattenArray, localGetItem } from 'src/utils/common'
// hooks
import { useColorTheme } from 'src/hooks'

// 接口
import Http from 'src/service/api'

const Home = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const updateTheme = useColorTheme()
  const { initMenuData, systemMenuData, menuSelect, logo, title, userInfo } = useSelector((state) => state.common)

  const [menuData, setMenuData] = useState(initMenuData)
  const [rightMenuData, setRightMenu] = useState(systemMenuData)
  const [headerSelect, setHeaderSelect] = useState()

  const [newsVisible, setNewsVisible] = useState(false)

  // 判断登录权限
  useEffect(() => {
    const user = localGetItem('AUTHTOKEN')
    if (user) {
      dispatch(setUserInfo(user))
      updateTheme(user?.theme) //获取主题
      // 获取导航数据
      if (initMenuData.length === 0) {
        createMenu()
      } else {
        let item = flattenArray(initMenuData)?.find((item) => item.path === location.pathname)
        item && createSelect(initMenuData, systemMenuData, item.permission)
      }
    } else {
      onSelectSystem('exit')
    }
  }, [location])

  // 默认进入页面
  useEffect(() => {
    const path = location.pathname
    if (path === '/') {
      onSelectMenu(menuData[0])
    }
  }, [location, menuData])

  // 获取导航数据
  const createMenu = async () => {
    const { code, data } = await Http.get('/mock/menu.json')
    if (code === 200) {
      const left = data.left || []
      setMenuData(left)
      dispatch(getMenu(left))

      const right = data.right || []
      setRightMenu(right)
      dispatch(getSystemMenu(right))
      // 重新选中导航
      if (!menuSelect) {
        const key = location?.state?.permission
        if (key) {
          createSelect(left, right, key)
        } else {
          let item = flattenArray(left)?.find((item) => item.path === location.pathname)
          item && createSelect(left, right, item.permission)
        }
      }
    }
  }
  // 重新选中导航
  const createSelect = (left, right, key) => {
    const leftItem = flattenArray(left)?.find((e) => e.permission === key)
    if (leftItem) {
      dispatch(getMenuSelect(leftItem))
      const parent = findRootNode(left, leftItem.id)
      if (parent?.length > 0) {
        setHeaderSelect(parent[0])
      }
    }

    const rightItem = flattenArray(right)?.find((e) => e.permission === key)
    if (rightItem) {
      dispatch(getMenuSelect(rightItem))
      const parent = findRootNode(right, rightItem.id)
      if (parent?.length > 0) {
        setHeaderSelect(parent[0])
      }
    }
  }
  // 导航选择
  const onSelectMenu = (item) => {
    if (item?.type === 2 && item?.path) {
      dispatch(getMenuSelect(item))
      navigate(item.path, { state: item })
    }
    if ([0, '0'].includes(item?.pid)) {
      setHeaderSelect(item)
      const children = item?.children?.filter((e) => e.is_hide !== 1)
      if (children) {
        const findType2 = (items) => {
          for (let child of items) {
            if (child.type === 2) {
              onSelectMenu(child)
              return true
            }
            if (child.children && findType2(child.children)) {
              return true
            }
          }
          return false
        }
        findType2(children)
      }
    }
  }
  // 系统功能
  const onSelectSystem = (type, obj) => {
    // 退出
    if (type === 'exit') {
      sessionStorage.clear()
      localStorage.removeItem('TOKEN')
      navigate('/login') // 跳转登录页
    }
    // 切换主题
    if (type === 'theme') {
      updateTheme(obj)
    }
    // 切换主题
    if (type === 'notification') {
      setNewsVisible(true)
    }
    // 个人信息
    if (type === 'person') {
      setHeaderSelect()
      dispatch(getMenuSelect(null))
      navigate('/person')
    }
  }

  return (
    <Layout className='h-screen w-screen'>
      <MenuCustom.Header
        leftIitems={menuData}
        rightIitems={rightMenuData}
        select={headerSelect}
        logo={logo}
        title={title}
        userInfo={userInfo}
        onSelectMenu={onSelectMenu}
        onSelectSystem={onSelectSystem}
      />

      <Layout className='overflow-hidden' hasSider>
        {headerSelect?.type === 1 && (
          <MenuCustom.Sider items={headerSelect?.children} select={menuSelect} onSelectMenu={onSelectMenu} />
        )}
        <Layout.Content>
          <div className='page-title'>{menuSelect?.title}</div>
          <div className='relative mb-3 h-[calc(100%-72px)] overflow-y-auto px-6'>
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>

      <Drawer
        width={'50%'}
        title={'消息通知'}
        footer={null}
        visible={newsVisible}
        onOk={() => setNewsVisible(false)}
        onCancel={() => setNewsVisible(false)}>
        <div>消息通知</div>
      </Drawer>
    </Layout>
  )
}
export default Home
