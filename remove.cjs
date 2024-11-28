const fs = require('node:fs')
const path = require('node:path')

// 读取 openapi.json 文件
const filePath = path.join(__dirname, 'openapi.json')
const openapi = JSON.parse(fs.readFileSync(filePath, 'utf8'))

// 遍历所有路径和方法，删除指定的请求头参数
Object.keys(openapi.paths).forEach((path) => {
  Object.keys(openapi.paths[path]).forEach((method) => {
    const parameters = openapi.paths[path][method].parameters
    if (parameters) {
      openapi.paths[path][method].parameters = parameters.filter(
        param => param.name !== 'Authorization' && param.name !== 'X-Language',
      )
    }
  })
})

// 将修改后的内容写回文件
fs.writeFileSync(filePath, JSON.stringify(openapi, null, 2), 'utf8')
