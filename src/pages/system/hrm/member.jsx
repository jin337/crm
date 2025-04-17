import { Button, Card, Dropdown, Form, Input, Menu, Space, Table } from '@arco-design/web-react'
import { IconMore, IconPlus, IconRefresh, IconSearch } from '@arco-design/web-react/icon'
import { useState } from 'react'
const HrmMember = () => {
  const [formSearch] = Form.useForm()

  const [dataTable, setDataTable] = useState([])

  // 流程管理-表头
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name1',
      width: 100,
      fixed: 'left',
    },
    {
      title: '手机',
      dataIndex: 'name2',
      width: 100,
    },
    {
      title: '证件类型',
      dataIndex: 'name3',
      width: 100,
    },
    {
      title: '证件号码',
      dataIndex: 'name4',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'name5',
      width: 100,
    },
    {
      title: '出生日期',
      dataIndex: 'name6',
      width: 100,
    },
    {
      title: '生日',
      dataIndex: 'name7',
      width: 100,
    },
    {
      title: '年龄',
      dataIndex: 'name8',
      width: 100,
    },
    {
      title: '是否已婚',
      dataIndex: 'name9',
      width: 100,
    },
    {
      title: '是否已育',
      dataIndex: 'name10',
      width: 100,
    },
    {
      title: '国家地区',
      dataIndex: 'name11',
      width: 100,
    },
    {
      title: '民族',
      dataIndex: 'name12',
      width: 100,
    },
    {
      title: '政治面貌',
      dataIndex: 'name13',
      width: 100,
    },
    {
      title: '籍贯',
      dataIndex: 'name14',
      width: 100,
    },
    {
      title: '户籍所在地',
      dataIndex: 'name15',
      width: 120,
    },
    {
      title: '健康状态',
      dataIndex: 'name16',
      width: 100,
    },
    {
      title: '最高学历',
      dataIndex: 'name17',
      width: 100,
    },
    {
      title: '入职日期',
      dataIndex: 'name18',
      width: 100,
    },
    {
      title: '试用期',
      dataIndex: 'name19',
      width: 100,
    },
    {
      title: '转正日期',
      dataIndex: 'name20',
      width: 100,
    },
    {
      title: '工号',
      dataIndex: 'name21',
      width: 100,
    },
    {
      title: '部门',
      dataIndex: 'name22',
      width: 100,
    },
    {
      title: '直属上级',
      dataIndex: 'name23',
      width: 100,
    },
    {
      title: '岗位',
      dataIndex: 'name24',
      width: 100,
    },
    {
      title: '职级',
      dataIndex: 'name25',
      width: 100,
    },
    {
      title: '工作地点',
      dataIndex: 'name26',
      width: 100,
    },
    {
      title: '详细工作地点',
      dataIndex: 'name27',
      width: 150,
    },
    {
      title: '工作城市',
      dataIndex: 'name28',
      width: 100,
    },
    {
      title: '招聘渠道',
      dataIndex: 'name29',
      width: 100,
    },
    {
      title: '员工状态',
      dataIndex: 'name30',
      width: 100,
    },
    {
      title: '聘用形式',
      dataIndex: 'name31',
      width: 100,
    },
    {
      title: '司龄开始日期',
      dataIndex: 'name32',
      width: 150,
    },
    {
      title: '司龄',
      dataIndex: 'name33',
      width: 100,
    },
    {
      title: '合同类型',
      dataIndex: 'name34',
      width: 100,
    },
    {
      title: '现合同结束日期',
      dataIndex: 'name35',
      width: 150,
    },
    {
      title: '现合同期限',
      dataIndex: 'name36',
      width: 150,
    },
    {
      title: '工资卡卡号',
      dataIndex: 'name37',
      width: 150,
    },
    {
      title: '工资卡开户城市',
      dataIndex: 'name38',
      width: 150,
    },
    {
      title: '银行名称',
      dataIndex: 'name39',
      width: 100,
    },
    {
      title: '工资卡开户行',
      dataIndex: 'name40',
      width: 150,
    },
    {
      title: '个人社保账号',
      dataIndex: 'name41',
      width: 150,
    },
    {
      title: '个人公积金账号',
      dataIndex: 'name42',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Dropdown
          position='br'
          droplist={
            <Menu>
              <Menu.Item key='1'>办理转正</Menu.Item>
              <Menu.Item key='2'>调整部门/岗位</Menu.Item>
              <Menu.Item key='3'>晋升/降级</Menu.Item>
              <Menu.Item key='4'>参保方案</Menu.Item>
              <Menu.Item key='5'>办理离职</Menu.Item>
            </Menu>
          }>
          <Button type='text'>
            <IconMore />
          </Button>
        </Dropdown>
      ),
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

  // 提交
  return (
    <>
      <Card bordered={false}>
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
              新建
            </Button>
          </Space>
        </div>

        <Table borderCell stripe rowKey='id' columns={columns} data={dataTable} scroll={{ x: true }} />
      </Card>
    </>
  )
}
export default HrmMember
