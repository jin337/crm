import { Spin } from '@arco-design/web-react'
import {} from 'react'

const Loading = (props) => {
  const { screen = false, ...rest } = props
  return (
    <div className={`flex items-center justify-center ${screen ? 'h-screen w-screen' : 'h-full w-full'}`}>
      <Spin {...rest} />
    </div>
  )
}
export default Loading
