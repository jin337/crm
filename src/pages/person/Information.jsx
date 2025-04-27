import { Button, Form, Input, Select } from '@arco-design/web-react'
import { useEffect } from 'react'

// 样式
import styles from './index.module.scss'

// 个人信息
const Information = ({ data }) => {
  const [informationForm] = Form.useForm()

  useEffect(() => {
    informationForm.setFieldsValue(data)
  }, [data])

  const submit = async () => {
    const result = await informationForm.validate()
    console.log('保存', result)
  }

  return (
    <>
      <div className={styles['wrap-title']}>个人信息</div>
      <div className={styles['information-wrap']}>
        <Form
          layout='vertical'
          autoComplete='off'
          form={informationForm}
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <div className={styles['online']}>
            <Form.Item label='登录名' field={'user_name'} rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
            <Form.Item label='账号名' field={'user_account'} rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
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
            <Form.Item label='手机号' field={'user_mobile'} rules={[{ required: true }]}>
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
            <Button type='primary' onClick={submit}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default Information
