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
export default Information
