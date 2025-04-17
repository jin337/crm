import { Spin } from '@arco-design/web-react'
import { } from 'react'

const Loading = (props) => {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Spin {...props} />
    </div>
  )
}
export default Loading
