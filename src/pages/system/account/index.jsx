import { Button, Card, Checkbox, Form, Input, Message, Modal, Select, Table, Tag, Tooltip } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'

const Account = () => {
  const [searchForm] = Form.useForm()
  const [createForm] = Form.useForm()
  const [tableData, setTableData] = useState({})

  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    onChangeSearch(1)
  }, [])

  // 表头
  const columns = [
    {
      title: '账号名',
      dataIndex: 'account_name',
      render: (text, record) =>
        record.user_id === 0 ? (
          <div className='cursor-pointer text-[rgb(var(--primary-6))]' onClick={() => onCreate('edit', record)}>
            {text}
          </div>
        ) : (
          text
        ),
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
      dataIndex: 'status',
      align: 'center',
      width: 90,
      render: (text, record) => (
        <Checkbox style={{ padding: 0 }} checked={text} onChange={() => onChangeCheckbox(record)}>
          {text ? '正常' : '禁用'}
        </Checkbox>
      ),
    },
    {
      title: '绑定账号',
      dataIndex: 'user_id',
      align: 'center',
      render: (text) => {
        switch (text) {
          case 0:
            return <Tag color='gray'>未绑定</Tag>
          default:
            return (
              <Tooltip content='不可删除已绑定账号'>
                <Tag color='arcoblue'>已绑定</Tag>
              </Tooltip>
            )
        }
      },
    },
    {
      title: '账号认证',
      dataIndex: 'account_auth',
      align: 'center',
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
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
    },
  ]

  // 获取数据
  const onChangeSearch = async (current) => {
    const search = searchForm.getFieldsValue()

    const { code, data } = await Http.post('/system/account/list', { current, pageSize: 10, ...search })
    if (code === 200) {
      setTableData(data || [])
    }
  }

  // 创建&编辑
  const onCreate = (type, item) => {
    createForm.resetFields()
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
      title: (type === 'add' ? '新增' : '编辑') + '账号',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form
          form={createForm}
          layout='vertical'
          autoComplete='off'
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <Form.Item label='账号名' field='account_name' rules={[{ required: true }]}>
            <Input allowClear placeholder='请输入内容' />
          </Form.Item>
          <Form.Item
            label='登录名'
            field='login_name'
            rules={[
              { required: true },
              {
                validator: (value, callback) => {
                  if (value === 'admin') {
                    callback('登录名不能是 admin')
                  } else if (/[\u4e00-\u9fa5]/.test(value)) {
                    callback('登录名不能包含中文')
                  } else {
                    callback()
                  }
                },
              },
            ]}>
            <Input allowClear disabled={type === 'edit'} placeholder='请输入内容' />
          </Form.Item>
          <Form.Item
            label='手机号'
            field='account_mobile'
            rules={[
              { required: true },
              {
                validator: (value, callback) => {
                  if (!/^1[3-9]\d{9}$/.test(value)) {
                    callback('请输入正确的11位手机号码')
                  }
                  callback()
                },
              },
            ]}>
            <Input allowClear placeholder='请输入内容' />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        let values = await createForm.validate()
        if (type === 'add') {
          values.status = 1
        }
        if (type === 'edit') {
          values = {
            ...item,
            ...values,
          }
        }
        const { code, message } = await Http.post(url, values)
        if (code === 200) {
          onChangeSearch(tableData?.current || 1)
          Message.success(message)
        }
      },
    })
  }

  // 修改状态
  const onChangeCheckbox = async (item) => {
    const { code, message } = await Http.post('/system/account/change-status', { id: item.id, status: item.status ? 0 : 1 })
    if (code === 200) {
      onChangeSearch(tableData?.current || 1)
      Message.success(message)
    }
  }

  // 删除
  const onDelete = (ids) => {
    Modal.confirm({
      title: '提醒',
      content: '是否确定删除当前项？',
      closable: true,
      wrapClassName: 'modal-wrap',
      onOk: async () => {
        const { code, message } = await Http.post('/system/account/del', { ids })
        if (code === 200) {
          setSelectedIds([])
          onChangeSearch(tableData?.current || 1)
          Message.success(message)
        }
      },
    })
  }

  // 重置密码
  const onResetPassword = (ids) => {
    Modal.confirm({
      title: '提醒',
      content: '是否确定重置当前项的密码？',
      closable: true,
      wrapClassName: 'modal-wrap',
      onOk: async () => {
        const { code, message } = await Http.post('/system/account/reset-pass', { ids })
        if (code === 200) {
          setSelectedIds([])
          onChangeSearch(tableData?.current || 1)
          Message.success(message)
        }
      },
    })
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

        {selectedIds?.length > 0 && (
          <div className='absolute top-[61px] left-[72px] z-10 flex h-[40px] w-[calc(100%-104px)] items-center gap-4 bg-[var(--color-neutral-2)]'>
            <div>已选中 {selectedIds.length} 项</div>
            <Button
              size='small'
              type='primary'
              disabled={tableData?.list?.some((item) => selectedIds?.includes(item.id) && item?.user_id !== 0)}
              onClick={() => onDelete(selectedIds)}>
              删除
            </Button>
            <Button size='small' type='primary' onClick={() => onResetPassword(selectedIds)}>
              重置密码
            </Button>
          </div>
        )}

        <Table
          borderCell
          stripe
          rowKey='id'
          columns={columns}
          data={tableData.list || []}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedIds,
            onChange: (ids) => setSelectedIds(ids),
          }}
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
