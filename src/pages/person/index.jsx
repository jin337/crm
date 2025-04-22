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
            <Form.Item label='用户名' field={'user_name'} rules={[{ required: true, message: '用户名不能为空' }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
            <Form.Item label='账号' field={'user_account'} rules={[{ required: true, message: '账号不能为空' }]}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className={styles['online']}>
            <Form.Item label='性别' field={'user_sex'}>
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
            <Form.Item label='手机号' field={'user_mobile'} rules={[{ required: true, message: '手机号不能为空' }]}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className={styles['online']}>
            <Form.Item label='主部门' field={'user_dept_main'}>
              <Input disabled />
            </Form.Item>
            <Form.Item label='附属部门' field={'user_depts'}>
              <Input disabled />
            </Form.Item>
          </div>
          <Form.Item label='岗位' field={'job'}>
            <Input disabled />
          </Form.Item>
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
  const submitPsw = async () => {
    const result = await passwordForm.validate()
    const { new_pass1, ...rest } = result
    console.log('修改密码', rest)
  }

  return (
    <>
      <div className={styles['wrap-title']}>账号密码</div>
      <div className={styles['password-wrap']}>
        <Form layout='vertical' autoComplete='off' form={passwordForm}>
          <Form.Item label='原密码' field={'old_pass'} rules={[{ required: true, message: '原密码不能为空' }]}>
            <Input className={styles['input-width']} placeholder='请输入原密码' />
          </Form.Item>
          <div className={styles['online']}>
            <Form.Item
              className={styles['input-width']}
              label='新密码'
              field={'new_pass1'}
              rules={[{ required: true, message: '新密码不能为空' }]}>
              <Input.Password className={styles['input-width']} placeholder='请输入新密码' />
            </Form.Item>
            <div className={styles['txt']}>密码规则：6-16位，必须包含字母、数字。</div>
          </div>
          <Form.Item
            label='确认密码'
            field={'new_pass'}
            rules={[
              { required: true, message: '确认密码不能为空' },
              {
                validator: (value, callback) => {
                  if (value !== passwordForm.getFieldValue('new_pass1')) {
                    callback('两次密码不一致')
                  }
                },
              },
            ]}>
            <Input.Password className={styles['input-width']} placeholder='请再次输入确认密码' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={submitPsw}>
              保存
            </Button>
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
  const { userInfo, roles } = useSelector((state) => state.common)
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
        {select === 0 && <Information data={userInfo} />}
        {select === 1 && <Password />}
        {select === 2 && <Permissions data={roles} />}
      </div>
    </div>
  )
}
export default Person
