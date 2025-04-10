import { Avatar, Card, Modal, Switch, Tabs } from '@arco-design/web-react'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// 组件
import IconCustom from 'src/components/IconCustom'
const Application = () => {
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

  return (
    <Tabs defaultActiveTab='1'>
      <Tabs.TabPane key='1' title='核心应用'>
        <div className='flex flex-wrap gap-3'>
          {apps.map((item) => (
            <Fragment key={item.id}>
              <Card className='w-[calc(50%-6px)]'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Avatar size={32} shape='square' className='mr-2 bg-[rgb(var(--primary-6))]'>
                      <IconCustom name='IconFile' />
                    </Avatar>
                    <div>
                      <div className='font-bold'>{item.title}</div>
                      <div className='text-[var(--color-text-3)]'>{item.describe}</div>
                    </div>
                  </div>
                  <Switch checked onChange={(e) => onChange(e, item)} />
                </div>
              </Card>
            </Fragment>
          ))}
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane key='2' title='已停用的应用'>
        <div className='flex flex-wrap gap-3'>
          {apps.map((e) => (
            <Fragment key={e.id}>
              <Card className='w-[calc(50%-6px)]'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Avatar size={32} shape='square' className='mr-2 bg-[rgb(var(--primary-6))]'>
                      <IconCustom name='IconFile' />
                    </Avatar>
                    <div>
                      <div className='font-bold'>{e.title}</div>
                      <div className='text-[var(--color-text-3)]'>{e.describe}</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Card>
            </Fragment>
          ))}
        </div>
      </Tabs.TabPane>
    </Tabs>
  )
}
export default Application
