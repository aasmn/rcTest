const path = require('path')
const fs = require('fs')
// 生成json文件
const { UAA_SERVER_URL, CLIENT_ID } = process.env
let configPath = path.join(path.resolve(__dirname, '../src'), 'config.json')
let jsonData = JSON.parse(fs.readFileSync(configPath, 'utf8'))

Object.assign(jsonData, {
  UAA_SERVER_URL,
  CLIENT_ID,
  SCOPE: 'USER_INFO'
})

fs.writeFileSync(configPath, JSON.stringify(jsonData, null, 2))
