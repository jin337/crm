import { Button, Checkbox, Form, Input, Modal } from '@arco-design/web-react'
import { IconCommand, IconSafe, IconStamp } from '@arco-design/web-react/icon'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { localSetItem } from 'src/utils/common'

const Login = () => {
  const navigate = useNavigate()
  const [formLogin] = Form.useForm()
  const { logo, title } = useSelector((state) => state.common)

  const [isChecked, setIsChecked] = useState(false)

  // 登录判断
  const submit = async () => {
    const data = await formLogin.validate()
    if (data) {
      if (isChecked) {
        handleLogin(data)
      } else {
        Modal.confirm({
          title: '提醒',
          content: (
            <div>
              请阅读并同意<span className='link'>《用户协议》和《隐私条款》</span>
            </div>
          ),
          okText: '已阅读并登录',
          icon: null,
          closable: true,
          wrapClassName: 'modal-wrap',
          onOk: () => {
            setIsChecked(true)
            handleLogin(data)
          },
        })
      }
    }
  }

  // 登录
  const handleLogin = (e) => {
    const user = {
      role: 1,
      name: 'Admin',
      phone: '13888888888',
      gender: 1,
      department: '研发部',
      job: '前端',
      higher_up: '王主管',
      token: 'ABCDEFG',
      theme: {
        header: '#304156',
        button: '#165DFF',
      },
    }
    // 登录，保存登录状态
    localSetItem('AUTHTOKEN', user, 3600000) // 1小时过期
    navigate('/')
  }

  return (
    <div className='login-wrap'>
      <div className='login-cover'>
        <div className='login-cover-content'>
          <div className='logo'>
            <img src={logo} alt={title} />
            <div className='text'>{title}</div>
          </div>
          <div className='list'>
            <div className='title'>
              <IconCommand className='icon' />
              工程管理
            </div>
            <div className='stitle'>
              借助360°客户全景画像，深入洞察客户需求，有效提升客户跟进效率，从而提高客户满意度和业务成交率。
            </div>
            <div className='title'>
              <IconSafe className='icon' />
              财务管理
            </div>
            <div className='stitle'>
              搭载深度数据分析工具，为企业提供精准的市场趋势预测和销售业绩评估，助力企业制定数据驱动的战略决策。
            </div>
            <div className='title'>
              <IconStamp className='icon' />
              OA
            </div>
            <div className='stitle'>
              支持高度自定义配置，适应企业特定业务流程，无缝对接现有工作模式，显著提高运营效率，降低成本。
            </div>
          </div>
        </div>
      </div>
      <div className='login-form'>
        <div className='login-form-content'>
          <div className='form-title'>欢迎登录系统</div>
          <Form size='large' layout='vertical' autoComplete='off' form={formLogin}>
            <Form.Item label='用户名' field={'username'} rules={[{ required: true, message: '用户名不能为空' }]}>
              <Input placeholder='请输入用户名/手机号' />
            </Form.Item>
            <Form.Item label='密码' field={'password'} rules={[{ required: true, message: '密码不能为空' }]}>
              <Input.Password placeholder='请输入密码/验证码' />
            </Form.Item>
            <Form.Item>
              <Checkbox checked={isChecked} onChange={(checked) => setIsChecked(checked)}>
                我已阅读，同意并接受<span className='link'>《用户协议》和《隐私条款》</span>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type='primary' long onClick={submit}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
export default Login
