import { Avatar, Button, Form, Input, Select, Table } from '@arco-design/web-react'
import { IconUser } from '@arco-design/web-react/icon'
import { useState } from 'react'
import { useSelector } from 'react-redux'

// 组件
import IconCustom from 'src/components/IconCustom'

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
    icon: 'IconSwap',
  },
]

// 个人信息
const Information = () => {
  const [formInformation] = Form.useForm()
  return (
    <>
      <div className='wrap-title'>个人信息</div>
      <div className='information-wrap'>
        <Form layout='vertical' autoComplete='off' form={formInformation}>
          <div className='online'>
            <Form.Item label='姓名' field={'name2'} rules={[{ required: true, message: '姓名不能为空' }]}>
              <Input placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item label='手机号(登录名)' field={'name3'} rules={[{ required: true, message: '手机号(登录名)不能为空' }]}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className='online'>
            <Form.Item label='性别' field={'name4'}>
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
            <Form.Item label='部门' field={'name5'}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className='online'>
            <Form.Item label='岗位' field={'name6'}>
              <Input disabled />
            </Form.Item>
            <Form.Item label='直属上级' field={'name7'}>
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
      <div className='wrap-title'>账号密码</div>
      <div className='password-wrap'>
        <Form layout='vertical' autoComplete='off' form={formPassword}>
          <Form.Item label='原密码' field={'username'} rules={[{ required: true, message: '原密码不能为空' }]}>
            <Input className='input-width' placeholder='请输入原密码' />
          </Form.Item>
          <Form.Item label='新密码' field={'password'} rules={[{ required: true, message: '新密码不能为空' }]}>
            <div className='online'>
              <Input.Password className='input-width' placeholder='请输入新密码' />
              <div className='txt'>密码规则：6-16位，必须包含字母、数字。</div>
            </div>
          </Form.Item>
          <Form.Item label='确认密码' field={'password2'} rules={[{ required: true, message: '确认密码不能为空' }]}>
            <Input.Password className='input-width' placeholder='请再次输入确认密码' />
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
      title: '主部门',
      dataIndex: 'name1',
    },
    {
      title: '附属部门',
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
      code: 'op',
      align: 'center',
      width: 60,
      render: () => (
        <Button type='text' size='mini'>
          切换
        </Button>
      ),
    },
  ]
  return (
    <>
      <div className='wrap-title'>权限信息</div>
      <Table borderCell rowKey={'id'} columns={columns} data={[{ id: '111' }]} />
    </>
  )
}
const Person = () => {
  const { userInfo } = useSelector((state) => state.common)
  const [navList, setNavList] = useState(list)
  const [select, setSelect] = useState(0)

  return (
    <div className='person-wrap'>
      <div className='left-wrap'>
        <div className='user-box'>
          <Avatar className='icon'>
            <IconUser />
          </Avatar>
          {userInfo?.name}
        </div>
        <ul className='nav-list'>
          {navList.map((item, index) => (
            <li key={item.id} className={`nav-list-item ${select === index ? 'active' : ''}`} onClick={() => setSelect(index)}>
              <IconCustom name={item.icon} className='icon' />
              <div className='text'>{item.title}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className='right-wrap'>
        {select === 0 && <Information />}
        {select === 1 && <Password />}
        {select === 2 && <Permissions />}
      </div>
    </div>
  )
}
export default Person
