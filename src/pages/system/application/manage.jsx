import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Form,
  Grid,
  Input,
  InputNumber,
  Message,
  Modal,
  Radio,
  Space,
  Table,
  Tabs,
  Tag,
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
  const [setting, setSetting] = useState([])

  const [appsForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('1')

  useEffect(() => {
    setParams(location.state?.state)
    const state = location.state?.state
    if (state) {
      onChange(activeTab, state)
    }
  }, [location])

  // 流程管理-表头
  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
      render: (_, record) => (
        <Space>
          <IconCustom name={record.menu_icon} />
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
            return <Tag color='arcoblue'>目录</Tag>
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
      title: '隐藏',
      dataIndex: 'is_hide',
      align: 'center',
      width: 70,
      render: (text, record) => (
        <Checkbox style={{ padding: 0 }} checked={text} onChange={(checked) => onChangeCheckbox('is_hide', checked, record)} />
      ),
    },
    {
      title: '启用',
      dataIndex: 'status',
      align: 'center',
      width: 70,
      render: (text, record) => (
        <Checkbox style={{ padding: 0 }} checked={text} onChange={(checked) => onChangeCheckbox('status', checked, record)} />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 70,
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      width: 60,
      render: (_, record) => (
        <Space>
          <Button type='text' size='mini' status='success' onClick={() => onCreate('add-children', record)}>
            新增
          </Button>
          <Button type='text' size='mini' disabled={record.pid === '0'} onClick={() => onCreate('edit', record)}>
            编辑
          </Button>
          <Button
            type='text'
            size='mini'
            status='danger'
            disabled={record?.children?.length || record.pid === '0' > 0}
            onClick={() => onDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // 新增&编辑
  const onCreate = (type, item) => {
    appsForm.resetFields()
    let obj = {}
    let url = null
    if (type === 'add' || type === 'add-children') {
      url = '/system/menu/add'
      obj = {
        pName: item.title,
        type: type === 'add' ? 1 : 2, //不能新建目录下的目录
        out_link: 0,
        is_hide: 0,
        status: 1,
      }
    }
    if (type === 'edit') {
      url = '/system/menu/edit'
      obj = { ...item }
    }
    appsForm.setFieldsValue(obj)
    Modal.confirm({
      title: (type === 'add' ? '新增' : '编辑') + '应用',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form
          form={appsForm}
          layout='vertical'
          autoComplete='off'
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <Form.Item label='上层菜单' field='pName' rules={[{ required: true }]} disabled>
            <Input />
          </Form.Item>
          <div className='flex gap-6'>
            <Form.Item label='类型' field='type' rules={[{ required: true }]}>
              <Radio.Group
                type='button'
                options={[
                  {
                    label: '目录',
                    value: 1,
                    disabled: type === 'add-children', //不能新建目录下的目录
                  },
                  {
                    label: '菜单',
                    value: 2,
                  },
                  {
                    label: '功能',
                    value: 3,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {(values) =>
                values.type !== 3 && (
                  <Form.Item label='菜单图标' field='menu_icon'>
                    <Dropdown
                      droplist={
                        <div className='max-h-[400px] w-auto overflow-y-auto border border-[var(--border-color)] bg-white p-2'>
                          <ul className='flex flex-wrap'>
                            {[
                              'IconHome',
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
                              'IconRobot',
                              'IconIdcard',
                              'IconStamp',
                              'IconUserGroup',
                            ]?.map((item) => (
                              <li
                                key={item}
                                className='cursor-pointer'
                                onClick={() => appsForm.setFieldsValue({ menu_icon: item })}>
                                <IconCustom className='m-2 text-base' name={item} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      }
                      trigger='click'>
                      <Button long>
                        {values.menu_icon ? (
                          <IconCustom className='text-base' name={values.menu_icon} />
                        ) : (
                          <span className='text-[var(--color-text-3)]'>请选择</span>
                        )}
                      </Button>
                    </Dropdown>
                  </Form.Item>
                )
              }
            </Form.Item>
          </div>
          <div className='flex gap-6'>
            <Form.Item label='名称' field='title' rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
            <Form.Item label='权限标识' field='permission' rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
          </div>
          <Form.Item shouldUpdate noStyle>
            {(values) =>
              values.type === 2 && (
                <Grid.Row gutter={24}>
                  <Grid.Col span={6}>
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
                  </Grid.Col>
                  <Grid.Col span={18}>
                    <Form.Item shouldUpdate noStyle>
                      {(values) => (
                        <Form.Item label='路由' field='path' rules={[{ required: true }]}>
                          <Input addBefore={values.out_link === 1 ? 'http://' : undefined} placeholder='请输入内容' />
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Grid.Col>
                </Grid.Row>
              )
            }
          </Form.Item>
          <Grid.Row gutter={24}>
            <Grid.Col span={6}>
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
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item label='是否启用' field='status' rules={[{ required: true }]}>
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
            </Grid.Col>
            <Grid.Col flex='auto'>
              <Form.Item label='排序' field='sort'>
                <InputNumber min={0} max={999} />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
        </Form>
      ),
      onOk: async () => {
        let values = await appsForm.validate()
        let valueObj = {
          app_id: item.app_id || params.id,
          pid: item.id,
          class: Number(activeTab),
          ...values,
        }

        if (type === 'edit') {
          valueObj.id = item.id
          valueObj.pid = item.pid
        }
        const { code, message } = await Http.post(url, valueObj)
        if (code === 200) {
          onChange(activeTab)
          Message.success(message)
        }
      },
    })
  }

  // 删除
  const onDelete = (item) => {
    Modal.confirm({
      title: '提醒',
      content: '是否确定删除当前项？',
      closable: true,
      wrapClassName: 'modal-wrap',
      onOk: async () => {
        const { code, message } = await Http.post('/system/menu/del', { id: item.id })
        if (code === 200) {
          onChange(activeTab)
          Message.success(message)
        }
      },
    })
  }
  // tab切换
  const onChange = async (e, state = params) => {
    setActiveTab(e)
    setSetting([])
    const { code, data } = await Http.post('/system/menu/list-by-app', { class: e, app_id: state?.id })
    if (code === 200) {
      const addKeysToMenuItems = (items) => {
        return items.map((item) => ({
          ...item,
          key: item.id,
          children: item.children ? addKeysToMenuItems(item.children) : undefined,
        }))
      }
      const list = addKeysToMenuItems(data.list || [])

      setSetting(list)
    }
  }

  // 启停菜单&隐藏菜单
  const onChangeCheckbox = async (idCode, type, item) => {
    let url = null
    let obj = {
      id: item.id,
    }
    if (idCode === 'status') {
      url = '/system/menu/change-status'
      obj.status = type === true ? 1 : 0
    }
    if (idCode === 'is_hide') {
      url = '/system/menu/hide-status'
      obj.is_hide = type === true ? 1 : 0
    }
    const { code, message } = await Http.post(url, obj)
    if (code === 200) {
      onChange(activeTab)
      Message.success(message)
    }
  }

  return (
    <>
      <Card bordered={false}>
        <Tabs
          activeTab={activeTab}
          onChange={onChange}
          extra={
            activeTab === '1' && (
              <Button size='small' type='primary' onClick={() => onCreate('add', params)}>
                新增
              </Button>
            )
          }>
          <Tabs.TabPane key='1' title='功能菜单'>
            {setting?.length > 0 && (
              <Table
                borderCell
                stripe
                defaultExpandAllRows
                rowKey='id'
                columns={columns}
                data={setting}
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
            {setting?.length > 0 && (
              <Table
                borderCell
                stripe
                defaultExpandAllRows
                rowKey='id'
                columns={columns}
                data={setting}
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
    </>
  )
}
export default Manage
