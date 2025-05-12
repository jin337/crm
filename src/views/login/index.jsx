import { Button, Checkbox, Form, Input, Modal } from '@arco-design/web-react'
import { IconCommand, IconSafe, IconStamp } from '@arco-design/web-react/icon'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
// 公共方法
import { localSetItem } from 'src/utils/common'
// 样式
import styles from './index.module.scss'
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
  const handleLogin = async (e) => {
    const { code, data } = await Http.post('/login', e)
    if (code === 200) {
      localSetItem('CRMUSERDATA', data)
      navigate('/')
    }
  }

  return (
    <div className={styles['login-wrap']}>
      <div className={styles['login-cover']}>
        <div className={styles['login-cover-content']}>
          <div className={styles['logo']}>
            <img src={logo} alt={title} />
            <div className={styles['text']}>{title}</div>
          </div>
          <div className={styles['list']}>
            <div className={styles['title']}>
              <IconCommand className={styles['icon']} />
              工程管理
            </div>
            <div className={styles['stitle']}>
              实现项目全流程管控，涵盖任务分配、进度监控、资源协调等功能，支持多团队协作与工程数据可视化分析。
            </div>
            <div className={styles['title']}>
              <IconSafe className={styles['icon']} />
              财务管理
            </div>
            <div className={styles['stitle']}>
              提供费用预算、收支记录、成本分析等核心功能，集成报销审批与财务报表生成，实现企业资金全链路监管。
            </div>
            <div className={styles['title']}>
              <IconStamp className={styles['icon']} />
              审批
            </div>
            <div className={styles['stitle']}>
              搭建电子化审批工作流，支持请假、采购、合同等业务在线审批，具备流程自定义、进度追踪与审批留痕功能。
            </div>
          </div>
        </div>
      </div>
      <div className={styles['login-form']}>
        <div className={styles['login-form-content']}>
          <div className={styles['form-title']}>欢迎登录系统</div>
          <Form
            size='large'
            layout='vertical'
            autoComplete='off'
            form={formLogin}
            validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
            <Form.Item label='用户名' field={'login_name'} rules={[{ required: true }]}>
              <Input placeholder='请输入账号' />
            </Form.Item>
            <Form.Item label='密码' field={'login_pass'} rules={[{ required: true }]}>
              <Input.Password placeholder='请输入密码' />
            </Form.Item>
            <Form.Item>
              <Checkbox checked={isChecked} onChange={(checked) => setIsChecked(checked)}>
                我已阅读，同意并接受<span className={styles['link']}>《用户协议》和《隐私条款》</span>
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
