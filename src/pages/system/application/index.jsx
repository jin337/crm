import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Grid,
  Input,
  InputNumber,
  Message,
  Modal,
  Radio,
  Space,
  Switch,
  Tooltip,
} from '@arco-design/web-react'
import { IconClose, IconEdit, IconPlus, IconSettings } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
// 组件
import { IconCustom } from 'src/components'
const Application = () => {
  const navigate = useNavigate()
  const linkTo = Hooks.useLink()
  const [appsForm] = Form.useForm()

  const [apps, setApps] = useState([])

  useEffect(() => {
    getApps()
  }, [])

  // 获取应用数据
  const getApps = async () => {
    const { code, data } = await Http.post('/system/app/list')
    if (code === 200) {
      setApps(data.list || [])
    }
  }

  // 启停应用
  const onChange = async (type, item) => {
    if (!type) {
      Modal.confirm({
        title: '提示',
        content: `停用${item.title}后，企业所有员工将无法使用此功能。确定要停用吗？`,
        icon: null,
        closable: true,
        wrapClassName: 'modal-wrap',
        onOk: async () => {
          const { code, message } = await Http.post('/system/app/change-status', { id: item.id, status: 0 })
          if (code === 200) {
            Message.success({
              content: message + '，1秒后刷新数据',
              duration: 1000,
              onClose: () => navigate(0),
            })
          }
        },
      })
    } else {
      const { code, message } = await Http.post('/system/app/change-status', { id: item.id, status: 1 })
      if (code === 200) {
        Message.success({
          content: message + '，1秒后刷新数据',
          duration: 1000,
          onClose: () => navigate(0),
        })
      }
    }
  }

  const openSetting = (item) => {
    linkTo({
      path: `/system/app/manage/${item.permission}`,
      state: item,
    })
  }

  // 新增应用
  const onCreate = (type, item) => {
    appsForm.resetFields()
    const msg = item?.id ? '编辑' : '新增'
    let obj = {}
    let url = null
    if (type === 'add') {
      url = '/system/app/add'
      obj = { out_link: 0 }
    }
    if (type === 'edit') {
      url = '/system/app/edit'
      obj = { ...item }
    }
    appsForm.setFieldsValue(obj)
    Modal.confirm({
      title: msg + '应用',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form
          form={appsForm}
          layout='vertical'
          autoComplete='off'
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <div className='flex gap-6'>
            <Form.Item label='名称' field='title' rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {(values) =>
                values.type !== 3 && (
                  <Form.Item label='菜单图标' field='app_icon'>
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
                            ]?.map((item) => (
                              <li
                                key={item}
                                className='cursor-pointer'
                                onClick={() => appsForm.setFieldsValue({ app_icon: item })}>
                                <IconCustom className='m-2 text-base' name={item} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      }
                      trigger='click'>
                      <Button long>
                        {values.app_icon ? (
                          <IconCustom className='text-base' name={values.app_icon} />
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
            <Form.Item label='AppKey' field='app_key' rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
            <Form.Item label='权限标识' field='permission' rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
          </div>
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
                  <Form.Item label='路由' field='path'>
                    <Input addBefore={values.out_link === 1 ? 'http://' : undefined} placeholder='请输入内容' />
                  </Form.Item>
                )}
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={24}>
            <Grid.Col span={6}>
              <Form.Item label='排序' field='sort'>
                <InputNumber min={0} max={999} />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={18}>
              <Form.Item label='简介' field='describe'>
                <Input showWordLimit maxLength={10} placeholder='请输入内容' />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
        </Form>
      ),
      onOk: () => {
        appsForm.validate().then(async (values) => {
          if (type === 'edit') {
            values.id = item.id
            values.status = item.status
          }
          const { code } = await Http.post(url, values)
          if (code === 200) {
            Message.success(msg + '成功')
            getApps()
          }
        })
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
        const { code, message } = await Http.post('/system/app/del', { id: item.id })
        if (code === 200) {
          getApps()
          Message.success(message)
        }
      },
    })
  }

  return (
    <>
      <div className='mb-2 text-right'>
        <Button type='primary' size='small' icon={<IconPlus />} onClick={() => onCreate('add')}>
          新增应用
        </Button>
      </div>
      <div className='flex flex-wrap gap-3'>
        {apps.map((item) => (
          <Fragment key={item.id}>
            <Card className='w-[calc(50%-6px)]'>
              <div className='group flex items-center justify-between'>
                <div className='flex items-center'>
                  <Avatar size={36} shape='square' className='mr-2 !bg-[rgb(var(--primary-6))]'>
                    <IconCustom name={item?.app_icon || 'IconFile'} />
                  </Avatar>
                  <div>
                    <div className='font-bold'>{item.title}</div>
                    <div className='text-[var(--color-text-3)]'>{item.describe}</div>
                  </div>
                </div>
                <Space>
                  {item.status === 0 && (
                    <Tooltip mini content='删除'>
                      <IconClose
                        className='cursor-pointer text-xl opacity-0 group-hover:opacity-100'
                        onClick={() => onDelete(item)}
                      />
                    </Tooltip>
                  )}
                  <Tooltip mini content='编辑'>
                    <IconEdit
                      className='cursor-pointer text-xl opacity-0 group-hover:opacity-100'
                      onClick={() => onCreate('edit', item)}
                    />
                  </Tooltip>
                  <Tooltip mini content='设置'>
                    <IconSettings
                      className='cursor-pointer text-xl opacity-0 group-hover:opacity-100'
                      onClick={() => openSetting(item)}
                    />
                  </Tooltip>
                  <Switch checked={item.status} onChange={(e) => onChange(e, item)} />
                </Space>
              </div>
            </Card>
          </Fragment>
        ))}
      </div>
    </>
  )
}
export default Application
