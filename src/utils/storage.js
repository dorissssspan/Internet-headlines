/*
*  封装本地存储模块
* */

// 存储数据
export const setItem = (key, value) => {
  // 将数组、对象类型数据转换为 JSON 格式字符串存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取数据
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  // 如果不是有效的 JSON 格式字符串就会报错
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 删除数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
