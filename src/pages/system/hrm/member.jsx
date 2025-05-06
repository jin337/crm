import { Button, Card, Dropdown, Form, Input, Menu, Modal, Space, Table, Tag } from '@arco-design/web-react'
import { IconMore, IconPlus } from '@arco-design/web-react/icon'
import { useState } from 'react'

import { useEffect } from 'react'
import CreateForm from './create'
const HrmMember = () => {
  const [searchForm] = Form.useForm()
  const [createForm] = Form.useForm()

  const [tableData, setTableData] = useState({})

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
      width: 130,
    },
    {
      title: '性别',
      dataIndex: 'user_sex',
      width: 70,
      align: 'center',
      render: (text) => (text === 1 ? '男' : '女'),
    },
    {
      title: '主部门',
      dataIndex: 'user_dept_main_name',
      width: 120,
    },
    {
      title: '附属部门',
      dataIndex: 'user_depts_name',
      width: 120,
    },
    {
      title: '岗位',
      dataIndex: 'user_post',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (text) => {
        switch (text) {
          case 2:
            return <Tag color='orange'>试用期</Tag>
          case 1:
            return <Tag color='arcoblue'>在职</Tag>
          case 0:
            return <Tag color='gray'>离职</Tag>
          default:
            return <Tag>未知</Tag>
        }
      },
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
              <Menu.Item key='4'>办理离职</Menu.Item>
            </Menu>
          }>
          <Button type='text'>
            <IconMore />
          </Button>
        </Dropdown>
      ),
    },
  ]

  useEffect(() => {
    onChangeSearch(1)
  }, [])
  // 获取数据
  const onChangeSearch = async (current) => {
    const search = searchForm.getFieldsValue()

    const { code, data } = await Http.post('/system/user/list', { current, pageSize: 10, ...search })
    if (code === 200 || code === 0) {
      setTableData(data || [])
    }
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
          <Form layout='inline' autoComplete='off' form={searchForm} onChange={() => onChangeSearch(1)}>
            <Form.Item field='keyword'>
              <Input.Search placeholder='请输入内容' />
            </Form.Item>
          </Form>
          <Space>
            <Button type='primary' size='small' status='primary' icon={<IconPlus />} onClick={() => onCreate()}>
              新增员工
            </Button>
          </Space>
        </div>
        {/* scroll={{ x: true }} */}
        <Table
          borderCell
          stripe
          rowKey='id'
          columns={columns}
          data={tableData?.list || []}
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
export default HrmMember
