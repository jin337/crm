import { generate, getRgbStr } from '@arco-design/color'
const useColorTheme = () => {
  const updateThemeColor = (props) => {
    const { button, header } = props
    const colorList = generate(button, { list: true })
    colorList.forEach((color, index) => {
      document.body.style.setProperty(`--arcoblue-${index + 1}`, getRgbStr(color))
    })
    document.body.style.setProperty(`--default-theme`, header)
  }
  return updateThemeColor
}

export default useColorTheme
