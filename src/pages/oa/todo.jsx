import { Button, Card, Form, Input, Select, Table } from '@arco-design/web-react'
import { useState } from 'react'

const Todo = () => {
  const [formSearch] = Form.useForm()
  const [tableData, setTableData] = useState({})

  // 表头
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name1',
    },
    {
      title: '性别',
      dataIndex: 'name3',
    },
    {
      title: '主部门',
      dataIndex: 'name5',
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
          <Form layout='inline' autoComplete='off' form={formSearch}>
            <Form.Item label='关键字' field='keyword'>
              <Input placeholder='请输入关键字' />
            </Form.Item>
            <Form.Item label='状态' field='status'>
              <Select options={[]} style={{ width: 185 }} placeholder='请选择状态' />
            </Form.Item>
          </Form>
        </div>

        <Table borderCell stripe rowKey='id' columns={columns} data={tableData.list || []} />
      </Card>
    </>
  )
}
export default Todo
