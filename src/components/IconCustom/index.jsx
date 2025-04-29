import * as ArcoIcons from '@arco-design/web-react/icon'

const IconCustom = ({ name, ...props }) => {
  const ArcoComponent = ArcoIcons[name] || null

  if (ArcoComponent) {
    return <ArcoComponent {...props} />
  }
}

export default IconCustom
