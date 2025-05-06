import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'

const Account = () => {
  const [searchForm] = Form.useForm()
  const [createForm] = Form.useForm()
  const [tableData, setTableData] = useState({})

  useEffect(() => {
    onChangeSearch(1)
  }, [])

  // 表头
  const columns = [
    {
      title: '登录名',
      dataIndex: 'login_name',
    },
    {
      title: '账户名',
      dataIndex: 'account_name',
    },
    {
      title: '手机号',
      dataIndex: 'account_mobile',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 70,
      render: (text, record) => <Checkbox style={{ padding: 0 }} checked={text} onChange={() => onChangeCheckbox(record)} />,
    },
    {
      title: '账号认证',
      dataIndex: 'account_auth',
      align: 'center',
      width: 90,
      render: (text) => {
        switch (text) {
          case 1:
            return <Tag color='arcoblue'>已认证</Tag>
          case 0:
            return <Tag color='gray'>未认证</Tag>
          default:
            return <Tag>未知</Tag>
        }
      },
    },
    {
      title: '操作',
      code: 'op',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='text' size='mini' onClick={() => onCreate('edit', record)}>
            编辑
          </Button>
          <Popconfirm focusLock title='提醒' content='是否确定删除当前项？' onOk={() => onDelete([record.id])}>
            <Button type='text' size='mini' status='danger'>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 获取数据
  const onChangeSearch = async (current) => {
    const search = searchForm.getFieldsValue()

    const { code, data } = await Http.post('/system/account/list', { current, pageSize: 10, ...search })
    if (code === 200 || code === 0) {
      setTableData(data || [])
    }
  }

  // 创建&编辑
  const onCreate = (type, item) => {
    createForm.resetFields()
    let msg = type === 'add' ? '新增' : '编辑'
    let obj = {}
    let url = null
    if (type === 'add') {
      url = '/system/account/add'
      obj = {}
    }
    if (type === 'edit') {
      url = '/system/account/edit'
      obj = { ...item }
    }
    createForm.setFieldsValue(obj)
    Modal.confirm({
      title: msg + '账号',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form
          form={createForm}
          layout='vertical'
          autoComplete='off'
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <Form.Item label='登录名' field='login_name' rules={[{ required: true }]}>
            <Input placeholder='请输入内容' />
          </Form.Item>
          <Form.Item label='账号名' field='account_name' rules={[{ required: true }]}>
            <Input placeholder='请输入内容' />
          </Form.Item>
          <Form.Item label='手机号' field='account_mobile' rules={[{ required: true }]}>
            <Input placeholder='请输入内容' />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        createForm.validate().then(async (values) => {
          if (type === 'add') {
            values.status = 1
          }
          if (type === 'edit') {
            values.id = item.id
          }
          const { code } = await Http.post(url, values)
          if (code === 200 || code === 0) {
            onChangeSearch(tableData?.current || 1)
            Message.success(msg + '成功')
          }
        })
      },
    })
  }

  // 修改状态
  const onChangeCheckbox = async (item) => {
    const { code } = await Http.post('/system/account/change-status', { id: item.id, status: item.status ? 0 : 1 })
    if (code === 200 || code === 0) {
      onChangeSearch(tableData?.current || 1)
      Message.success('修改成功')
    }
  }

  // 删除
  const onDelete = async (ids) => {
    const { code } = await Http.post('/system/account/del', { ids })
    if (code === 200 || code === 0) {
      onChangeSearch(tableData?.current || 1)
      Message.success('删除成功')
    }
  }

  return (
    <>
      <Card bordered={false}>
        <div className='mb-2 flex items-start justify-between'>
          <Form layout='inline' autoComplete='off' size='small' form={searchForm} onChange={() => onChangeSearch(1)}>
            <Form.Item field='content' label='关键字'>
              <Input style={{ width: 200 }} allowClear placeholder='请输入内容' />
            </Form.Item>
            <Form.Item field='account_status' label='状态'>
              <Select
                allowClear
                style={{ width: 200 }}
                options={[
                  { label: '启用', value: 1 },
                  { label: '禁用', value: 0 },
                ]}
              />
            </Form.Item>
          </Form>
          <Button type='primary' size='small' icon={<IconPlus />} onClick={() => onCreate('add')}>
            新增账号
          </Button>
        </div>

        <Table
          borderCell
          stripe
          rowKey='id'
          columns={columns}
          data={tableData.list || []}
          pagination={{
            showTotal: true,
            total: tableData.total,
            current: tableData.current,
            onChange: (e) => onChangeSearch(e),
          }}
        />
      </Card>
    </>
  )
}
export default Account
