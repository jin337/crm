import { Button, Card, Form, Input, Space, Table, Tree } from '@arco-design/web-react'
import { IconPlus, IconRefresh, IconSearch } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// 接口
import Http from 'src/service/api'
const HrmOrg = () => {
  const { title } = useSelector((state) => state.common)

  const [formSearch] = Form.useForm()

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
      dataIndex: 'name2',
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
  const onChangeSearch = (e) => {
    if (e === 'refresh') {
      formSearch.resetFields()
    } else {
      let obj = { ...formSearch.getFields() }
      console.log(obj)
    }
  }

  return (
    <>
      <div className='flex h-full gap-2'>
        <Card bordered={false} className='w-1/4'>
          <div className='flex items-center justify-between gap-1'>
            <span>企业架构</span>
            <Button type='text' icon={<IconPlus />}>
              创建部门
            </Button>
          </div>
          {orgData.length > 0 && (
            <Tree
              treeData={[{ key: '0', title: title, children: orgData }]}
              selectedKeys={orgSelected}
              onSelect={setOrgSelected}
            />
          )}
        </Card>
        <Card bordered={false} className='w-3/4'>
          <div className='mb-2 flex items-start justify-between'>
            <Form layout='inline' autoComplete='off' form={formSearch} initialValues={{ type: 'title' }}>
              <Form.Item label='关键字' field='keyword'>
                <Input placeholder='关键字' />
              </Form.Item>
            </Form>
            <Space>
              <Button type='primary' size='small' icon={<IconSearch />} onClick={onChangeSearch}>
                查询
              </Button>
              <Button type='secondary' size='small' icon={<IconRefresh />} onClick={() => onChangeSearch('refresh')}>
                重置
              </Button>
              <Button type='primary' size='small' status='success' icon={<IconPlus />}>
                新建员工
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
