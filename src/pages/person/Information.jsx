import { Form, Input, Select } from '@arco-design/web-react'
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
          disabled
          layout='vertical'
          autoComplete='off'
          form={informationForm}
          validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
          <div className={styles['online']}>
            <Form.Item label='姓名' field={'user_name'} rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
            <Form.Item label='账号名' field={'user_account'} rules={[{ required: true }]}>
              <Input placeholder='请输入内容' />
            </Form.Item>
          </div>
          <div className={styles['online']}>
            <Form.Item label='性别' field={'sex'}>
              <Select
                options={[
                  {
                    label: '男',
                    value: 0,
                  },
                  {
                    label: '女',
                    value: 1,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label='手机号' field={'mobile'} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>
          <div className={styles['online']}>
            <Form.Item label='主部门' field={'main_dept_name'}>
              <Input />
            </Form.Item>
            <Form.Item label='岗位' field={'user_post'}>
              <Input />
            </Form.Item>
          </div>
          {/* <Form.Item>
            <Button type='primary' onClick={submit}>
              保存
            </Button>
          </Form.Item> */}
        </Form>
      </div>
    </>
  )
}
export default Information
