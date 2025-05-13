import { Form, Input, Select, TreeSelect } from '@arco-design/web-react'
import {} from 'react'

const Create = ({ form, data = [] }) => {
  return (
    <Form form={form} layout='vertical' autoComplete='off' validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
      <div className='flex gap-4'>
        <Form.Item label='姓名' field='user_name' rules={[{ required: true }]}>
          <Input allowClear placeholder='请输入内容' />
        </Form.Item>
        <Form.Item label='账号' field='user_account' rules={[{ required: true }]}>
          <Input allowClear placeholder='请输入内容' />
        </Form.Item>
      </div>
      <div className='flex gap-4'>
        <Form.Item
          label='手机号'
          field='user_mobile'
          rules={[
            { required: true },
            {
              validator: (value, callback) => {
                if (!/^1[3-9]\d{9}$/.test(value)) {
                  callback('请输入正确的11位手机号码')
                }
                callback()
              },
            },
          ]}>
          <Input allowClear placeholder='请输入内容' />
        </Form.Item>
        <Form.Item label='性别' field='user_sex' rules={[{ required: true }]}>
          <Select
            allowClear
            placeholder='请选择'
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
      </div>
      <div className='flex gap-4'>
        <Form.Item label='主部门' field='user_dept_main' rules={[{ required: true }]}>
          <TreeSelect
            allowClear
            treeData={data}
            fieldNames={{
              key: 'id',
              title: 'dept_name',
            }}
            placeholder='请选择'
          />
        </Form.Item>
        <Form.Item label='附属部门' field='user_depts'>
          <TreeSelect
            allowClear
            multiple
            treeData={data}
            fieldNames={{
              key: 'id',
              title: 'dept_name',
            }}
            placeholder='请选择'
          />
        </Form.Item>
      </div>
      <Form.Item label='岗位' field='user_post' rules={[{ required: true }]}>
        <Input allowClear placeholder='请输入内容' />
      </Form.Item>
    </Form>
  )
}
export default Create
