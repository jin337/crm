import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Grid,
  Input,
  InputNumber,
  Modal,
  Radio,
  Space,
  Switch,
} from '@arco-design/web-react'
import { IconPlus, IconSettings } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// 组件
import components from 'src/config/components'
const { IconCustom } = components
const Application = () => {
  const linkTo = Hooks.useLink()
  const common = useSelector((state) => state.common)
  const [appsForm] = Form.useForm()

  const [apps, setApps] = useState([])

  useEffect(() => {
    setApps(common.initMenuData)
  }, [common?.initMenuData])

  // 修改状态
  const onChange = (type, item) => {
    if (!type) {
      Modal.confirm({
        simple: false,
        title: '提示',
        content: `停用${item.title}后，企业所有员工将无法使用此功能。确定要停用吗？`,
      })
    }
  }

  const openSetting = (item) => {
    linkTo({
      path: `/system/app/manage/${item.permission}`,
      state: item,
    })
  }

  // 新增应用
  const onCreate = () => {
    appsForm.resetFields()
    appsForm.setFieldsValue({ out_link: 0 })
    Modal.confirm({
      title: '新增应用',
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
                  <Form.Item label='菜单图标' field='is_icon'>
                    <Dropdown
                      droplist={
                        <div className='max-h-[400px] w-auto overflow-y-auto border border-[var(--border-color)] bg-white p-2'>
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
                                onClick={() => appsForm.setFieldsValue({ is_icon: item })}>
                                <IconCustom className='m-2 text-base' name={item} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      }
                      trigger='click'>
                      <Button long>
                        {values.is_icon ? (
                          <IconCustom className='text-base' name={values.is_icon} />
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
            <Form.Item label='权限标识' field='permission' rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
            <Form.Item label='排序' field='sort'>
              <InputNumber min={0} max={999} />
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
          <Form.Item label='简介' field='describe'>
            <Input.TextArea showWordLimit maxLength={10} placeholder='请输入内容' />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        appsForm.validate().then((values) => {
          const obj = {
            role_group_id: common.userInfo.main_dept_id,
            ...values,
          }
          console.log('新增应用', obj)
        })
      },
    })
  }

  return (
    <>
      <div className='mb-2 text-right'>
        <Button type='primary' size='small' icon={<IconPlus />} onClick={onCreate}>
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
                    <IconCustom name='IconFile' />
                  </Avatar>
                  <div>
                    <div className='font-bold'>{item.title}</div>
                    <div className='text-[var(--color-text-3)]'>{item.describe}</div>
                  </div>
                </div>
                <Space>
                  <IconSettings
                    className='cursor-pointer text-xl opacity-0 group-hover:opacity-100'
                    onClick={() => openSetting(item)}
                  />
                  <Switch checked onChange={(e) => onChange(e, item)} />
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
