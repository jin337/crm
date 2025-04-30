import { createSlice } from '@reduxjs/toolkit'

import logo from 'src/assets/images/logo.png'
// 初始状态
const initialState = {
  title: '创智CRM',
  logo: logo,
  company: '中电创智（南京）科技有限公司',
  // 用户数据
  userInfo: null,
  // 用户权限
  depts: null,
  // 用户主题
  theme: null,
  // 导航选中
  menuSelect: null,
  // 导航数据
  initMenuData: [],
  systemMenuData: [],
}

export const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    setDepts: (state, action) => {
      state.depts = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setMenu: (state, action) => {
      state.initMenuData = action.payload
    },
    setSystemMenu: (state, action) => {
      state.systemMenuData = action.payload
    },
    setMenuSelect: (state, action) => {
      state.menuSelect = action.payload
    },
  },
})

export const { setUserInfo, setDepts, setTheme, setMenu, setSystemMenu, setMenuSelect } = common.actions
export default common.reducer
