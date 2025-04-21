import { Button, Card, Form, Input, Modal, Radio, Select, Space, Table, Tree } from '@arco-design/web-react'
import { IconPlus, IconSettings } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// 接口
import Http from 'src/service/api'
const HrmOrg = () => {
  const { title } = useSelector((state) => state.common)

  const [searchForm] = Form.useForm()
  const [createForm] = Form.useForm()

  const [dataTable, setDataTable] = useState([])
  const [orgData, setOrgData] = useState([])
  const [orgSelected, setOrgSelected] = useState([])

  useEffect(() => {
    Http.get('/mock/member-list.json').then(({ code, data }) => {
      if (code === 200) {
        setDataTable(data.list || [])
      }
    })
    Http.get('/mock/org-list.json').then(({ code, data }) => {
      if (code === 200) {
        setOrgData(data.list || [])
        setOrgSelected(['0'])
      }
    })
  }, [])

  // 流程管理-表头
  const columns = [
    {
      title: '姓名',
      dataIndex: 'title',
    },
    {
      title: '工号',
      dataIndex: 'name1',
    },
    {
      title: '部门',
      dataIndex: 'dept_name',
    },
    {
      title: '岗位',
      dataIndex: 'name3',
    },
    {
      title: '聘用形式',
      dataIndex: 'name4',
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

  // 新增
  const onCreate = (e) => {
    createForm.resetFields()
    let obj = {}
    if (e) {
      obj = e?.dataRef
    } else {
      obj = { dept_type: 1 }
    }
    createForm.setFieldsValue(obj)
    Modal.confirm({
      title: obj?.key ? '编辑部门' : '新增部门',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form form={createForm} layout='vertical' autoComplete='off'>
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
        createForm.validate().then((values) => {
          console.log('新增账号数据', values)
        })
      },
    })
  }

  return (
    <>
      <div className='flex h-full gap-2'>
        <Card bordered={false} className='w-1/4'>
          <div className='mb-2 flex justify-end'>
            <Button type='text' icon={<IconPlus />} onClick={() => onCreate()}>
              新增部门
            </Button>
          </div>
          {orgData.length > 0 && (
            <Tree
              blockNode
              renderExtra={(node) => (
                <div className='settings' onClick={() => onCreate(node)}>
                  <IconSettings />
                </div>
              )}
              fieldNames={{ key: 'key', title: 'dept_name' }}
              treeData={[{ key: '0', dept_name: title, children: orgData }]}
              selectedKeys={orgSelected}
              onSelect={setOrgSelected}
            />
          )}
        </Card>
        <Card bordered={false} className='w-3/4'>
          <div className='mb-2 flex items-start justify-between'>
            <Form layout='inline' autoComplete='off' form={searchForm} onChange={onChangeSearch}>
              <Form.Item field='keyword'>
                <Input.Search placeholder='请输入关键字' />
              </Form.Item>
            </Form>
            <Space>
              <Button type='primary' size='small' status='primary' icon={<IconPlus />}>
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
