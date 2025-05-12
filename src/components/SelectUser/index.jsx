import { Avatar, Button, Empty, Input, Modal, Tabs, Tree } from '@arco-design/web-react'
import { IconCloseCircleFill, IconUser } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'

// 样式
import styles from './index.module.scss'

// 公共方法
import { flattenArray } from 'src/utils/common'

const SelectUser = (props) => {
  const { title, tabs = [], select = [], visible, setVisible, onTabChange, onChange } = props

  const [items, setItems] = useState([])
  const [user, setUser] = useState([])
  const [leaf, setLeaf] = useState([])

  // 员工信息
  const User = (props) => {
    const { item, close = false, onClear, onClick } = props

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
        <Avatar className={styles['icon']}>
          <IconUser />
        </Avatar>
        <div className={styles['info']}>
          <div>{item?.user_name}</div>
          <div className={styles['dept']}>{item?.dept_name}</div>
        </div>
        {close && <IconCloseCircleFill className={styles['close']} onClick={(e) => onRemove(e)} />}
      </div>
    )
  }

  useEffect(() => {
    setItems(tabs)
  }, [tabs])

  useEffect(() => {
    setUser(select)
  }, [select])

  // 获取用户
  const getUserData = async (obj) => {
    setLeaf([])
    const { code, data } = await Http.post('/system/user/list', { ...obj, current: 1, pageSize: 9999 })
    if (code === 200) {
      let arr =
        data?.list.map((e) => ({
          ...e,
          key: Date.now() + '_' + obj.dept_id + '_' + e.id,
          dept_id: obj.dept_id,
          dept_name: e.user_name,
          isLeaf: true,
        })) || []
      setLeaf(arr)
    }
  }

  const loadMore = (treeNode) => {
    getUserData({ dept_id: treeNode.props.dataRef.id })
    return new Promise((resolve) => {
      setTimeout(() => {
        treeNode.props.dataRef.children = [...leaf]
        setItems([...items])
        resolve()
      }, 1000)
    })
  }

  // 当前选中
  const onSelectTree = (e) => {
    const selectKey = flattenArray(items)?.find((item) => item?.isLeaf && item.key === e[0])
    setUser((prev) =>
      [...prev, selectKey].reduce((acc, item) => {
        if (!acc.includes(item)) {
          acc.push(item)
        }
        return acc
      }, [])
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
          <Input.Search className={styles['search']} allowClear placeholder='请输入内容' />
          <Tabs className={styles['tabs']} size='small' type='rounded' defaultActiveTab={'1'} onChange={onTabChange}>
            {items.map((item) => (
              <Tabs.TabPane key={item.id} title={item.title}>
                {item.tree === 0 && (
                  <div className={styles['content']} style={{ height: 338 }}>
                    {item?.children?.map((item) => (
                      <User key={item.id} item={item} onClick={() => setUser([...user, item])} />
                    ))}
                  </div>
                )}
                {item.tree === 1 && item?.children?.length > 0 && (
                  <Tree
                    blockNode
                    treeData={item?.children}
                    virtualListProps={{ height: 338 }}
                    loadMore={loadMore}
                    fieldNames={{ key: 'key', title: 'dept_name' }}
                    onSelect={onSelectTree}
                  />
                )}
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
                <User key={item.key} item={item} close={true} onClear={() => setUser(user.filter((i) => i.id !== item.id))} />
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
