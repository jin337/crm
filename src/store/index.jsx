import { configureStore } from '@reduxjs/toolkit'

const modulesFiles = import.meta.glob('./reducers/*.jsx', { eager: true })
const reducer = Object.fromEntries(
  Object.entries(modulesFiles).map(([path, module]) => {
    const moduleName = path.match(/\.\/reducers\/(.+)\.jsx$/)[1]
    return [moduleName, module.default]
  })
)

export const store = configureStore({ reducer })
