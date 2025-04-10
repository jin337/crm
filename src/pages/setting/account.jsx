import { Button, Card, Form, Input, Space, Table } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'
import { useState } from 'react'

const Account = () => {
  const [formSearch] = Form.useForm()
  const [tableData, setTableData] = useState({})

  // 表头
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name1',
    },
    {
      title: '手机号（登录名）',
      dataIndex: 'name2',
    },
    {
      title: '性别',
      dataIndex: 'name3',
    },
    {
      title: '邮箱',
      dataIndex: 'name4',
    },
    {
      title: '主部门',
      dataIndex: 'name5',
    },
    {
      title: '附属部门',
      dataIndex: 'name6',
    },
    {
      title: '岗位',
      dataIndex: 'name7',
    },
    {
      title: '直属上司',
      dataIndex: 'name8',
    },
    {
      title: '角色',
      dataIndex: 'name9',
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

  return (
    <>
      <Card bordered={false}>
        <div className='mb-2 flex items-start justify-between'>
          <Form layout='inline' autoComplete='off' size='small' form={formSearch}>
            <Form.Item label='' field='keyword'>
              <Input.Search placeholder='请输入员工名称/手机号' />
            </Form.Item>
            <Form.Item label='显示' field=''>
              <Space>
                <Button type='secondary'>内部员工</Button>
                <Button type='secondary'>外部员工</Button>
              </Space>
            </Form.Item>
          </Form>
          <Button type='primary' size='small' icon={<IconPlus />}>
            新增账号
          </Button>
        </div>

        <Table borderCell stripe rowKey='id' columns={columns} data={tableData.list || []} />
      </Card>
    </>
  )
}
export default Account
