import { Button, Form, Input } from '@arco-design/web-react'

// 样式
import styles from './index.module.scss'

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
        <Form
          layout='vertical'
          autoComplete='off'
          form={passwordForm}
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <Form.Item label='原密码' field={'old_pass'} rules={[{ required: true }]}>
            <Input className={styles['input-width']} placeholder='请输入内容' />
          </Form.Item>
          <div className={styles['online']}>
            <Form.Item className={styles['input-width']} label='新密码' field={'new_pass1'} rules={[{ required: true }]}>
              <Input.Password className={styles['input-width']} placeholder='请输入内容' />
            </Form.Item>
            <div className={styles['txt']}>密码规则：6-16位，必须包含字母、数字。</div>
          </div>
          <Form.Item
            label='确认密码'
            field={'new_pass'}
            rules={[
              { required: true },
              {
                validator: (value, callback) => {
                  if (value !== passwordForm.getFieldValue('new_pass1')) {
                    callback('两次密码不一致')
                  }
                },
              },
            ]}>
            <Input.Password className={styles['input-width']} placeholder='请输入内容' />
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
export default Password
