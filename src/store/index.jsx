import { configureStore } from '@reduxjs/toolkit'

import commonReducer from './reducers/common'

export const store = configureStore({
  reducer: {
    common: commonReducer,
  },
})
