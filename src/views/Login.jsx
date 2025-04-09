import { Button, Checkbox, Form, Input } from '@arco-design/web-react'
import { IconCommand, IconSafe, IconStamp } from '@arco-design/web-react/icon'
import {} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { localSetItem } from 'src/utils/common'
const Login = () => {
  const navigate = useNavigate()
  const [formLogin] = Form.useForm()
  const { logo, title } = useSelector((state) => state.common)

  const submit = async () => {
    const data = await formLogin.validate()
    if (data) {
      const user = {
        name: 'Admin',
        role: 1,
        token: 'ABCDEFG',
        theme: '#0052CC',
        presetColors: ['#165DFF', '#0052CC', '#304156', '#00b796', '#FC750D'], // 预设颜色
      }
      // 登录，保存登录状态
      localSetItem('AUTHTOKEN', user, 3600000) // 1小时过期
      navigate('/')
    }
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
            <Form.Item label='用户名' field={'username'} required>
              <Input placeholder='请输入用户名/手机号' />
            </Form.Item>
            <Form.Item label='密码' field={'password'} required>
              <Input.Password placeholder='请输入密码/验证码' />
            </Form.Item>
            <Form.Item>
              <Checkbox>
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
