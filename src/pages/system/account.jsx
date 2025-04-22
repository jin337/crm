import { Button, Card, Form, Input, Modal, Table } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'
import { useState } from 'react'

const Account = () => {
  const [searchForm] = Form.useForm()
  const [createForm] = Form.useForm()
  const [tableData, setTableData] = useState({})

  // 表头
  const columns = [
    {
      title: '账户名',
      dataIndex: 'account_name',
    },
    {
      title: '登录名',
      dataIndex: 'login_name',
    },
    {
      title: '手机号',
      dataIndex: 'account_mobile',
    },
    {
      title: '状态',
      dataIndex: 'account_status_name',
    },
    {
      title: '账号认证',
      dataIndex: 'account_auth_name',
    },
    {
      title: '操作',
      code: 'op',
      align: 'center',
      render: (_, record) => (
        <Button type='text' size='mini'>
          设置
        </Button>
      ),
    },
  ]

  // 创建
  const onCreate = (e) => {
    Modal.confirm({
      title: (e?.key ? '编辑' : '新增') + '账号',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form form={createForm} layout='vertical' autoComplete='off'>
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
        createForm.validate().then((values) => {
          console.log('新增账号数据', values)
        })
      },
    })
  }

  return (
    <>
      <Card bordered={false}>
        <div className='mb-2 flex items-start justify-between'>
          <Form layout='inline' autoComplete='off' size='small' form={searchForm}>
            <Form.Item field='keyword'>
              <Input.Search placeholder='请输入员工名称/手机号' />
            </Form.Item>
          </Form>
          <Button type='primary' size='small' icon={<IconPlus />} onClick={onCreate}>
            新增账号
          </Button>
        </div>

        <Table borderCell stripe rowKey='id' columns={columns} data={tableData.list || []} />
      </Card>
    </>
  )
}
export default Account
