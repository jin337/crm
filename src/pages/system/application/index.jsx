import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Grid,
  Input,
  Message,
  Modal,
  Radio,
  Space,
  Switch,
  Tooltip,
  Typography,
} from '@arco-design/web-react'
import { IconClose, IconEdit, IconPlus, IconSettings, IconSync } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
// 组件
import { IconCustom } from 'src/components'
const Application = () => {
  const navigate = useNavigate()
  const linkTo = Hooks.useLink()
  const [appsForm] = Form.useForm()

  const [apps, setApps] = useState([])

  /*
    ！！！注意：
    当前页面涉及影响系统菜单和元素过多，增删改查需刷新页面 navigate(0)
  */

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
    let obj = {}
    let url = null
    if (type === 'add') {
      url = '/system/app/add'
      obj = { out_link: 0, app_type: 0 }
    }
    if (type === 'edit') {
      url = '/system/app/edit'
      obj = { ...item }
    }
    appsForm.setFieldsValue(obj)
    Modal.confirm({
      title: (type === 'edit' ? '编辑' : '新增') + '应用',
      icon: null,
      closable: true,
      wrapClassName: 'modal-wrap',
      content: (
        <Form
          size='small'
          form={appsForm}
          layout='vertical'
          autoComplete='off'
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <Form.Item label='应用名称' field='title' rules={[{ required: true }]}>
            <Input showWordLimit maxLength={10} placeholder='请输入内容' />
          </Form.Item>
          <Grid.Row gutter={24}>
            <Grid.Col span={18}>
              <Form.Item label='应用简称' field='app_abbr' rules={[{ required: true }]}>
                <Input placeholder='请输入内容' showWordLimit maxLength={4} />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item shouldUpdate noStyle>
                {(values) =>
                  values?.type !== 3 && (
                    <Form.Item label='应用图标' field='app_icon'>
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
                                'IconCommand',
                                'IconSafe',
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
                          {values?.app_icon ? (
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
            </Grid.Col>
          </Grid.Row>
          <div className='flex gap-6'>
            <Form.Item label='应用编码' field='app_code' rules={[{ required: true }]}>
              <Input disabled={type === 'edit'} placeholder='请输入内容' />
            </Form.Item>
            <Form.Item
              extra={
                type === 'edit' && (
                  <Space className='w-full justify-end'>
                    <IconSync className='cursor-pointer' />
                    <Typography.Text
                      copyable={{
                        text: appsForm.getFieldValue('app_key'),
                        tooltipProps: { className: 'break-keep' },
                      }}></Typography.Text>
                  </Space>
                )
              }
              label='AppKey'
              field='app_key'
              rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
          </div>
          <div className='flex gap-6'>
            <Form.Item label='内部应用' field='app_type' rules={[{ required: true }]}>
              <Radio.Group
                options={[
                  {
                    label: '是',
                    value: 0,
                  },
                  {
                    label: '否',
                    value: 1,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label='是否外链' field='out_link' rules={[{ required: true }]}>
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
          </div>
          <Form.Item label='应用描述' field='remark'>
            <Input.TextArea showWordLimit maxLength={20} placeholder='请输入内容' />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        let values = await appsForm.validate()
        if (type === 'add') {
          values.status = 1
        }
        if (type === 'edit') {
          values.id = item.id
          values.status = item.status
        }
        const { code, message } = await Http.post(url, values)
        if (code === 200) {
          Message.success({
            content: message + '，1秒后刷新数据',
            duration: 1000,
            onClose: () => navigate(0),
          })
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
        const { code, message } = await Http.post('/system/app/del', { id: item.id })
        if (code === 200) {
          Message.success({
            content: message + '，1秒后刷新数据',
            duration: 1000,
            onClose: () => navigate(0),
          })
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
                    <div className='text-[var(--color-text-3)]'>{item.remark}</div>
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
