import { configureStore } from '@reduxjs/toolkit'

const modulesFiles = import.meta.glob('../store/*.jsx', { eager: true })
const reducer = Object.fromEntries(
  Object.entries(modulesFiles).map(([path, module]) => {
    const moduleName = path.match(/\.\.\/store\/(.+)\.jsx$/)[1]
    return [moduleName, module.default]
  })
)

export const store = configureStore({ reducer })