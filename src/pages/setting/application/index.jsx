import { Avatar, Button, Card, Modal, Space, Switch } from '@arco-design/web-react'
import { IconSettings } from '@arco-design/web-react/icon'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// hooks
import { useLink } from 'src/hooks'
// 组件
import { IconCustom } from 'src/components'
const Application = () => {
  const linkTo = useLink()
  const common = useSelector((state) => state.common)
  const [apps, setApps] = useState([])

  useEffect(() => {
    setApps([...common.initMenuData, ...common.systemMenuData])
  }, [common?.initMenuData, common?.systemMenuData])

  // 修改状态
  const onChange = (type, item) => {
    if (!type) {
      Modal.confirm({
        simple: false,
        title: '提示',
        content: `停用${item.title}后，企业所有员工将无法使用此功能。确定要停用吗？`,
      })
    }
  }

  const openSetting = (item) => {
    linkTo({
      path: `/setting/app/manage/${item.permission}`,
      state: item,
    })
  }

  return (
    <>
      <div className='mb-2 text-right'>
        <Button type='primary' size='small'>
          新建应用
        </Button>
      </div>
      <div className='flex flex-wrap gap-3'>
        {apps.map((item) => (
          <Fragment key={item.id}>
            <Card className='w-[calc(50%-6px)]'>
              <div className='group flex items-center justify-between'>
                <div className='flex items-center'>
                  <Avatar size={32} shape='square' className='mr-2 !bg-[rgb(var(--primary-6))]'>
                    <IconCustom name='IconFile' />
                  </Avatar>
                  <div>
                    <div className='font-bold'>{item.title}</div>
                    <div className='text-[var(--color-text-3)]'>{item.describe}</div>
                  </div>
                </div>
                <Space>
                  <IconSettings
                    className='cursor-pointer text-xl opacity-0 group-hover:opacity-100'
                    onClick={() => openSetting(item)}
                  />
                  <Switch checked onChange={(e) => onChange(e, item)} />
                </Space>
              </div>
            </Card>
          </Fragment>
        ))}
      </div>
    </>
  )
}
export default Application
