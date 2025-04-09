import { createSlice } from '@reduxjs/toolkit'

import logo from 'src/assets/images/logo.png'
// 初始状态
const initialState = {
  title: '创智CRM',
  company: '中电创智（南京）科技有限公司',
  logo: logo,
  // 用户数据
  userInfo: null,
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
    getMenu: (state, action) => {
      state.initMenuData = action.payload
    },
    getSystemMenu: (state, action) => {
      state.systemMenuData = action.payload
    },
    getMenuSelect: (state, action) => {
      state.menuSelect = action.payload
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
  },
})

export const { setUserInfo, getMenu, getSystemMenu, getMenuSelect } = common.actions
export default common.reducer
