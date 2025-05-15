import { Avatar, Button, Space, Tabs } from '@arco-design/web-react'
// 组件
import IconCustom from 'src/components/IconCustom'
const Apps = (props) => {
  const { items, onSelectMenu } = props

  const onSelectMenuChild = (e, item) => {
    e.stopPropagation()
    onSelectMenu(item)
  }
  return (
    <Tabs defaultActiveTab='1' tabPosition='left' size='large' className='h-full'>
      <Tabs.TabPane key='1' title='应用' className='h-full'>
        {items.map((item) => (
          <div
            key={item.id}
            className='mb-3 inline-block w-[calc(50%-10px)] cursor-pointer rounded border border-[var(--border-color)] px-3 align-top shadow nth-[2n]:ml-3'
            onClick={() => onSelectMenu(item)}>
            <div className='flex items-center py-3'>
              <Avatar size={36} shape='square' className='mr-2 !bg-[rgb(var(--primary-6))]'>
                <IconCustom name='IconFile' />
              </Avatar>
              <div className='text-sm'>
                <div>{item.title}</div>
                <div className='text-[var(--color-text-3)]'>{item.remark}</div>
              </div>
            </div>
            {item?.children?.length > 0 && (
              <div className='border-t border-[var(--border-color)] py-3'>
                <Space wrap>
                  {item?.children?.map((child) => (
                    <Button type='secondary' key={child.id} onClick={(e) => onSelectMenuChild(e, child)}>
                      {child.title}
                    </Button>
                  ))}
                </Space>
              </div>
            )}
          </div>
        ))}
      </Tabs.TabPane>
    </Tabs>
  )
}

export default Apps
