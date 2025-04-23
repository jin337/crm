import { Checkbox } from '@arco-design/web-react'
import { useEffect, useState } from 'react'

const TreeCheck = (props) => {
  const { treeData, onChange } = props
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(treeData[0]?.children || [])
  }, [treeData])

  const flattenItems = (data) => {
    return data.reduce((acc, item) => {
      acc.push(item)
      if (item.children) {
        acc.push(...flattenItems(item.children))
      }
      return acc
    }, [])
  }

  const { selectAll, isSelected, unSelectAll, isAllSelected, isPartialSelected, setValueSelected, selected } =
    Checkbox.useCheckbox(
      flattenItems(items).map((x) => x.id),
      []
    )
  // 当前选中
  useEffect(() => {
    onChange(selected)
  }, [selected])

  const renderTree = (data) => {
    return data.map((option) => (
      <div className='mb-3' key={option.id}>
        <Checkbox value={option.id} checked={isSelected(option.id)} onChange={(checked) => setValueSelected(option.id, checked)}>
          {option.title}
        </Checkbox>
        {option?.children?.length > 0 && <div className='flex'>{renderTree(option.children)}</div>}
      </div>
    ))
  }

  return (
    <div className='treecheck-wrap'>
      <div className='mb-3'>
        <Checkbox
          onChange={(checked) => {
            if (checked) {
              selectAll()
            } else {
              unSelectAll()
            }
          }}
          checked={isAllSelected()}
          indeterminate={isPartialSelected()}>
          全部
        </Checkbox>
      </div>
      {renderTree(items)}
    </div>
  )
}

export default TreeCheck
