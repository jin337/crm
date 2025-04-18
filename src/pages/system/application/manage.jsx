import {
  Button,
  Card,
  Checkbox,
  Drawer,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Space,
  Table,
  Tabs,
  Tag,
  TreeSelect,
} from '@arco-design/web-react'
import { IconDown, IconRight } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

// 组件
import { IconCustom } from 'src/components'
// 接口
import Http from 'src/service/api'

const Manage = () => {
  const location = useLocation()
  const [params, setParams] = useState()
  const [appsTable, setAppsable] = useState([])
  const [systemTable, setSystemTable] = useState([])

  const [formItem] = Form.useForm()
  const [visibleEdit, setVisibleEdit] = useState(false)

  useEffect(() => {
    setParams(location.state?.state)
    const permission = location.state?.state.permission
    if (permission) {
      Http.get('/mock/menu.json').then(({ code, data }) => {
        if (code === 200) {
          let arr = [...data.left, ...data.right].filter((e) => e.permission === permission) || []
          const addKeysToMenuItems = (items) => {
            return items.map((item) => ({
              ...item,
              key: item.id,
              children: item.children ? addKeysToMenuItems(item.children) : undefined,
            }))
          }
          const list = addKeysToMenuItems(arr)
          setAppsable(list)
          setSystemTable(list)
        }
      })
    }
  }, [location])

  // 流程管理-表头
  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
      render: (_, record) => (
        <Space>
          <IconCustom name={record.is_icon} />
          {record.title}
          {record.describe && '：' + record.describe}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      width: 60,
      render: (text) => {
        switch (text) {
          case 1:
            return <Tag color='arcoblue'>应用</Tag>
          case 2:
            return <Tag color='green'>菜单</Tag>
          case 3:
            return <Tag color='gray'>功能</Tag>
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
      width: 74,
      render: (text) => <Checkbox checked={text} />,
    },
    {
      title: '外链',
      dataIndex: 'out_link',
      align: 'center',
      width: 70,
      render: (text) => <Checkbox checked={text} />,
    },
    {
      title: '启用',
      dataIndex: 'is_open',
      align: 'center',
      width: 70,
      render: (text) => <Checkbox checked={text} />,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 70,
    },
    {
      title: '创建时间',
      dataIndex: 'start_time',
      align: 'center',
      width: 160,
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

  // 新建&编辑
  const editItem = (type, record) => {
    setVisibleEdit(true)
    formItem.resetFields()
    if (type === 'add') {
      formItem.setFieldsValue({
        pid: record.id,
        type: 2,
        out_link: 0,
        is_hide: 0,
        is_open: 1,
      })
    }
    if (type === 'edit') {
      const obj = {
        ...record,
      }
      formItem.setFieldsValue(obj)
    }
  }

  return (
    <>
      <Card bordered={false}>
        <Tabs defaultActiveTab='1'>
          <Tabs.TabPane key='1' title='功能菜单'>
            {appsTable?.length > 0 && (
              <Table
                borderCell
                stripe
                defaultExpandAllRows
                rowKey='id'
                columns={columns}
                data={appsTable}
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
          </Tabs.TabPane>
          <Tabs.TabPane key='2' title='配置菜单'>
            {systemTable?.length > 0 && (
              <Table
                borderCell
                stripe
                defaultExpandAllRows
                rowKey='id'
                columns={columns}
                data={systemTable}
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
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 编辑 */}
      <Drawer
        width={'50%'}
        title='配置信息'
        visible={visibleEdit}
        onOk={() => setVisibleEdit(false)}
        onCancel={() => setVisibleEdit(false)}>
        <Form
          form={formItem}
          layout='vertical'
          autoComplete='off'
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <Form.Item shouldUpdate noStyle>
            {(values) =>
              values.type !== 1 && (
                <Form.Item label='上层菜单' field='pid' rules={[{ required: true }]} disabled>
                  <TreeSelect treeData={[{ key: '0', title: '主类目', children: appsTable }]} />
                </Form.Item>
              )
            }
          </Form.Item>
          <div className='flex gap-4'>
            <Form.Item shouldUpdate noStyle>
              {(values) => (
                <Form.Item label='类型' field='type' rules={[{ required: true }]}>
                  <Radio.Group
                    type='button'
                    options={[
                      {
                        label: '应用',
                        value: 1,
                        disabled: [2, 3].includes(values.type),
                      },
                      {
                        label: '菜单',
                        value: 2,
                        disabled: values.type === 1,
                      },
                      {
                        label: '功能',
                        value: 3,
                        disabled: values.type === 1,
                      },
                    ]}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {(values) =>
                values.type !== 3 && (
                  <Form.Item label='菜单图标' field='is_icon'>
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
          <div className='flex gap-4'>
            <Form.Item label='名称' field='title' rules={[{ required: true }]}>
              <Input placeholder='请输入名称……' />
            </Form.Item>
            <Form.Item label='权限标识' field='permission' rules={[{ required: true }]}>
              <Input placeholder='请输入权限标识……' />
            </Form.Item>
          </div>
          <Form.Item shouldUpdate noStyle>
            {(values) =>
              values.type !== 3 && (
                <>
                  <Form.Item label='是否外链' field='out_link' rules={[{ required: true }]}>
                    <Radio.Group
                      type='button'
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
                  <Form.Item label='路由' field='path'>
                    <Input addBefore={values.out_link === 1 ? 'http://' : undefined} placeholder='请输入路由……' />
                  </Form.Item>
                </>
              )
            }
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {(values) =>
              values.type !== 1 && (
                <Form.Item label='菜单隐藏' field='is_hide' rules={[{ required: true }]}>
                  <Radio.Group
                    type='button'
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
          <Form.Item label='是否启用' field='is_open' rules={[{ required: true }]}>
            <Radio.Group
              type='button'
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
          <Form.Item label='排序' field='sort'>
            <InputNumber min={0} max={999} />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {(values) =>
              values.type === 1 && (
                <Form.Item label='简介' field='describe'>
                  <Input.TextArea showWordLimit maxLength={10} placeholder='请输入简介……' />
                </Form.Item>
              )
            }
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
export default Manage
