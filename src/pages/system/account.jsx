import { Button, Card, Form, Input, Table } from '@arco-design/web-react'
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
      title: '角色权限',
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
