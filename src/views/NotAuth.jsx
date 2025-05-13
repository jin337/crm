import { Result } from '@arco-design/web-react'
import {} from 'react'

const NotAuth = () => {
  return (
    <div className='flex h-full items-center justify-center'>
      <Result status='404' title='当前页面无权限' />
    </div>
  )
}
export default NotAuth
