const modules = import.meta.glob('./**/*.{js,jsx}', { eager: true })

const components = Object.entries(modules).reduce((acc, [path, module]) => {
  const moduleName = path
    .replace(/^\.\//, '')
    .replace(/\.(jsx|js)$/, '')
    .split('/')[0]
  acc[moduleName] = module.default || module
  return acc
}, {})

export const Loading = components.Loading
export const IconCustom = components.IconCustom
export const MenuCustom = components.MenuCustom
export const SelectUser = components.SelectUser
export const TreeCheck = components.TreeCheck
