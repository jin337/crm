import {
  Button,
  Card,
  Drawer,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  TreeSelect,
} from '@arco-design/web-react'
import { IconDown, IconRefresh, IconRight, IconSearch } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

// 组件
import IconCustom from 'src/components/IconCustom'
// 接口
import Http from 'src/service/api'

const Manage = () => {
  const location = useLocation()
  const [formSearch] = Form.useForm()
  const [params, setParams] = useState()
  const [dataTable, setDataTable] = useState([])

  const [formItem] = Form.useForm()
  const [visibleEdit, setVisibleEdit] = useState(false)

  useEffect(() => {
    setParams(location.state?.state)
    const permission = location.state?.state.permission
    if (permission) {
      Http.get('/mock/menu.json').then(({ code, data }) => {
        if (code === 200) {
          const arr = [...data.left, ...data.right].filter((e) => e.permission === permission)
          setDataTable(arr || [])
        }
      })
    }
  }, [location])

  // 流程管理-表头
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      render: (_, record) => (
        <Space>
          <IconCustom name={record.is_icon} />
          {record.title}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text) => {
        switch (text) {
          case 1:
            return <Tag color='arcoblue'>应用</Tag>
          case 2:
            return <Tag color='green'>菜单</Tag>
          case 3:
            return <Tag color='gray'>按钮</Tag>
          default:
            return <Tag>未知</Tag>
        }
      },
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
    },
    {
      title: '路由',
      dataIndex: 'path',
    },
    {
      title: '菜单隐藏',
      dataIndex: 'is_hide',
      align: 'center',
      render: (text) => <Switch size='small' checked={text} />,
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '创建时间',
      dataIndex: 'start_time',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      width: 60,
      render: (_, record) => (
        <Space>
          <Button type='text' size='mini' status='success' onClick={() => editItem('add', record)}>
            添加
          </Button>
          <Button type='text' size='mini' onClick={() => editItem('edit', record)}>
            编辑
          </Button>
          <Popconfirm focusLock title='提醒' content='是否确定删除当前项？'>
            <Button type='text' size='mini' status='danger'>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 查询条件
  const searchOptinons = [
    {
      label: '菜单名称',
      value: 'title',
    },
    {
      label: '类型',
      value: 'type',
    },
    {
      label: '权限标识',
      value: 'permission',
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

  // 新建&编辑
  const editItem = (type, record) => {
    setVisibleEdit(true)
    formItem.resetFields()

    if (type === 'add') {
      formItem.setFieldsValue({
        state: 1,
        type: 1,
      })
    }
    if (type === 'edit') {
      const obj = {
        ...record,
        pid: [record.pid],
      }
      formItem.setFieldsValue(obj)
    }
  }

  return (
    <>
      <Card bordered={false}>
        <div className='mb-2 flex items-start justify-between'>
          <Form layout='inline' autoComplete='off' form={formSearch} initialValues={{ type: 'title' }}>
            <Form.Item label='类型' field='type'>
              <Select style={{ width: 181 }} options={searchOptinons} />
            </Form.Item>
            <Form.Item label='关键字' field='keyword'>
              <Input placeholder='关键字' />
            </Form.Item>
          </Form>
          <Space>
            <Button type='primary' icon={<IconSearch />} onClick={onChangeSearch}>
              查询
            </Button>
            <Button type='secondary' icon={<IconRefresh />} onClick={() => onChangeSearch('refresh')}>
              重置
            </Button>
          </Space>
        </div>

        {dataTable.length && (
          <Table
            borderCell
            stripe
            defaultExpandAllRows
            rowKey='id'
            columns={columns}
            data={dataTable}
            pagination={false}
            expandProps={{
              icon: ({ expanded, record, ...restProps }) =>
                expanded ? (
                  <button {...restProps} className='!bg-transparent'>
                    <IconDown />
                  </button>
                ) : (
                  <button {...restProps} className='!bg-transparent'>
                    <IconRight />
                  </button>
                ),
            }}
          />
        )}
      </Card>

      {/* 编辑 */}
      <Drawer
        width={'40%'}
        title='组织信息'
        visible={visibleEdit}
        onOk={() => setVisibleEdit(false)}
        onCancel={() => setVisibleEdit(false)}>
        <Form
          form={formItem}
          layout='vertical'
          autoComplete='off'
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <Form.Item label='上层菜单' field='pid' rules={[{ required: true }]}>
            <TreeSelect treeData={[{ key: '0', title: '主类目', children: dataTable }]} />
          </Form.Item>
          <div className='flex gap-2'>
            <Form.Item label='类型' field='type' rules={[{ required: true }]}>
              <Radio.Group
                type='button'
                options={[
                  {
                    label: '应用',
                    value: 1,
                  },
                  {
                    label: '菜单',
                    value: 2,
                  },
                  {
                    label: '按钮',
                    value: 3,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {(values) =>
                values.type !== 3 && (
                  <Form.Item field='is_icon' label='菜单图标'>
                    <Dropdown
                      droplist={
                        <div className='mx-4 max-h-[400px] w-auto max-w-[calc(100%-16px)] overflow-y-auto border bg-white p-2'>
                          <ul className='flex flex-wrap'>
                            {[
                              'IconHome',
                              'IconStamp',
                              'IconPalette',
                              'IconSettings',
                              'IconFile',
                              'IconCheckCircle',
                              'IconCheckSquare',
                              'IconStar',
                              'IconClockCircle',
                              'IconCalendar',
                              'IconCalendarClock',
                              'IconHistory',
                              'IconUpload',
                              'IconApps',
                            ]?.map((item) => (
                              <li
                                key={item}
                                className='cursor-pointer'
                                onClick={() => formItem.setFieldsValue({ is_icon: item })}>
                                <IconCustom className='m-2 text-base' name={item} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      }
                      trigger='click'>
                      <Button long>
                        <IconCustom className='text-base' name={values.is_icon} />
                      </Button>
                    </Dropdown>
                  </Form.Item>
                )
              }
            </Form.Item>
          </div>
          <Form.Item label='名称' field='title' rules={[{ required: true }]}>
            <Input placeholder='请输入名称……' />
          </Form.Item>
          <Form.Item label='权限标识' field='permission' rules={[{ required: true }]}>
            <Input placeholder='请输入权限标识……' />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {(values) =>
              values.type === 2 && (
                <Form.Item label='路由' field='path' rules={[{ required: true }]}>
                  <Input placeholder='请输入路由……' />
                </Form.Item>
              )
            }
          </Form.Item>
          <div className='flex gap-2'>
            <Form.Item shouldUpdate noStyle>
              {(values) =>
                values.type !== 3 && (
                  <Form.Item label='菜单隐藏' field='is_hide' rules={[{ required: true }]}>
                    <Radio.Group
                      options={[
                        {
                          label: '是',
                          value: 1,
                        },
                        {
                          label: '否',
                          value: 0,
                        },
                      ]}
                    />
                  </Form.Item>
                )
              }
            </Form.Item>
            <Form.Item label='排序' field='sort'>
              <InputNumber min={0} max={999} />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  )
}
export default Manage
