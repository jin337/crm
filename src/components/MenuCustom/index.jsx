import { Avatar, Button, ColorPicker, Drawer, Dropdown, Form, Image, Layout, Menu, Modal, Space } from '@arco-design/web-react'
import { IconApps, IconDown, IconLeft, IconNotification, IconPalette, IconRight } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
// 组件
import { IconCustom } from 'src/components'
import Apps from './apps'
// 公共方法
import { findRootNode } from 'src/utils/common'
import styles from './index.module.scss'

const filterHiddenItems = (arr) => {
  return arr
    .filter((item) => item?.is_hide !== 1) // 保留 is_hide 不为 1 的节点
    .map((item) => {
      // 创建新对象，避免修改原数据
      const newItem = { ...item }
      // 递归处理子节点
      if (newItem?.children && newItem?.children?.length > 0) {
        newItem.children = filterHiddenItems(newItem.children)
      }
      return newItem
    })
}

const Header = (props) => {
  const {
    content,
    leftIitems = [],
    rightIitems = [],
    select,
    logo,
    title,
    userInfo,
    roles,
    theme,
    onSelectMenu,
    onSelectSystem,
  } = props
  const [formTheme] = Form.useForm()
  const [leftMenus, setLeftMenus] = useState([])
  const [rightMenus, setRightMenus] = useState([])

  const [visibleTheme, setVisibleTheme] = useState(false)
  const [appsVisible, setAppsVisible] = useState(false)

  useEffect(() => {
    setLeftMenus(filterHiddenItems(leftIitems))
  }, [leftIitems])

  useEffect(() => {
    setRightMenus(filterHiddenItems(rightIitems))
  }, [rightIitems])

  // 主题切换
  const toggleTheme = (type) => {
    setVisibleTheme(type)
    if (type) {
      formTheme.setFieldsValue(theme)
    } else {
      onSelectSystem('theme', formTheme.getFieldsValue())
    }
  }
  // 恢复系统默认
  const resetTheme = () => {
    formTheme.setFieldsValue({
      menu_color: '#304156',
      button_color: '#165DFF',
    })
  }

  // 导航选择
  const selectMenu = (e) => {
    setAppsVisible(false)
    onSelectMenu(e)
  }

  return (
    <>
      <Layout.Header className={styles['header-menu-wrap']}>
        <div className={styles['menu-content']}>
          <div className={styles['logo']} onClick={() => selectMenu(leftMenus[0])}>
            <Image preview={false} simple={true} src={logo} />
            {title}
          </div>
          <div className={styles['menu-icon']} onClick={() => setAppsVisible(!appsVisible)}>
            <IconApps />
          </div>
          {leftMenus.map((item) => (
            <div
              key={item.permission}
              className={`${styles['left-item']} ${select?.permission === item.permission ? styles['active'] : ''}`}
              onClick={() => selectMenu(item)}>
              {item.title}
            </div>
          ))}
        </div>
        <Space size='large'>
          <div className={styles['menu-content']}>
            <div className={styles['right-item']}>
              <Dropdown
                position='br'
                trigger='click'
                droplist={
                  <Menu onClickMenuItem={(e) => onSelectSystem('role', e)}>
                    {roles?.map((r) => (
                      <Menu.Item key={r.dept_id}>{r.dept_name}</Menu.Item>
                    ))}
                  </Menu>
                }>
                <div className={styles['org']}>
                  <span className={styles['txt']}>{userInfo?.main_dept_name}</span>
                  <IconDown />
                </div>
              </Dropdown>
            </div>
            <div className={styles['right-item']}>
              <IconPalette onClick={() => toggleTheme(true)} />
            </div>
            <div className={styles['right-item']}>
              <IconNotification onClick={() => onSelectSystem('notification')} />
            </div>
            <div className={`${styles['right-item']} ${styles['divider']}`}></div>
            {rightMenus?.map((item) => (
              <div key={item.permission} className={styles['right-item']} onClick={() => selectMenu(item)}>
                <IconCustom name={item?.is_icon} />
              </div>
            ))}
          </div>
          <Dropdown
            position='br'
            trigger='click'
            droplist={
              <Menu onClickMenuItem={onSelectSystem}>
                <Menu.Item key='person'>个人信息</Menu.Item>
                <Menu.Item key='exit'>退出登录</Menu.Item>
              </Menu>
            }>
            <Avatar size={32} style={{ backgroundColor: '#fff', color: '#1d2129' }} className='cursor-pointer'>
              {userInfo?.user_name}
            </Avatar>
          </Dropdown>
        </Space>
      </Layout.Header>

      <Modal
        title='主题配置'
        visible={visibleTheme}
        onOk={() => toggleTheme(false)}
        onCancel={() => setVisibleTheme(false)}
        autoFocus={false}
        focusLock={true}>
        <div className='theme-form'>
          <div className='theme-reset'>
            <Button type='text' onClick={resetTheme}>
              恢复系统默认
            </Button>
          </div>
          <Form layout='vertical' autoComplete='off' form={formTheme}>
            <Form.Item label='顶部导航' field='menu_color'>
              <ColorPicker format='rgb' disabledAlpha />
            </Form.Item>
            <Form.Item label='主按钮颜色' field='button_color'>
              <ColorPicker format='rgb' disabledAlpha />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* apps */}
      <Drawer
        footer={null}
        placement='top'
        height={'100%'}
        closable={false}
        headerStyle={{ height: '57px' }}
        getPopupContainer={() => content && content?.current}
        visible={appsVisible}
        onOk={() => setAppsVisible(false)}
        onCancel={() => setAppsVisible(false)}>
        <Apps items={leftIitems} onSelectMenu={selectMenu} />
      </Drawer>
    </>
  )
}
const Sider = (props) => {
  const { items = [], select, onSelectMenu } = props
  const [selectSecond, setSelectSecond] = useState()
  const [selectThird, setSelectThird] = useState()
  const [collapsed, setCollapsed] = useState(false)
  const [menus, setMenus] = useState([])

  useEffect(() => {
    const type = localStorage.getItem('MENU-COLLAPSED')
    setCollapsed(type === 'true')
  }, [])

  useEffect(() => {
    setMenus(filterHiddenItems(items))
  }, [items])

  useEffect(() => {
    const arr = filterHiddenItems(findRootNode(items, select?.id))
    if (arr.length) {
      setSelectSecond(arr[0])
      setSelectThird(arr[1])
    }
  }, [menus, select])

  // 二级菜单
  const onSelectSecond = (item) => {
    if (!item?.children || item?.children?.length === 0) {
      setSelectSecond()
      setSelectThird()
    }
    // 判断是否是菜单
    setSelectSecond(item)
    // 判断是否是可见
    const children = item?.children
    if (children?.length > 0) {
      // 默认选择第一个
      onSelectThird(children[0])
    } else {
      onSelectMenu(item)
    }
  }

  // 三级菜单
  const onSelectThird = (item) => {
    setSelectThird(item)

    onSelectMenu(item)
  }

  const cutCollap = (flag) => {
    setCollapsed(flag)
    localStorage.setItem('MENU-COLLAPSED', flag)
  }

  return (
    <div className={styles['sider-menu-wrap']}>
      <div className={styles['menu-content']}>
        {menus
          ?.filter((e) => e.is_hide !== 1)
          .map((item) => (
            <Fragment key={item.permission}>
              <div
                className={`${styles['item']} ${selectSecond?.permission === item.permission ? styles['active'] : ''}`}
                onClick={() => onSelectSecond(item)}>
                {item.is_icon && (
                  <Avatar
                    shape='square'
                    size={32}
                    style={selectSecond?.permission === item.permission ? { backgroundColor: 'rgb(var(--primary-6))' } : {}}>
                    <IconCustom name={item.is_icon} />
                  </Avatar>
                )}
                <div className={styles['text']}>{item.title}</div>
              </div>
            </Fragment>
          ))}
      </div>
      {selectSecond?.children?.length > 0 && (
        <>
          <div className={styles['collapse-btn']}>
            <Button
              onClick={() => cutCollap(!collapsed)}
              type='secondary'
              shape='circle'
              size='mini'
              icon={collapsed ? <IconRight /> : <IconLeft />}
            />
          </div>
          <div className={`${styles['third-menu']} ${collapsed ? styles['third-menu-border'] : ''}`}>
            {selectSecond?.children?.map((item) => (
              <Fragment key={item.permission}>
                <div
                  className={`${styles['item']} ${collapsed ? styles['hide'] : styles['show']} ${selectThird?.permission === item.permission ? styles['active'] : ''}`}
                  onClick={() => onSelectThird(item)}>
                  {item.is_icon && (
                    <Avatar
                      shape='square'
                      size={32}
                      style={selectThird?.permission === item.permission ? { backgroundColor: 'rgb(var(--primary-6))' } : {}}>
                      <IconCustom name={item.is_icon} />
                    </Avatar>
                  )}
                  <div className={styles['text']}>{item.title}</div>
                </div>
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const MenuCustom = () => {
  return null
}

MenuCustom.Header = Header
MenuCustom.Sider = Sider
export default MenuCustom
