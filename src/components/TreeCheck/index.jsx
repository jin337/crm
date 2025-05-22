import { Checkbox } from '@arco-design/web-react'
import { useEffect, useState } from 'react'

// 样式
import styles from './index.module.scss'

const TreeCheck = (props) => {
  const { treeData = [], selectKeys = [], menuSelect, onChange } = props
  const [items, setItems] = useState([])

  const flattenItems = (data) => {
    return data.reduce((acc, item) => {
      acc.push(item)
      if (item.children) {
        acc.push(...flattenItems(item.children))
      }
      return acc
    }, [])
  }

  const allOptions = flattenItems(items).map((x) => x.id)
  const { setValueSelected, selected, setSelected } = Checkbox.useCheckbox(allOptions, [])

  useEffect(() => {
    setSelected(selectKeys)
  }, [])

  useEffect(() => {
    setItems(treeData || [])
  }, [treeData])

  // 当前选中
  useEffect(() => {
    onChange(selected)
  }, [selected])

  // 内容渲染
  const renderTree = (data) => {
    // 当前选中
    const changeChecked = (checked, item) => {
      // 获取所有子节点的 ID（包括自身）
      const getAllIds = (e) => [e.id, ...flattenItems(e.children || []).map((x) => x.id)]
      // 获取叶子节点的更新逻辑
      const getLeaf = (e) => {
        const parent = flattenItems(items).find((x) => x.id === e.pid)
        if (parent) {
          // const newSelected = checked ? [...selected, e.id] : selected.filter((x) => x !== e.id)
          // const allPid = parent.children.map((x) => x.id)
          // const containsAll = allPid.every((x) => newSelected.includes(x))
          // if (checked) {
          //   return containsAll ? [e.pid, e.id] : [e.id]
          // } else {
          //   return [e.pid, e.id]
          // }
          return [e.pid, e.id]
        } else {
          return [e.id]
        }
      }
      // 根据是否有子节点决定调用哪个方法
      const idsToUpdate = item.children ? getAllIds(item) : getLeaf(item)
      // 更新选中状态
      setValueSelected(idsToUpdate, checked)
    }
    // 获取父级状态
    const getParentStatus = (item) => {
      const allChildren = flattenItems(item.children || [])
      const selectedCount = allChildren.filter((child) => selected.includes(child.id)).length
      if (allChildren.length === 0) return selected.includes(item.id)

      if (selectedCount === 0) return false
      if (selectedCount === allChildren.length) return true
      return 'indeterminate'
    }

    return data.map((option) => (
      <div className={`${styles['item']} ${option?.children?.length > 0 ? styles['item-box'] : ''}`} key={option.id}>
        <Checkbox
          className={`${option.pid === '0' ? styles['title'] : ''}`}
          value={option.id}
          checked={getParentStatus(option)}
          onChange={(checked) => changeChecked(checked, option)}
          indeterminate={getParentStatus(option) === 'indeterminate'}>
          {option.title}
        </Checkbox>
        {option?.children?.length > 0 && <div className={styles['box']}>{renderTree(option.children)}</div>}
      </div>
    ))
  }

  // 全选
  const allChecked = (checked) => {
    const allIds = flattenItems(items).map((x) => x.id)
    setValueSelected(allIds, checked)
  }

  return (
    <div className={styles['treecheck-wrap']}>
      {menuSelect.app_id === '1' && (
        <div className={styles['item']}>
          <Checkbox
            className={styles['title']}
            onChange={allChecked}
            checked={selected.length === flattenItems(items).length}
            indeterminate={selected.length > 0 && selected.length < flattenItems(items).length}>
            全部
          </Checkbox>
        </div>
      )}
      {renderTree(items)}
    </div>
  )
}

export default TreeCheck
