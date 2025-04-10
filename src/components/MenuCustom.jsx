import { Avatar, Button, ColorPicker, Dropdown, Form, Image, Layout, Menu, Modal, Space } from '@arco-design/web-react'
import { IconDown, IconLeft, IconNotification, IconPalette, IconRight } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
// 组件
import IconCustom from 'src/components/IconCustom'
// 公共方法
import { findRootNode } from 'src/utils/common'

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
  const { leftIitems = [], rightIitems = [], select, logo, title, userInfo, onSelectMenu, onSelectSystem } = props
  const [formTheme] = Form.useForm()
  const [leftMenus, setLeftMenus] = useState([])
  const [rightMenus, setRightMenus] = useState([])
  const [visibleTheme, setVisibleTheme] = useState(false)

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
      formTheme.setFieldsValue(userInfo?.theme)
    } else {
      onSelectSystem('theme', formTheme.getFieldsValue())
    }
  }
  // 恢复系统默认
  const resetTheme = () => {
    formTheme.setFieldsValue({
      header: '#304156',
      button: '#165DFF',
    })
  }

  return (
    <>
      <Layout.Header className='header-menu-wrap'>
        <div className='menu-content'>
          <div className='logo' onClick={() => onSelectMenu(leftMenus[0])}>
            <Image preview={false} simple={true} src={logo} />
            {title}
          </div>
          {leftMenus.map((item) => (
            <div
              key={item.permission}
              className={`left-item ${select?.permission === item.permission ? 'active' : ''}`}
              onClick={() => onSelectMenu(item)}>
              {item.title}
            </div>
          ))}
        </div>
        <Space size='large'>
          <div className='menu-content'>
            <div className='right-item'>
              <Dropdown
                position='br'
                trigger='click'
                droplist={
                  <Menu>
                    <Menu.Item key='person'>创智南京</Menu.Item>
                    <Menu.Item key='exit'>B机构</Menu.Item>
                  </Menu>
                }>
                <div className='org'>
                  <span className='txt'>创智南京</span>
                  <IconDown />
                </div>
              </Dropdown>
            </div>
            <div className='right-item'>
              <IconPalette onClick={() => toggleTheme(true)} />
            </div>
            <div className='right-item'>
              <IconNotification onClick={() => onSelectSystem('notification')} />
            </div>
            <div className='right-item divider'></div>
            {rightMenus?.map((item) => (
              <div key={item.permission} className='right-item' onClick={() => onSelectMenu(item)}>
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
              {userInfo?.name}
            </Avatar>
          </Dropdown>
        </Space>
      </Layout.Header>

      <Modal
        title='颜色配置'
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
            <Form.Item label='顶部导航颜色' field={'header'}>
              <ColorPicker format='rgb' disabledAlpha />
            </Form.Item>
            <Form.Item label='主按钮颜色' field={'button'}>
              <ColorPicker format='rgb' disabledAlpha />
            </Form.Item>
          </Form>
        </div>
      </Modal>
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
    <div className='sider-menu-wrap'>
      <div className='menu-content'>
        {menus
          ?.filter((e) => e.is_hide !== 1)
          .map((item) => (
            <Fragment key={item.permission}>
              <div
                className={`item ${selectSecond?.permission === item.permission ? 'active' : ''}`}
                onClick={() => onSelectSecond(item)}>
                {item.is_icon && (
                  <Avatar shape='square' size={32}>
                    <IconCustom name={item.is_icon} />
                  </Avatar>
                )}
                <div className='text'>{item.title}</div>
              </div>
            </Fragment>
          ))}
      </div>
      {selectSecond?.children?.length > 0 && (
        <>
          <div className='collapse-btn'>
            <Button
              onClick={() => cutCollap(!collapsed)}
              type='secondary'
              shape='circle'
              size='mini'
              icon={collapsed ? <IconRight /> : <IconLeft />}
            />
          </div>
          <div className={`third-menu ${collapsed ? 'third-menu-border' : ''}`}>
            {selectSecond?.children?.map((item) => (
              <Fragment key={item.permission}>
                <div
                  className={`item ${collapsed ? 'hide' : 'show'} ${selectThird?.permission === item.permission ? 'active' : ''}`}
                  onClick={() => onSelectThird(item)}>
                  {item.is_icon && (
                    <Avatar shape='square' size={32}>
                      <IconCustom name={item.is_icon} />
                    </Avatar>
                  )}
                  <div className='text'>{item.title}</div>
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
