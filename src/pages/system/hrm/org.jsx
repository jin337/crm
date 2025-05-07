import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Menu,
  Message,
  Modal,
  Radio,
  Space,
  Table,
  Tag,
  Tree,
  TreeSelect,
} from '@arco-design/web-react'
import { IconPlus, IconSettings } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'
// 公共方法
import { flattenArray } from 'src/utils/common'

import CreateForm from './create'
const HrmOrg = () => {
  const [searchForm] = Form.useForm()
  const [orgForm] = Form.useForm()
  const [memberForm] = Form.useForm()

  const [tableData, setTableData] = useState({})
  const [orgData, setOrgData] = useState([])
  const [orgSelected, setOrgSelected] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])

  useEffect(() => {
    getOrgData()
  }, [])

  useEffect(() => {
    if (orgData?.length > 0) {
      // 默认选中第一个有效节点
      const firstValidNode = orgData.find((item) => item.children?.length > 0)
      firstValidNode?.id && selectOrg([firstValidNode.id])

      // 获取展开的节点ID
      const all = flattenArray(orgData)
        .filter((item) => item?.children?.length > 0)
        .map((item) => item?.id)

      setExpandedKeys(all)
    }
  }, [orgData])

  // 流程管理-表头
  const columns = [
    {
      title: '账号',
      dataIndex: 'user_account',
      render: (text, record) => (
        <div className='cursor-pointer text-[rgb(var(--primary-6))]' onClick={() => onCreateMember('edit', record)}>
          {text}
        </div>
      ),
    },
    {
      title: '主部门',
      dataIndex: 'user_dept_main_name',
    },
    {
      title: '附属部门',
      dataIndex: 'user_depts_name',
    },
    {
      title: '岗位',
      dataIndex: 'user_post',
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
      title: '入职时间',
      dataIndex: 'name5',
    },
  ]

  // 获取机构
  const getOrgData = () => {
    Http.post('/system/dept/list', { pid: -1 }).then(({ code, data }) => {
      if (code === 200) {
        const arr = data.list || []
        setOrgData(arr)
      }
    })
  }
  // 选择机构
  const selectOrg = (e) => {
    setOrgSelected(e)
    onChangeSearch(1, e)
  }
  // 查询事件
  const onChangeSearch = async (current, dept = orgSelected) => {
    const search = searchForm.getFieldsValue()

    const { code, data } = await Http.post('/system/user/list', { current, pageSize: 10, dept_main: dept[0], ...search })
    if (code === 200) {
      setTableData(data || [])
    }
  }

  // 新增/编辑部门
  const onCreateOrg = (type, e) => {
    orgForm.resetFields()
    let url = null
    let obj = {}
    if (type === 'add') {
      url = '/system/dept/add'
      obj = { dept_type: 1 }
    }
    if (type === 'edit') {
      url = '/system/dept/add'
      let data = e?.dataRef
      obj = {
        ...data,
        dept_pid: data.pid,
      }
    }
    orgForm.setFieldsValue(obj)

    Modal.confirm({
      title: (type === 'add' ? '新增' : '编辑') + '部门',
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
            <TreeSelect treeData={orgData} fieldNames={{ key: 'id', title: 'dept_name' }} placeholder='请选择' />
          </Form.Item>
          <Form.Item label='组织负责人' field='dept_admin'>
            <TreeSelect treeData={orgData} fieldNames={{ key: 'id', title: 'dept_name' }} placeholder='请选择' />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        orgForm.validate().then(async (values) => {
          if (type === 'edit') {
            values.id = e?.dataRef.id
          }
          const { code, message } = await Http.post(url, values)
          if (code === 200) {
            getOrgData()
            Message.success(message)
          }
        })
      },
    })
  }

  // 新增/编辑员工
  const onCreateMember = (type, item) => {
    memberForm.resetFields()
    let obj = {}
    let url = null
    if (type === 'add') {
      url = '/system/user/add'
      obj = {}
    }
    if (type === 'edit') {
      url = '/system/user/edit'
      obj = { ...item }
    }
    memberForm.setFieldsValue(obj)

    Modal.confirm({
      title: (type === 'add' ? '新增' : '编辑') + '员工',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: <CreateForm form={memberForm} />,
      onOk: () => {
        memberForm.validate().then(async (values) => {
          if (type === 'add') {
            values.status = 2
          }
          if (type === 'edit') {
            values.id = item.id
            values.status = item.status
          }
          const { code, message } = await Http.post(url, values)
          if (code === 200) {
            onChangeSearch(tableData?.current || 1)
            Message.success(message)
          }
        })
      },
    })
  }

  // 删除部门
  const onDelete = async (e) => {
    const item = e.dataRef
    const { code, message } = await Http.post('/system/dept/del', { id: item.id })
    if (code === 200) {
      getOrgData()
      Message.success(message)
    }
  }

  return (
    <>
      <div className='flex h-full gap-2'>
        <Card bordered={false} className='w-1/4'>
          <div className='mb-2 flex justify-end'>
            <Button type='text' icon={<IconPlus />} onClick={() => onCreateOrg('add')}>
              新增部门
            </Button>
          </div>
          {orgData.length > 0 && (
            <Tree
              blockNode
              renderExtra={(node) => (
                <div className='settings'>
                  <Dropdown
                    trigger='click'
                    position='bottom'
                    droplist={
                      <Menu>
                        <Menu.Item key='1' onClick={() => onCreateOrg('edit', node)}>
                          编辑
                        </Menu.Item>
                        <Menu.Item key='2' onClick={() => onDelete(node)}>
                          删除
                        </Menu.Item>
                      </Menu>
                    }>
                    <IconSettings />
                  </Dropdown>
                </div>
              )}
              fieldNames={{ key: 'id', title: 'dept_name' }}
              treeData={orgData}
              expandedKeys={expandedKeys}
              onExpand={(e) => setExpandedKeys(e)}
              selectedKeys={orgSelected}
              onSelect={(e) => selectOrg(e)}
            />
          )}
        </Card>
        <Card bordered={false} className='w-3/4'>
          <div className='mb-2 flex items-start justify-between'>
            <Form layout='inline' autoComplete='off' form={searchForm} onChange={() => onChangeSearch(1)}>
              <Form.Item field='content'>
                <Input allowClear placeholder='请输入内容' />
              </Form.Item>
            </Form>
            <Space>
              <Button type='primary' size='small' status='primary' icon={<IconPlus />} onClick={() => onCreateMember('add')}>
                新增员工
              </Button>
            </Space>
          </div>

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
      </div>
    </>
  )
}
export default HrmOrg
