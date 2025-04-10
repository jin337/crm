import { Avatar, Button, Card, Form, Input, Space } from '@arco-design/web-react'
import { Fragment, useEffect, useState } from 'react'

// 接口
import Http from 'src/service/api'
// 公共方法
import { groupArrKey } from 'src/utils/common'
// 组件
import IconCustom from 'src/components/IconCustom'

const Demo = () => {
  const [formEdit] = Form.useForm()
  const [applyList, setApplyList] = useState([])

  useEffect(() => {
    // 获取流程数据
    Http.get('/mock/apply-list.json').then(({ code, data }) => {
      if (code === 200) {
        const arr = data?.list
        const groupedData = groupArrKey(arr, 'type_name')
        setApplyList(groupedData || [])
      }
    })
  }, [])

  // 查询事件
  const onChangeSearch = (e) => {
    console.log('e', e)
  }

  return (
    <>
      <Card bordered={false}>
        <div className='mb-5 flex items-start justify-between'>
          <Input.Search style={{ width: 290 }} placeholder='请输入名称' searchButton onSearch={onChangeSearch} />
          <Space>
            {applyList?.map((item, index) => (
              <Button key={index} href={'#' + item.type_name}>
                {item.type_name}
              </Button>
            ))}
          </Space>
        </div>
        {applyList?.map((item, index) => (
          <div key={index} className='mb-5'>
            <div className='mb-2' id={item.type_name}>
              {item.type_name}
            </div>
            <div className='flex flex-wrap gap-3'>
              {item?.data.map((e, i) => (
                <Fragment key={i}>
                  <div className='w-[24%] cursor-pointer rounded bg-[var(--default-bg)] p-3 hover:bg-[var(--hover-color)]'>
                    <Avatar size={32} shape='square' className='mr-2 !bg-[rgb(var(--primary-6))]'>
                      <IconCustom name='IconFile' />
                    </Avatar>
                    {e.title}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </>
  )
}
export default Demo
