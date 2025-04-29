import { Avatar } from '@arco-design/web-react'
import { IconUser } from '@arco-design/web-react/icon'
import { useState } from 'react'
import { useSelector } from 'react-redux'

// 组件
import { IconCustom } from 'src/components'

import Information from './Information'
import Password from './Password'
import Permissions from './Permissions'

// 样式
import styles from './index.module.scss'

const list = [
  {
    id: 1,
    title: '个人信息',
    icon: 'IconUser',
  },
  {
    id: 2,
    title: '账号密码',
    icon: 'IconLock',
  },
  {
    id: 3,
    title: '权限信息',
    icon: 'IconIdcard',
  },
]
const Person = () => {
  const { userInfo, roles } = useSelector((state) => state.common)
  const [navList, setNavList] = useState(list)
  const [select, setSelect] = useState(0)

  return (
    <div className={styles['person-wrap']}>
      <div className={styles['left-wrap']}>
        <div className={styles['user-box']}>
          <Avatar className={styles['icon']}>
            <IconUser />
          </Avatar>
          {userInfo?.user_name}
        </div>
        <ul className={styles['nav-list']}>
          {navList.map((item, index) => (
            <li
              key={item.id}
              className={`${styles['nav-list-item']} ${select === index ? styles['active'] : ''}`}
              onClick={() => setSelect(index)}>
              <IconCustom name={item.icon} className={styles['icon']} />
              <div className={styles['text']}>{item.title}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles['right-wrap']}>
        {select === 0 && <Information data={userInfo} />}
        {select === 1 && <Password />}
        {select === 2 && <Permissions data={roles} />}
      </div>
    </div>
  )
}
export default Person
