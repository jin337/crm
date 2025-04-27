import { Form, Grid, Input, Radio, Select } from '@arco-design/web-react'
import { } from 'react'

const Create = ({ form }) => {
  return (
    <Form form={form} layout='vertical' autoComplete='off' validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
      <div className='flex gap-6'>
        <Form.Item label='用户名' field='user_name' rules={[{ required: true }]}>
          <Input placeholder='请输入内容' />
        </Form.Item>
        <Form.Item label='手机号' field='user_mobile' rules={[{ required: true }]}>
          <Input placeholder='请输入内容' />
        </Form.Item>
      </div>
      <Grid.Row gutter={24}>
        <Grid.Col span={6}>
          <Form.Item label='性别' field='user_sex' rules={[{ required: true }]}>
            <Radio.Group
              type='button'
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
        </Grid.Col>
        <Grid.Col span={18}>
          <Form.Item label='用户账号' field='user_account' rules={[{ required: true }]}>
            <Input placeholder='请输入内容' />
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
      <div className='flex gap-6'>
        <Form.Item label='主部门' field='user_dept_main' rules={[{ required: true }]}>
          <Select options={[]} placeholder='请选择' />
        </Form.Item>
        <Form.Item label='附属部门' field='user_depts' rules={[{ required: true }]}>
          <Select options={[]} placeholder='请选择' />
        </Form.Item>
      </div>
      <Form.Item label='岗位' field='job' rules={[{ required: true }]}>
        <Input placeholder='请输入内容' />
      </Form.Item>
    </Form>
  )
}
export default Create
