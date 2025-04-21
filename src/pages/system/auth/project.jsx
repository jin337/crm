import { Button, Card, Dropdown, Form, Input, Menu, Modal, Popconfirm, Space, Table, Tabs } from '@arco-design/web-react'
import { IconPlus, IconSettings } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// 组件
import { TreeCheck } from 'src/components'

const list = [
  {
    id: 1,
    title: '主管',
  },
  {
    id: 2,
    title: '管理员',
  },
]
const Project = () => {
  const common = useSelector((state) => state.common)
  const [searchForm] = Form.useForm()
  const [createForm] = Form.useForm()
  const [items, setItems] = useState(list)
  const [active, setActive] = useState(0)

  const [dataTable, setDataTable] = useState([])
  const [treeData, setTreeData] = useState([])

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name1',
    },
    {
      title: '机构',
      dataIndex: 'name0',
    },
    {
      title: '部门',
      dataIndex: 'name2',
    },
    {
      title: '职位',
      dataIndex: 'name3',
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='text' size='mini'>
            编辑
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
    const arr = common.initMenuData.filter((e) => e.permission === 'project')
    if (arr.length) {
      setTreeData(arr)
    }
  }, [common?.initMenuData])
  // 查询事件
  const onChangeSearch = (e) => {
    let obj = { ...searchForm.getFields() }
    console.log(obj)
  }

  // 创建账号
  const onCreate = () => {
    Modal.confirm({
      title: '新增角色',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form form={createForm} layout='vertical' autoComplete='off'>
          <Form.Item field='role_name' rules={[{ required: true }]}>
            <Input placeholder='请输入角色名' />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        const obj = {
          role_type: 2, //1系统角色2应用角色
          role_group_id: common.userInfo.main_dept_id,
        }
        createForm.validate().then((values) => {
          obj.role_name = values.role_name
          console.log('新增角色数据', obj)
        })
      },
    })
  }

  return (
    <div className='flex h-full gap-2'>
      <Card className='w-1/4' bordered={false}>
        <div className='mb-2 flex justify-end'>
          <Button type='text' size='small' icon={<IconPlus />} onClick={onCreate}>
            新增角色
          </Button>
        </div>
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <div
              className={`group mb-2 flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 hover:border-[rgb(var(--primary-6))] hover:bg-[var(--hover-color)] ${active === index ? 'border-[rgb(var(--primary-6))] bg-[var(--hover-color)]' : 'border-white'}`}
              onClick={() => setActive(index)}>
              {item.title}
              <Dropdown
                trigger='click'
                position='bottom'
                droplist={
                  <Menu>
                    <Menu.Item key='1'>复制</Menu.Item>
                    <Menu.Item key='2'>编辑</Menu.Item>
                    <Menu.Item key='3'>删除</Menu.Item>
                  </Menu>
                }>
                <IconSettings className={`${active === index ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`} />
              </Dropdown>
            </div>
          </Fragment>
        ))}
      </Card>

      <Card className='h-full w-3/4' bordered={false} bodyStyle={{ height: '100%' }}>
        <Tabs defaultActiveTab='1' justify>
          <Tabs.TabPane key='1' title='角色账号'>
            <div className='mb-2 flex items-start justify-between'>
              <Form layout='inline' autoComplete='off' size='small' form={searchForm} onChange={onChangeSearch}>
                <Form.Item field='keyword'>
                  <Input.Search placeholder='请输入关键字' />
                </Form.Item>
              </Form>
              <Space>
                <Button type='primary' size='small' status='primary' icon={<IconPlus />}>
                  关联账号
                </Button>
              </Space>
            </div>

            <Table borderCell stripe rowKey='id' columns={columns} data={dataTable} />
          </Tabs.TabPane>

          <Tabs.TabPane key='2' title='角色权限'>
            <div className='mb-2 text-right'>
              <Button type='primary' size='small'>
                保存
              </Button>
            </div>
            <TreeCheck treeData={treeData} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}
export default Project
