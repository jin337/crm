import { Button, Card, Dropdown, Form, Input, Menu, Message, Modal, Space, Table, Tabs, Tag } from '@arco-design/web-react'
import { IconPlus, IconSettings } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// 组件
import { SelectUser, TreeCheck } from 'src/components'
// 公共方法
import { flattenArray } from 'src/utils/common'

// 接口
import Http from 'src/service/api'

const Setting = () => {
  const { menuSelect } = useSelector((state) => state.common)

  const [searchForm] = Form.useForm()
  const [roleForm] = Form.useForm()

  // 角色列表
  const [items, setItems] = useState([])
  // 当前角色
  const [active, setActive] = useState({})

  // 关联账号弹窗
  const [visibleSelect, setVisibleSelect] = useState(false)
  const [userData, setUserData] = useState([])

  const [tabActive, setTabActive] = useState('1')
  // 角色权限列表
  const [menuList, setMenuList] = useState([])
  // 角色账号列表
  const [roleUser, setRoleUser] = useState({})
  // 已选角色
  const [menuRole, setMenuRole] = useState([])

  // 表头
  const columns = [
    {
      title: '姓名',
      dataIndex: 'user_name',
    },
    {
      title: '账号',
      dataIndex: 'user_account',
      render: (_, record) => (
        <>
          {record.user_account}
          {record.user_account === 'admin' && (
            <Tag color='orange' size='small'>
              主账号
            </Tag>
          )}
        </>
      ),
    },
    {
      title: '主部门',
      dataIndex: 'user_dept_main_name',
    },
    {
      title: '职位',
      dataIndex: 'user_post',
    },
    {
      title: '角色',
      dataIndex: 'name1',
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type='text'
            size='mini'
            status='danger'
            onClick={() => onDeleteUser(record)}
            disabled={record.user_account === 'admin'}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    menuSelect?.app_id && getRoleList({ app_id: menuSelect?.app_id })
  }, [menuSelect])

  // 角色列表
  const getRoleList = async (obj) => {
    const { code, data } = await Http.post('/system/role/list', obj)
    if (code === 200) {
      let arr = data?.list || []
      setItems(arr)

      onRoleTab('1', arr[0])
    }
  }

  // 角色菜单列表
  const getMenuList = async (item) => {
    const { code, data } = await Http.post('/system/menu/list', { class: item.class, app_id: item.app_id })
    if (code === 200) {
      setMenuList(data?.list || [])
    }
  }

  // 已授权-角色菜单列表
  const getRoleMenu = async (id) => {
    const { code, data } = await Http.post('/system/role/menu', { role_id: id })
    if (code === 200) {
      let arr = flattenArray(data?.list || []).map((e) => e.id)
      setMenuRole(arr)
    }
  }

  // 角色用户列表
  const onChangeSearch = async (current, role = active) => {
    const search = searchForm.getFieldsValue()

    const { code, data } = await Http.post('/system/role/user', { current, pageSize: 10, role_id: role.id, ...search })
    if (code === 200) {
      setRoleUser(data || [])
    }
  }

  // 新增/编辑角色
  const onCreate = (type, item) => {
    roleForm.resetFields()
    let obj = {}
    let url = null
    if (type === 'add') {
      url = '/system/role/add'
    }
    if (type === 'edit') {
      url = '/system/role/edit'
      obj = { ...item }
    }
    roleForm.setFieldsValue(obj)
    Modal.confirm({
      title: (type === 'add' ? '新增' : '编辑') + '角色',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form
          form={roleForm}
          layout='vertical'
          autoComplete='off'
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <Form.Item field='role_name'>
            <Input allowClear placeholder='请输入内容' />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        roleForm.validate().then(async (values) => {
          if (type === 'add') {
            values.role_type = menuSelect.permission === 'system-auth-setting' ? 1 : 2 //1系统角色2应用角色
          }
          if (type === 'edit') {
            values = {
              ...item,
              ...values,
            }
          }
          values.app_id = menuSelect.app_id
          const { code, message } = await Http.post(url, values)
          if (code === 200) {
            getRoleList({ app_id: menuSelect?.app_id })
            Message.success(message)
          }
        })
      },
    })
  }

  // 删除
  const onDelete = async (item) => {
    Modal.confirm({
      title: '提醒',
      content: '是否确定删除当前项？',
      closable: true,
      wrapClassName: 'modal-wrap',
      onOk: async () => {
        const { code, message } = await Http.post('/system/role/del', { id: item.id })
        if (code === 200) {
          getRoleList({ app_id: menuSelect?.app_id })
          Message.success(message)
        }
      },
    })
  }

  // 角色账号/角色权限切换
  const onRoleTab = (e, item) => {
    setActive(item) // 当前已选角色
    setRoleUser({}) //已选角色账号列表
    setMenuList([]) // 角色权限列表
    setMenuRole([]) //已选角色权限

    setTabActive(e) // 当前tab
    if (item) {
      // 角色账号
      if (e === '1') {
        onChangeSearch(1, item)
      }
      if (e === '2') {
        // 已授权角色权限
        getRoleMenu(item.id)
      }
    }
    // 角色权限
    if (e === '2') {
      getMenuList(menuSelect)
    }
  }

  // 打开弹窗-关联账号
  const openSelect = async () => {
    // 已授权账号
    setUserData([])
    setVisibleSelect(true)
  }

  // 删除角色用户
  const onDeleteUser = async (item) => {
    Modal.confirm({
      title: '提醒',
      content: '是否确定删除当前项？',
      closable: true,
      wrapClassName: 'modal-wrap',
      onOk: async () => {
        const { code, message } = await Http.post('/system/role/del-user', { id: item.role_user_id })
        if (code === 200) {
          onChangeSearch(1)
          Message.success(message)
        }
      },
    })
  }

  // 保存-关联账号
  const onChangeUser = async (arr) => {
    setVisibleSelect(false)
    if (arr.length > 0) {
      const obj = { role_id: active.id, user_list: arr.map((e) => ({ user_id: e.id, dept_id: e.user_dept_main })) }
      const { code, message } = await Http.post('/system/role/add-user', obj)
      if (code === 200) {
        onChangeSearch(1)
        Message.success(message)
      }
    }
  }

  // 保存-角色权限
  const submitRole = async () => {
    const { code, message } = await Http.post('/system/role/add-menu', { role_id: active.id, menu_list: menuRole })
    if (code === 200) {
      getRoleMenu(active.id)
      Message.success(message)
    }
  }

  return (
    <div className='flex h-full gap-2'>
      <Card className='w-1/4' bordered={false}>
        <div className='mb-2 flex justify-end'>
          <Button type='text' size='small' icon={<IconPlus />} onClick={() => onCreate('add')}>
            新增角色
          </Button>
        </div>
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <div
              className={`group mb-2 flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 hover:border-[rgb(var(--primary-6))] hover:bg-[var(--hover-color)] ${active.id === item.id ? 'border-[rgb(var(--primary-6))] bg-[var(--hover-color)]' : 'border-white'}`}
              onClick={() => onRoleTab('1', item)}>
              {item.role_name}
              {item.id !== 1 && (
                <Dropdown
                  trigger='click'
                  position='bottom'
                  droplist={
                    <Menu>
                      <Menu.Item key='1'>复制</Menu.Item>
                      <Menu.Item key='2' onClick={() => onCreate('edit', item)}>
                        编辑
                      </Menu.Item>
                      <Menu.Item key='3' onClick={() => onDelete(item)}>
                        删除
                      </Menu.Item>
                    </Menu>
                  }>
                  <IconSettings className={`${active === index ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`} />
                </Dropdown>
              )}
            </div>
          </Fragment>
        ))}
      </Card>

      <Card className='h-full w-3/4' bordered={false} bodyStyle={{ height: '100%' }}>
        <Tabs justify activeTab={tabActive} onChange={(e) => onRoleTab(e, active)}>
          <Tabs.TabPane key='1' title='角色账号'>
            <div className='mb-2 flex items-start justify-between'>
              <Form layout='inline' autoComplete='off' size='small' form={searchForm} onChange={() => onChangeSearch(1)}>
                <Form.Item field='content'>
                  <Input allowClear placeholder='请输入内容' />
                </Form.Item>
              </Form>
              <Space>
                <Button type='primary' size='small' status='primary' icon={<IconPlus />} onClick={openSelect}>
                  关联账号
                </Button>
              </Space>
            </div>

            <Table
              borderCell
              stripe
              rowKey='role_user_id'
              columns={columns}
              data={roleUser?.list || []}
              pagination={{
                showTotal: true,
                total: roleUser.total,
                current: roleUser.current,
                onChange: (e) => onChangeSearch(e),
              }}
            />
          </Tabs.TabPane>

          {active?.id !== 1 && (
            <Tabs.TabPane key='2' title='角色权限'>
              {menuList?.length > 0 && (
                <>
                  {items.length > 0 && (
                    <div className='mb-2 text-right'>
                      <Button type='primary' size='small' onClick={submitRole}>
                        保存
                      </Button>
                    </div>
                  )}
                  <TreeCheck treeData={menuList || []} selectKeys={menuRole} onChange={setMenuRole} />
                </>
              )}
            </Tabs.TabPane>
          )}
        </Tabs>
      </Card>

      {/* 关联账号 */}
      <SelectUser
        title='关联账号'
        visible={visibleSelect}
        setVisible={setVisibleSelect}
        mode='multiple'
        select={userData}
        id={active?.id}
        onChange={onChangeUser}
      />
    </div>
  )
}
export default Setting
