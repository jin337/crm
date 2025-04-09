// 拍平多维数组
export const flattenArray = (arr) => {
  let result = []
  const flatten = (items) => {
    for (let item of items) {
      result.push(item)
      if (item.children && item.children.length > 0) {
        flatten(item.children)
      }
    }
  }

  flatten(arr)
  return result
}

// 根据元素分组
export const groupArrKey = (arr, key) => {
  const list = []
  const fn = (i) => [i[key]]
  for (const value of arr) {
    const item = JSON.stringify(fn(value))
    list[item] = list[item] || []
    list[item].push(value)
  }
  return Object.keys(list).map((e) => ({
    [key]: JSON.parse(e)[0],
    data: list[e],
    total: list[e].length,
  }))
}

// 文件下载
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 事件执行
export const executeMethod = (code, ...args) => {
  const match = code?.match(/(\w+)\s*\(([\w\s,]*)\)\s*{([\s\S]*)}/)
  if (!match) {
    return
  }

  const [, functionName, params, functionBody] = match

  const obj = {
    [functionName]: new Function(...params.split(',').map((p) => p.trim()), functionBody),
  }

  return obj[functionName](...args)
}

// 是否相等
export const isEqual = (arr1, arr2) => {
  if (arr1 === arr2) return true

  if (Object.is(arr1, NaN) && Object.is(arr2, NaN)) return true

  if ((arr1 == null || arr1 === '') && (arr2 == null || arr2 === '')) return true

  if (arr1 === undefined || arr2 === undefined) return false

  if (typeof arr1 !== typeof arr2) return false

  if (typeof arr1 === 'number' || typeof arr2 === 'number') {
    arr1 = String(arr1)
    arr2 = String(arr2)
  }

  if (typeof arr1 !== 'object') return arr1 === arr2

  if (arr1 instanceof Date && arr2 instanceof Date) {
    return arr1.getTime() === arr2.getTime()
  }

  if (arr1 instanceof RegExp && arr2 instanceof RegExp) {
    return arr1.source === arr2.source && arr1.flags === arr2.flags
  }

  if (Array.isArray(arr1) && Array.isArray(arr2)) {
    if (arr1.length !== arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
      if (!isEqual(arr1[i], arr2[i])) return false
    }
    return true
  }

  if (arr1 !== null && arr2 !== null && typeof arr1 === 'object' && typeof arr2 === 'object') {
    const keys1 = Object.keys(arr1)
    const keys2 = Object.keys(arr2)

    if (keys1.length !== keys2.length) return false

    const keySet = new Set(keys2)
    for (const key of keys1) {
      if (!keySet.has(key) || !isEqual(arr1[key], arr2[key])) {
        return false
      }
    }
    return true
  }

  return false
}

// 随机生成任意长度字符串
export const randomString = (len = 32) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz234567890'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

// 更新树形结构数据
export const updateTree = (data, id, callback) => {
  return data.map((node) => {
    if (node.id === id) {
      return callback(node)
    }
    if (node.children) {
      return { ...node, children: updateTree(node.children, id, callback) }
    }
    return node
  })
}

// 设置数据并附加过期时间戳
export const localSetItem = (key, value, time) => {
  const now = Date.now()
  const item = {
    value: value,
    expiry: now + time,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

// 获取数据，如果数据已过期则返回null
export const localGetItem = (key) => {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)
  const now = Date.now()
  if (now > item.expiry) {
    // 数据已过期，删除它
    localStorage.removeItem(key)
    return null
  }
  return item.value
}
// 获取父级列表
export const findRootNode = (arr, targetId) => {
  // 创建 ID 到节点的全局映射表
  const idMap = new Map()
  const buildMap = (nodes) => {
    nodes.forEach((node) => {
      idMap.set(node.id, node) // 使用 Map 提升查找性能
      if (node.children?.length) buildMap(node.children)
    })
  }
  buildMap(arr)

  // 查找目标节点
  const target = idMap.get(targetId)
  if (!target) return []

  // 逐级向上追溯根节点，并记录路径
  let current = target
  const path = []
  while (true) {
    path.push(current)
    const parent = idMap.get(current.pid)
    if (!parent) break // 没有父节点时终止
    current = parent
  }

  // 反转路径数组以确保从最顶级到次顶级的顺序
  return path.reverse()
}
