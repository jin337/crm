import { generate, getRgbStr } from '@arco-design/color'
const useColorTheme = () => {
  const updateThemeColor = (color) => {
    const colorList = generate(color, { list: true })
    colorList.forEach((color, index) => {
      document.body.style.setProperty(`--arcoblue-${index + 1}`, getRgbStr(color))
    })
  }
  return updateThemeColor
}

export default useColorTheme
