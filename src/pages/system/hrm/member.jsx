import { Button, Card, Dropdown, Form, Input, Menu, Message, Modal, Space, Table, Tag } from '@arco-design/web-react'
import { IconMore, IconPlus } from '@arco-design/web-react/icon'
import { useState } from 'react'

import { useEffect } from 'react'
import CreateForm from './create'
const HrmMember = () => {
  const [searchForm] = Form.useForm()
  const [createForm] = Form.useForm()

  const [tableData, setTableData] = useState({})
  const [orgData, setOrgData] = useState([])

  // 流程管理-表头
  const columns = [
    {
      title: '姓名',
      dataIndex: 'user_name',
      width: 120,
    },
    {
      title: '账号',
      dataIndex: 'user_account',
      width: 120,
      render: (text, record) =>
        record.status === 0 ? (
          text
        ) : (
          <div className='cursor-pointer text-[rgb(var(--primary-6))]' onClick={() => onCreate('edit', record)}>
            {text}
          </div>
        ),
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
            <Menu onClickMenuItem={(key) => handleClick(key, record)}>
              <Menu.Item key='on_job' disabled={[0, 1].includes(record.status)}>
                办理转正
              </Menu.Item>
              <Menu.Item key='2' disabled>
                调整部门/岗位
              </Menu.Item>
              <Menu.Item key='3' disabled>
                晋升/降级
              </Menu.Item>
              <Menu.Item
                key='resign'
                style={record.status !== 0 ? { color: 'rgb(var(--danger-6))' } : {}}
                disabled={record.status === 0}>
                办理离职
              </Menu.Item>
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
    if (code === 200) {
      setTableData(data || [])
    }
  }
  // 新增/编辑
  const onCreate = async (type, item) => {
    createForm.resetFields()
    let obj = {}
    if (type === 'edit') {
      obj = { ...item }
      obj.user_depts = item.user_depts.split(',')
    }
    createForm.setFieldsValue(obj)

    if (orgData.length > 0) {
      openCreate(type, item)
    } else {
      const { code, data } = await Http.post('/system/dept/list', { pid: -1 })
      if (code === 200) {
        setOrgData(data.list || [])
        openCreate(type, item, data.list || [])
      }
    }
  }

  const openCreate = (type, item, arr = orgData) => {
    Modal.confirm({
      title: (type === 'add' ? '新增' : '编辑') + '员工',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: <CreateForm form={createForm} data={arr} />,
      onOk: async () => {
        let values = await createForm.validate()
        let url = null
        if (type === 'add') {
          values.status = 2
          url = '/system/user/add'
        }
        if (type === 'edit') {
          url = '/system/user/edit'
          values = {
            ...item,
            ...values,
          }
        }
        values.user_depts = values.user_depts.join(',')
        const { code, message } = await Http.post(url, values)
        if (code === 200) {
          onChangeSearch(tableData?.current || 1)
          Message.success(message)
        }
      },
    })
  }
  // 操作
  const handleClick = async (key, record) => {
    let obj = {
      id: record.id,
    }
    if (key === 'on_job') {
      obj.status = 1
    }
    if (key === 'resign') {
      obj.status = 0
    }

    const { code, message } = await Http.post('/system/user/change-status', obj)
    if (code === 200) {
      onChangeSearch(tableData?.current || 1)
      Message.success(message)
    }
  }

  // 提交
  return (
    <>
      <Card bordered={false}>
        <div className='mb-2 flex items-start justify-between'>
          <Form layout='inline' autoComplete='off' form={searchForm} onChange={() => onChangeSearch(1)}>
            <Form.Item field='content'>
              <Input allowClear placeholder='请输入内容' />
            </Form.Item>
          </Form>
          <Space>
            <Button type='primary' size='small' status='primary' icon={<IconPlus />} onClick={() => onCreate('add')}>
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
