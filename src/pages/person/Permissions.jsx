import { Button, Table } from '@arco-design/web-react'
// 公共方法
import { useNavigate } from 'react-router'
import { localSetItem } from 'src/utils/common'

// 样式
import styles from './index.module.scss'

// 权限信息
const Permissions = ({ data = [] }) => {
  const navigate = useNavigate()
  // 表头
  const columns = [
    {
      title: '机构/部门',
      dataIndex: 'dept_name',
    },
    {
      title: '角色',
      dataIndex: 'role_name',
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render: (_, record) => (
        <Button type='text' size='mini' onClick={() => cutRole(record)}>
          切换
        </Button>
      ),
    },
  ]

  const cutRole = async (item) => {
    const { code, data } = await Http.post('/system/menu/user-list', { dept_id: item.id })
    if (code === 200) {
      localSetItem('CRMUSERDATA', data)
      navigate(0)
    }
  }

  return (
    <>
      <div className={styles['wrap-title']}>权限信息</div>
      <Table borderCell rowKey='id' columns={columns} data={data} pagination={false} />
    </>
  )
}
export default Permissions
