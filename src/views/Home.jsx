import { Drawer, Layout, Message } from '@arco-design/web-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router'

// 组件
import { Loading, MenuCustom } from 'src/components'

import { setDepts, setMenu, setMenuSelect, setSystemMenu, setTheme, setUserInfo } from 'src/store/common'
// 公共方法
import { findRootNode, flattenArray, localGetItem, localSetItem } from 'src/utils/common'

const Home = () => {
  const refContent = useRef()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const updateTheme = Hooks.useColorTheme()
  const { initMenuData, systemMenuData, menuSelect, logo, title, userInfo, depts, theme } = useSelector((state) => state.common)

  const [menuData, setMenuData] = useState(initMenuData)
  const [rightMenuData, setRightMenu] = useState(systemMenuData)
  const [headerSelect, setHeaderSelect] = useState()

  const [newsVisible, setNewsVisible] = useState(false)

  // 判断登录权限
  useEffect(() => {
    const data = localGetItem('CRMUSERDATA')
    if (data) {
      // 获取导航数据
      if (initMenuData.length === 0) {
        createMenu(data.user_info.main_dept_id)
      } else {
        let item = flattenArray(initMenuData)?.find((item) => item.path === location.pathname)
        item && createSelect([...initMenuData, ...systemMenuData], item.permission)
      }
    } else {
      sessionStorage.clear()
      localStorage.clear()
      navigate('/login') // 跳转登录页
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
  const createMenu = async (dept_id, refresh = false) => {
    const { code, data } = await Http.post('/system/menu/user-list', { dept_id })
    if (code === 200) {
      localSetItem('CRMUSERDATA', data)
      if (refresh) {
        navigate(0)
        return
      }

      const left = data.left || []
      setMenuData(left)
      dispatch(setMenu(left))
      dispatch(setUserInfo(data.user_info)) //用户信息
      dispatch(setDepts(data.dept_list)) //角色信息
      dispatch(setTheme(data.theme)) //主题信息

      updateTheme(data?.theme) //设置主题

      const right = data.right || []
      setRightMenu(right)
      dispatch(setSystemMenu(right))
      // 重新选中导航
      if (!menuSelect) {
        const arr = [...left, ...right]
        const key = location?.state?.permission
        if (key) {
          createSelect(arr, key)
        } else {
          let item = flattenArray(arr)?.find((item) => item.path === location.pathname)
          item && createSelect(arr, item.permission)
        }
      }
    } else {
      onSelectSystem('exit')
    }
  }
  // 重新选中导航
  const createSelect = (arr, key) => {
    const item = flattenArray(arr)?.find((e) => e.permission === key)
    if (item) {
      dispatch(setMenuSelect(item))
      const parent = findRootNode(arr, item.id)
      if (parent?.length > 0) {
        setHeaderSelect(parent[0])
      }
    }
  }
  // 导航选择
  const onSelectMenu = (item) => {
    if (item?.type === 2 && item?.path) {
      dispatch(setMenuSelect(item))
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
    // 切换机构
    if (type === 'role') {
      createMenu(obj, true) //切换机构后刷新页面
    }
    // 切换主题
    if (type === 'theme') {
      changeTheme(obj)
    }
    // 消息通知
    if (type === 'notification') {
      console.log('消息通知')
      setNewsVisible(true)
    }
    // 个人信息
    if (type === 'person') {
      setHeaderSelect()
      dispatch(setMenuSelect(null))
      navigate('/person')
    }
    // 退出
    if (type === 'exit') {
      exit()
    }
  }

  // 切换主题
  const changeTheme = async (obj) => {
    const { code, data } = await Http.post('/theme/change', obj)
    if (code === 200) {
      localSetItem('CRMUSERDATA', data)

      dispatch(setTheme(data.theme)) //主题信息
      updateTheme(data?.theme) //设置主题
    }
  }
  // 退出
  const exit = async () => {
    const { code, message } = await Http.post('/logout')
    if (code === 200) {
      sessionStorage.clear()
      localStorage.clear()
      Message.success(message || '退出成功')
      navigate('/login') // 跳转登录页
    }
  }

  return (
    <Layout className='h-screen w-screen' ref={refContent}>
      <MenuCustom.Header
        content={refContent}
        leftIitems={menuData}
        rightIitems={rightMenuData}
        select={headerSelect}
        logo={logo}
        title={title}
        userInfo={userInfo}
        depts={depts}
        theme={theme}
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
            <Suspense fallback={<Loading dot size={10} />}>
              <Outlet />
            </Suspense>
          </div>
        </Layout.Content>
      </Layout>

      {/* 消息通知 */}
      <Drawer
        width={'75%'}
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
