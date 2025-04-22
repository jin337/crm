import { } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { setMenuSelect } from 'src/store/reducers/common'
import { flattenArray } from 'src/utils/common'

const useLink = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { initMenuData, systemMenuData } = useSelector((state) => state.common)

  const link = (params) => {
    const path = params.path.replace(/\/[^/]+$/, '')
    let item = flattenArray(initMenuData)?.find((item) => item.path === path || item.path === params.path)
    if (!item) {
      item = flattenArray(systemMenuData)?.find((item) => item.path === path || item.path === params.path)
    }
    dispatch(setMenuSelect(item))
    navigate(params.path, { state: { ...item, ...params } })
  }
  return link
}
export default useLink
