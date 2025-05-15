import { Avatar, Breadcrumb, Button, Empty, Input, Modal, Tabs } from '@arco-design/web-react'
import { IconCloseCircleFill, IconRight, IconUser } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// 样式
import styles from './index.module.scss'

// 公共方法

const tabs = [
  {
    id: 1,
    title: '常用',
    children: [],
  },
  {
    id: 2,
    title: '机构',
    children: [],
  },
]
const SelectUser = (props) => {
  const { id, title, select = [], mode = 'single', visible, setVisible, onChange } = props
  const { userInfo } = useSelector((state) => state.common)

  const [items, setItems] = useState(tabs)
  // 已选人员
  const [user, setUser] = useState([])
  // 当前机构内容
  const [depts, setDepts] = useState([])
  const [deptUser, setDeptsUser] = useState([])
  const [deptList, setDeptList] = useState([])

  // 员工信息
  const User = (props) => {
    const { item, close = false, size = 40, onClear, onClick } = props
    const onRemove = (e) => {
      e.stopPropagation()
      onClear()
    }
    const onSelect = (e) => {
      e.stopPropagation()
      onClick()
    }

    return (
      <div className={styles['item']} key={item.id} onClick={(e) => onSelect(e)}>
        <Avatar className={styles['icon']} size={size}>
          <IconUser />
        </Avatar>
        <div className={styles['info']}>
          <div>{item?.user_name}</div>
          <div className={styles['dept']}>{item?.dept_name || item.user_dept_main_name}</div>
        </div>
        {close && <IconCloseCircleFill className={styles['close']} onClick={(e) => onRemove(e)} />}
      </div>
    )
  }

  useEffect(() => {
    if (visible) {
      setDepts([])
      setDeptsUser([])
      getList()
    }
  }, [visible])

  useEffect(() => {
    setUser(select)
  }, [select])

  // 获取-员工树形查询
  const getList = async (content = '') => {
    setDeptsUser([])
    setDeptList([])
    const { code, data } = await Http.post('/system/user/list-tree', { content, role_id: id })
    if (code === 200) {
      if (content) {
        setDeptList(data || [])
      } else {
        setDeptsUser(data?.list || [])

        setItems((prev) =>
          prev?.map((e) => {
            if (e?.id === 2) {
              e.children = data?.list || []
            }
            return e
          })
        )
      }
    }
  }

  // 人员选择
  const onSelectUser = (item) => {
    if (mode === 'multiple') {
      setUser([...user, item])
    } else {
      setUser([item])
    }
  }
  // 机构选择
  const getDeptsItem = (item) => {
    const { children, user_children } = item
    setDepts((prev) => [...prev, item])
    setDeptsUser([...(children || []), ...(user_children || [])])
  }
  // 导航选择
  const selectDepts = (item) => {
    if (item) {
      if (item.id !== depts[depts.length - 1].id) {
        const i = depts.findIndex((e) => e.id === item.id)
        if (i !== -1) {
          setDepts((prev) => prev.slice(0, i + 1))
          setDeptsUser([...(item.children || []), ...(item.user_children || [])])
        }
      }
    } else {
      setDepts([])
      setDeptsUser(items[1].children)
    }
  }

  // 机构内容
  const DeptContent = (props) => {
    const { depts, deptUser } = props
    return (
      <>
        {depts.length > 0 && (
          <Breadcrumb className='cursor-pointer' maxCount='3' separator={<IconRight />}>
            <Breadcrumb.Item onClick={() => selectDepts()}>全部</Breadcrumb.Item>
            {depts.map((item, index) => (
              <Breadcrumb.Item key={index} onClick={() => selectDepts(item)}>
                {item.dept_name}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}
        <div className={styles['content-user']}>
          {deptUser.map((item, index) => (
            <div key={index} className='cursor-pointer'>
              {item.user_account ? (
                <User key={item.id} item={item} onClick={() => onSelectUser(item)} />
              ) : (
                <div className={styles['item']} onClick={() => getDeptsItem(item)}>
                  <div className={styles['info']}>{item.dept_name}</div>
                  <IconRight />
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    )
  }
  return (
    <Modal
      unmountOnExit={true}
      title={title}
      visible={visible}
      onOk={() => onChange(user)}
      onCancel={() => setVisible(false)}
      autoFocus={false}
      focusLock={true}
      className='modal-select-user'
      style={{ width: '700px' }}>
      <div className={styles['container']}>
        <div className={styles['use-box']}>
          <Input.Search className={styles['search']} onChange={(e) => getList(e)} allowClear placeholder='请输入内容' />
          <Tabs className={styles['tabs']} size='small' defaultActiveTab={'2'}>
            {items.map((item) => (
              <Tabs.TabPane key={item.id} title={item.title}>
                <div className={styles['content']}>
                  {item?.children?.length > 0 ? (
                    item.id === 1 ? (
                      item.children.map((child) => <User key={child.id} item={child} onClick={() => onSelectUser(child)} />)
                    ) : item.id === 2 ? (
                      deptList?.length > 0 ? (
                        deptList.map((child) => (
                          <User key={`${child.id}_${child.user_dept_main}`} item={child} onClick={() => onSelectUser(child)} />
                        ))
                      ) : (
                        <DeptContent depts={depts} deptUser={deptUser} />
                      )
                    ) : null
                  ) : (
                    <div className={styles['empty']}>
                      <Empty />
                    </div>
                  )}
                </div>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
        <div className={styles['select-box']}>
          <div className={styles['header']}>
            <span>已选择</span>
            <Button size='small' disabled={user?.length === 0} onClick={() => setUser([])}>
              清空已选
            </Button>
          </div>
          <div className={styles['content']}>
            {user?.length > 0 ? (
              user.map((item) => (
                <User key={item.id} item={item} close={true} onClear={() => setUser(user.filter((i) => i.id !== item.id))} />
              ))
            ) : (
              <div className={styles['empty']}>
                <Empty />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
export default SelectUser
