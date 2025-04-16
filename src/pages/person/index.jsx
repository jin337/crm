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
const Information = ({ userInfo }) => {
  const [formInformation] = Form.useForm()

  useEffect(() => {
    formInformation.setFieldsValue(userInfo)
  }, [userInfo])

  return (
    <>
      <div className={styles['wrap-title']}>个人信息</div>
      <div className={styles['information-wrap']}>
        <Form layout='vertical' autoComplete='off' form={formInformation}>
          <div className={styles['online']}>
            <Form.Item label='姓名' field={'name'} rules={[{ required: true, message: '姓名不能为空' }]}>
              <Input placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item label='手机号(登录名)' field={'phone'} rules={[{ required: true, message: '手机号(登录名)不能为空' }]}>
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
            <Form.Item label='部门' field={'department'}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className={styles['online']}>
            <Form.Item label='岗位' field={'job'}>
              <Input disabled />
            </Form.Item>
            <Form.Item label='直属上级' field={'higher_up'}>
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
  const [formPassword] = Form.useForm()

  return (
    <>
      <div className={styles['wrap-title']}>账号密码</div>
      <div className={styles['password-wrap']}>
        <Form layout='vertical' autoComplete='off' form={formPassword}>
          <Form.Item label='原密码' field={'username'} rules={[{ required: true, message: '原密码不能为空' }]}>
            <Input className={styles['input-width']} placeholder='请输入原密码' />
          </Form.Item>
          <Form.Item label='新密码' field={'password'} rules={[{ required: true, message: '新密码不能为空' }]}>
            <div className={styles['online']}>
              <Input.Password className={styles['input-width']} placeholder='请输入新密码' />
              <div className={styles['txt']}>密码规则：6-16位，必须包含字母、数字。</div>
            </div>
          </Form.Item>
          <Form.Item label='确认密码' field={'password2'} rules={[{ required: true, message: '确认密码不能为空' }]}>
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
const Permissions = () => {
  // 表头
  const columns = [
    {
      title: '机构',
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
      title: '角色',
      dataIndex: 'name4',
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='text' size='mini'>
            切换
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <>
      <div className={styles['wrap-title']}>权限信息</div>
      <Table borderCell rowKey={'id'} columns={columns} data={[]} pagination={false} />
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
        {select === 0 && <Information userInfo={userInfo} />}
        {select === 1 && <Password />}
        {select === 2 && <Permissions />}
      </div>
    </div>
  )
}
export default Person
