import { Button, Table } from '@arco-design/web-react'

// 样式
import styles from './index.module.scss'

// 权限信息
const Permissions = ({ data = [] }) => {
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
        <Button type='text' size='mini'>
          切换
        </Button>
      ),
    },
  ]

  return (
    <>
      <div className={styles['wrap-title']}>权限信息</div>
      <Table borderCell rowKey='id' columns={columns} data={data} pagination={false} />
    </>
  )
}
export default Permissions
