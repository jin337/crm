import { Button, Card, Dropdown, Form, Input, Menu, Modal, Space, Table } from '@arco-design/web-react'
import { IconMore, IconPlus } from '@arco-design/web-react/icon'
import { useState } from 'react'

import CreateForm from './create'
const HrmMember = () => {
  const [searchForm] = Form.useForm()
  const [createForm] = Form.useForm()

  const [dataTable, setDataTable] = useState([])
  const [visibleEdit, setVisibleEdit] = useState(false)

  // 流程管理-表头
  const columns = [
    {
      title: '用户名',
      dataIndex: 'user_name',
      width: 120,
    },
    {
      title: '用户账号',
      dataIndex: 'user_account',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'user_mobile',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'user_sex',
      width: 80,
    },
    {
      title: '主部门',
      dataIndex: 'user_dept_main',
      width: 120,
    },
    {
      title: '附属部门',
      dataIndex: 'user_depts',
      width: 120,
    },
    {
      title: '岗位',
      dataIndex: 'job',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
    },
    {
      title: '入职时间',
      dataIndex: 'create_time',
      width: 120,
    },
    {
      title: '最后登录时间',
      dataIndex: 'last_login_time',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      width: 80,
      render: (_, record) => (
        <Dropdown
          position='br'
          droplist={
            <Menu>
              <Menu.Item key='1'>办理转正</Menu.Item>
              <Menu.Item key='2'>调整部门/岗位</Menu.Item>
              <Menu.Item key='3'>晋升/降级</Menu.Item>
              <Menu.Item key='4'>参保方案</Menu.Item>
              <Menu.Item key='5'>办理离职</Menu.Item>
            </Menu>
          }>
          <Button type='text'>
            <IconMore />
          </Button>
        </Dropdown>
      ),
    },
  ]

  // 查询事件
  const onChangeSearch = () => {
    let obj = { ...searchForm.getFields() }
    console.log(obj)
  }

  // 新增
  const onCreate = (e) => {
    createForm.resetFields()
    let obj = {}
    createForm.setFieldsValue(obj)

    Modal.confirm({
      title: (e?.key ? '编辑' : '新增') + '员工',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: <CreateForm form={createForm} />,
      onOk: () => {
        createForm.validate().then((values) => {
          console.log('数据', values)
        })
      },
    })
  }

  // 提交
  return (
    <>
      <Card bordered={false}>
        <div className='mb-2 flex items-start justify-between'>
          <Form layout='inline' autoComplete='off' form={searchForm} onChange={onChangeSearch}>
            <Form.Item field='keyword'>
              <Input.Search placeholder='请输入关键字' />
            </Form.Item>
          </Form>
          <Space>
            <Button type='primary' size='small' status='primary' icon={<IconPlus />} onClick={() => onCreate()}>
              新增员工
            </Button>
          </Space>
        </div>
        {/* scroll={{ x: true }} */}
        <Table borderCell stripe rowKey='id' columns={columns} data={dataTable} />
      </Card>
    </>
  )
}
export default HrmMember
