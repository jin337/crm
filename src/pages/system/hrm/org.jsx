import { Button, Card, Form, Input, Modal, Radio, Select, Space, Table, Tree } from '@arco-design/web-react'
import { IconPlus, IconSettings } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'

import CreateForm from './create'
const HrmOrg = () => {
  const [searchForm] = Form.useForm()
  const [orgForm] = Form.useForm()
  const [memberForm] = Form.useForm()

  const [dataTable, setDataTable] = useState([])
  const [orgData, setOrgData] = useState([])
  const [orgSelected, setOrgSelected] = useState([])

  useEffect(() => {
    Http.post('/system/dept/list', { pid: -1 }).then(({ code, data }) => {
      if (code === 200 || code === 0) {
        setOrgData(data.list || [])
        setOrgSelected(['0'])
      }
    })
  }, [])

  // 流程管理-表头
  const columns = [
    {
      title: '用户账号',
      dataIndex: 'user_account',
    },
    {
      title: '主部门',
      dataIndex: 'user_dept_main',
    },
    {
      title: '附属部门',
      dataIndex: 'user_depts',
    },
    {
      title: '岗位',
      dataIndex: 'job',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '入职时间',
      dataIndex: 'name5',
    },
  ]

  // 查询事件
  const onChangeSearch = () => {
    let obj = { ...searchForm.getFields() }
    console.log(obj)
  }

  // 新增/编辑部门
  const onCreateOrg = (e) => {
    orgForm.resetFields()
    let obj = {}
    if (e) {
      obj = e?.dataRef
    } else {
      obj = { dept_type: 1 }
    }
    orgForm.setFieldsValue(obj)
    Modal.confirm({
      title: (e?.key ? '编辑' : '新增') + '部门',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form form={orgForm} layout='vertical' autoComplete='off'>
          <Form.Item label='组织类型' field='dept_type' rules={[{ required: true }]}>
            <Radio.Group
              type='button'
              options={[
                {
                  label: '机构',
                  value: 1,
                },
                {
                  label: '部门',
                  value: 2,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label='组织部门名称' field='dept_name' rules={[{ required: true }]}>
            <Input placeholder='请输入内容' />
          </Form.Item>
          <Form.Item label='上级组织' field='dept_pid' rules={[{ required: true }]}>
            <Select mode='multiple' options={[]} placeholder='请选择' />
          </Form.Item>
          <Form.Item label='组织负责人' field='dept_admin' rules={[{ required: true }]}>
            <Select mode='multiple' options={[]} placeholder='请选择' />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        orgForm.validate().then((values) => {
          console.log('新增账号数据', values)
        })
      },
    })
  }

  // 新增员工
  const onCreateMember = (e) => {
    memberForm.resetFields()
    let obj = {}
    memberForm.setFieldsValue(obj)

    Modal.confirm({
      title: (e?.key ? '编辑' : '新增') + '员工',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: <CreateForm form={memberForm} />,
      onOk: () => {
        memberForm.validate().then((values) => {
          console.log('数据', values)
        })
      },
    })
  }

  return (
    <>
      <div className='flex h-full gap-2'>
        <Card bordered={false} className='w-1/4'>
          <div className='mb-2 flex justify-end'>
            <Button type='text' icon={<IconPlus />} onClick={() => onCreateOrg()}>
              新增部门
            </Button>
          </div>
          {orgData.length > 0 && (
            <Tree
              blockNode
              renderExtra={(node) => (
                <div className='settings' onClick={() => onCreateOrg(node)}>
                  <IconSettings />
                </div>
              )}
              fieldNames={{ key: 'id', title: 'dept_name' }}
              treeData={orgData}
              selectedKeys={orgSelected}
              onSelect={setOrgSelected}
            />
          )}
        </Card>
        <Card bordered={false} className='w-3/4'>
          <div className='mb-2 flex items-start justify-between'>
            <Form layout='inline' autoComplete='off' form={searchForm} onChange={onChangeSearch}>
              <Form.Item field='keyword'>
                <Input.Search placeholder='请输入内容' />
              </Form.Item>
            </Form>
            <Space>
              <Button type='primary' size='small' status='primary' icon={<IconPlus />} onClick={() => onCreateMember()}>
                新增员工
              </Button>
            </Space>
          </div>

          <Table borderCell stripe rowKey='id' columns={columns} data={dataTable} />
        </Card>
      </div>
    </>
  )
}
export default HrmOrg
