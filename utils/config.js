// 0: 测试 1: 开发
const env = 0

let hostname = ''
let baseUrl = {}

if (env === 0) {
  hostname = 'http://localhost:3000'
  baseUrl = {
    login: '/users/login'
  }
}

// 补全请求路径
for(let item in baseUrl){
  baseUrl[item] = hostname + baseUrl[item]
}

module.exports = {
  hostname,
  baseUrl,
}