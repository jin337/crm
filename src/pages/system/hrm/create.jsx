import { Form, Input, Message, Modal, Select, TreeSelect } from '@arco-design/web-react'
import {} from 'react'

const Create = ({ form, data = [] }) => {
  // 验证手机号
  const onBlur = async () => {
    const values = await form.validate(['user_mobile'])
    if (values) {
      // 验证账号
      const { code, data, message } = await Http.post('/system/account/check', { content: values['user_mobile'] })
      if (code === 200) {
        if (data) {
          if (data.is_use === 1) {
            Message.warning(message)
            form.setFieldValue('user_mobile', '')
          } else {
            Modal.confirm({
              title: '手机号已存在',
              closable: false,
              wrapClassName: 'modal-wrap',
              content: '是否同步当前账号?',
              onOk: () => {
                form.setFieldValue('user_name', data.account_name)
                form.setFieldValue('user_account', data.login_name)
                form.setFieldValue('account_id', data.id)
              },
              onCancel: () => {
                const id = form.getFieldValue('id')
                if (!id) {
                  form.setFieldValue('user_mobile', '')
                }
              },
            })
          }
        } else {
          form.setFieldValue('account_id', '')
        }
      } else {
        form.setFieldValue('account_id', '')
      }
    } else {
      onClear()
    }
  }

  const onClear = () => {
    form.setFieldValue('account_id', '')
    form.setFieldValue('user_account', '')
    form.setFieldValue('user_name', '')
    form.setFieldValue('user_mobile', '')
  }

  return (
    <Form form={form} layout='vertical' autoComplete='off' validateMessages={{ required: (_, { label }) => `${label}是必填项` }}>
      <div className='flex gap-4'>
        <Form.Item hidden label='account_id' field='account_id'>
          <Input allowClear placeholder='请输入内容' />
        </Form.Item>
        <Form.Item label='姓名' field='user_name' rules={[{ required: true }]}>
          <Input allowClear placeholder='请输入内容' />
        </Form.Item>
        <Form.Item
          label='账号'
          field='user_account'
          disabled={form.getFieldValue('id')}
          rules={[
            { required: true },
            {
              validator: (value, callback) => {
                if (value === 'admin') {
                  callback('账号不能是 admin')
                } else if (/[\u4e00-\u9fa5]/.test(value)) {
                  callback('账号不能包含中文')
                } else {
                  callback()
                }
              },
            },
          ]}>
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
          <Input allowClear onBlur={onBlur} onClear={onClear} placeholder='请输入内容' />
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
      <Form.Item label='岗位' field='user_post'>
        <Input allowClear placeholder='请输入内容' />
      </Form.Item>
    </Form>
  )
}
export default Create
