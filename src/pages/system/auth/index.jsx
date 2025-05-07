import { Button, Card, Dropdown, Form, Input, Menu, Modal, Popconfirm, Space, Table, Tabs } from '@arco-design/web-react'
import { IconPlus, IconSettings } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'

// 组件
import { SelectUser, TreeCheck } from 'src/components'

// 接口
import Http from 'src/service/api'

const Setting = () => {
  const { menuSelect } = useSelector((state) => state.common)
  const location = useLocation()

  const [searchForm] = Form.useForm()
  const [roleForm] = Form.useForm()

  // 角色列表
  const [items, setItems] = useState([])
  // 当前角色
  const [active, setActive] = useState({})

  // 关联账号弹窗
  const [visibleSelect, setVisibleSelect] = useState(false)
  const [userTabs, setUserTabs] = useState([])
  const [userData, setUserData] = useState([])

  const [tabActive, setTabActive] = useState('1')
  // 角色权限列表
  const [roleMenu, setRoleMenu] = useState([])
  // 角色账号列表
  const [roleUser, setRoleUser] = useState([])
  // 已选角色
  const [checkTree, setCheckTree] = useState([])

  // 表头
  const columns = [
    {
      title: '姓名',
      dataIndex: 'user_name',
    },
    {
      title: '主部门',
      dataIndex: 'user_dept_main_name',
    },
    {
      title: '附属部门',
      dataIndex: 'user_depts_name',
    },
    {
      title: '职位',
      dataIndex: 'user_post',
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='text' size='mini'>
            设置
          </Button>
          <Button type='text' size='mini'>
            复制
          </Button>
          <Popconfirm focusLock title='提醒' content='是否确定删除当前项？'>
            <Button type='text' size='mini' status='danger'>
              删除
            </Button>
          </Popconfirm>
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
      setItems(data.list || [])
      setActive(data.list[0] || {})
      onChangeTab('1', data.list[0])
    }
  }
  // 角色菜单列表
  const getRoleMenu = async (id) => {
    const { code, data } = await Http.post('/system/role/menu', { role_id: id })
    if (code === 200) {
      setRoleMenu(data.list || [])
    }
  }

  // 角色用户列表
  const onChangeSearch = async (current) => {
    const search = searchForm.getFieldsValue()

    const { code, data } = await Http.post('/system/role/user', { current, pageSize: 10, role_id: active.id, ...search })
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
        <Form form={roleForm} layout='vertical' autoComplete='off'>
          <Form.Item field='role_name' rules={[{ required: true }]}>
            <Input placeholder='请输入内容' />
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
    const { code, message } = await Http.post('/system/role/del', { id: item.id })
    if (code === 200) {
      getRoleList({ app_id: menuSelect?.app_id })
      Message.success(message)
    }
  }

  // 角色账号/角色权限切换
  const onChangeTab = (e, item) => {
    setTabActive(e)
    if (e === '1') {
      onChangeSearch(1, item.id)
    }
    if (e === '2') {
      getRoleMenu(item.id)
    }
  }

  // 打开弹窗-关联账号
  const openSelect = () => {
    const list = [
      {
        id: 1,
        title: '常用',
        tree: 0,
        children: [],
      },
      {
        id: 2,
        title: '机构',
        tree: 1,
        children: [],
      },
    ]
    setUserTabs(list)
    onTabChange(list[0].id)

    setUserData([])

    setVisibleSelect(true)
  }
  // 切换关联账号类型
  const onTabChange = async (key) => {
    const { code, data } = await Http.get('/mock/org-list.json')
    if (code === 200) {
      const children = Number(key) === 1 ? data.list1 : data.list || []
      setUserTabs((prev) => {
        return prev.map((e) => {
          if (Number(e.id) === Number(key)) {
            e.children = children
          }
          return e
        })
      })
    }
  }
  // 关联账号
  const onChangeUser = (arr) => {
    console.log('关联账号', arr)
    setUserData(arr)
    setVisibleSelect(false)
  }

  // 保存角色
  const submitRole = () => {
    console.log('保存', checkTree)
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
              onClick={() => onChangeTab('1', item)}>
              {item.role_name}
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
            </div>
          </Fragment>
        ))}
      </Card>

      <Card className='h-full w-3/4' bordered={false} bodyStyle={{ height: '100%' }}>
        <Tabs justify activeTab={tabActive} onChange={(e) => onChangeTab(e, active)}>
          <Tabs.TabPane key='1' title='角色账号'>
            <div className='mb-2 flex items-start justify-between'>
              <Form layout='inline' autoComplete='off' size='small' form={searchForm} onChange={onChangeSearch}>
                <Form.Item field='content'>
                  <Input.Search allowClear placeholder='请输入内容' />
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
              rowKey='id'
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

          <Tabs.TabPane key='2' title='角色权限'>
            {roleMenu[0]?.children?.length > 0 && (
              <>
                <div className='mb-2 text-right'>
                  <Button type='primary' size='small' onClick={submitRole}>
                    保存
                  </Button>
                </div>
                <TreeCheck treeData={roleMenu || []} onChange={setCheckTree} />
              </>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 关联账号 */}
      <SelectUser
        title='关联账号'
        visible={visibleSelect}
        setVisible={setVisibleSelect}
        tabs={userTabs}
        onTabChange={onTabChange}
        select={userData}
        onChange={onChangeUser}
      />
    </div>
  )
}
export default Setting
