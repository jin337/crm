import { Button, Result, Space } from '@arco-design/web-react'
import { IconLeft, IconRight } from '@arco-design/web-react/icon'
import {} from 'react'
import { useNavigate } from 'react-router'

const NotAuth = () => {
  const navigate = useNavigate()

  // 退出
  const onExit = () => {
    sessionStorage.clear()
    navigate('/login')
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <Result
        status='404'
        title='当前页面无权限'
        extra={
          <Space>
            <Button key='again' type='secondary' onClick={() => navigate(-1)}>
              <IconLeft />
              上一页
            </Button>
            <Button key='back' type='primary' onClick={onExit}>
              登录页
              <IconRight />
            </Button>
          </Space>
        }
      />
    </div>
  )
}
export default NotAuth
