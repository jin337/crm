import { Avatar, Button, Form, Input, Select, Table } from '@arco-design/web-react'
import { IconUser } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// 组件
import { IconCustom } from 'src/components'
// 样式
import styles from './index.module.scss'

const list = [
  {
    id: 1,
    title: '个人信息',
    icon: 'IconUser',
  },
  {
    id: 2,
    title: '账号密码',
    icon: 'IconLock',
  },
  {
    id: 3,
    title: '权限信息',
    icon: 'IconIdcard',
  },
]

// 个人信息
const Information = ({ data }) => {
  const [informationForm] = Form.useForm()

  useEffect(() => {
    informationForm.setFieldsValue(data)
  }, [data])

  return (
    <>
      <div className={styles['wrap-title']}>个人信息</div>
      <div className={styles['information-wrap']}>
        <Form layout='vertical' autoComplete='off' form={informationForm}>
          <div className={styles['online']}>
            <Form.Item label='姓名' field={'user_name'} rules={[{ required: true, message: '姓名不能为空' }]}>
              <Input placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item
              label='手机号(登录名)'
              field={'user_mobile'}
              rules={[{ required: true, message: '手机号(登录名)不能为空' }]}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className={styles['online']}>
            <Form.Item label='性别' field={'gender'}>
              <Select
                options={[
                  {
                    label: '男',
                    value: 1,
                  },
                  {
                    label: '女',
                    value: 2,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label='机构' field={'org'}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className={styles['online']}>
            <Form.Item label='部门' field={'department'}>
              <Input disabled />
            </Form.Item>
            <Form.Item label='岗位' field={'job'}>
              <Input disabled />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type='primary'>保存</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
// 账号密码
const Password = () => {
  const [passwordForm] = Form.useForm()

  return (
    <>
      <div className={styles['wrap-title']}>账号密码</div>
      <div className={styles['password-wrap']}>
        <Form layout='vertical' autoComplete='off' form={passwordForm}>
          <Form.Item label='原密码' field={'username'} rules={[{ required: true, message: '原密码不能为空' }]}>
            <Input className={styles['input-width']} placeholder='请输入原密码' />
          </Form.Item>
          <div className={styles['online']}>
            <Form.Item
              className={styles['input-width']}
              label='新密码'
              field={'password'}
              rules={[
                { required: true, message: '新密码不能为空' },
                {
                  validator: async (value, callback) => {
                    return new Promise((resolve) => {
                      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/
                      if (!regex.test(value)) {
                        setTimeout(() => {
                          callback('新密码需要是：6-16位，必须包含字母、数字')
                          resolve()
                        }, 1000)
                      } else {
                        resolve()
                      }
                    })
                  },
                },
              ]}>
              <Input.Password className={styles['input-width']} placeholder='请输入新密码' />
            </Form.Item>
            <div className={styles['txt']}>密码规则：6-16位，必须包含字母、数字。</div>
          </div>
          <Form.Item
            label='确认密码'
            field={'password2'}
            rules={[
              { required: true, message: '确认密码不能为空' },
              {
                validator: async (value, callback) => {
                  return new Promise((resolve) => {
                    if (value !== passwordForm.getFieldValue('password')) {
                      setTimeout(() => {
                        callback('两次密码不一致')
                        resolve()
                      }, 1000)
                    } else {
                      resolve()
                    }
                  })
                },
              },
            ]}>
            <Input.Password className={styles['input-width']} placeholder='请再次输入确认密码' />
          </Form.Item>
          <Form.Item>
            <Button type='primary'>保存</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
// 权限信息
const Permissions = ({ data = [] }) => {
  // 表头
  const columns = [
    {
      title: '机构/部门/岗位',
      dataIndex: 'dept_name',
    },
    {
      title: '角色',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render: (_, record) => (
        <Button type='text' size='mini'>
          切换
        </Button>
      ),
    },
  ]

  return (
    <>
      <div className={styles['wrap-title']}>权限信息</div>
      <Table borderCell rowKey={'dept_id'} columns={columns} data={data} pagination={false} />
    </>
  )
}
const Person = () => {
  const { userInfo } = useSelector((state) => state.common)
  const [navList, setNavList] = useState(list)
  const [select, setSelect] = useState(0)

  return (
    <div className={styles['person-wrap']}>
      <div className={styles['left-wrap']}>
        <div className={styles['user-box']}>
          <Avatar className={styles['icon']}>
            <IconUser />
          </Avatar>
          {userInfo?.name}
        </div>
        <ul className={styles['nav-list']}>
          {navList.map((item, index) => (
            <li
              key={item.id}
              className={`${styles['nav-list-item']} ${select === index ? styles['active'] : ''}`}
              onClick={() => setSelect(index)}>
              <IconCustom name={item.icon} className={styles['icon']} />
              <div className={styles['text']}>{item.title}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles['right-wrap']}>
        {select === 0 && <Information data={userInfo?.user_info} />}
        {select === 1 && <Password />}
        {select === 2 && <Permissions data={userInfo?.roles} />}
      </div>
    </div>
  )
}
export default Person
