import { Checkbox } from '@arco-design/web-react'
import { useEffect, useState } from 'react'

const RecursiveCheckbox = ({ items }) => {
  return items?.map((item) => (
    <div key={item.id} className='mb-2'>
      <Checkbox value={item.id}>{item.title}</Checkbox>
      {item.children && (
        <div className='mt-1 flex flex-wrap'>
          <RecursiveCheckbox items={item.children} />
        </div>
      )}
    </div>
  ))
}

const TreeCheck = (props) => {
  const { treeData } = props
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(treeData[0]?.children || [])
  }, [treeData])

  return (
    <div className='treecheck-wrap'>
      <div className='mb-2'>
        <Checkbox>全部</Checkbox>
      </div>
      <Checkbox.Group>
        <RecursiveCheckbox items={items} />
      </Checkbox.Group>
    </div>
  )
}

export default TreeCheck
