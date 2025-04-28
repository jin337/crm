const modules = import.meta.glob('../components/**/*.{js,jsx}', { eager: true })

const components = Object.entries(modules).reduce((acc, [path, module]) => {
  const moduleName = path
    .replace(/^\.\.\/components\//, '')
    .replace(/\.(jsx|js)$/, '')
    .split('/')[0]
  acc[moduleName] = module.default || module
  return acc
}, {})

export default components
