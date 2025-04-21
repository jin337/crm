import { generate, getRgbStr } from '@arco-design/color'
const useColorTheme = () => {
  const updateThemeColor = (props) => {
    const { button_color, menu_color } = props
    const colorList = generate(button_color, { list: true })
    colorList.forEach((color, index) => {
      document.body.style.setProperty(`--arcoblue-${index + 1}`, getRgbStr(color))
    })
    document.body.style.setProperty(`--default-theme`, menu_color)
  }
  return updateThemeColor
}

export default useColorTheme
