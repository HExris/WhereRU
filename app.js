//app.js
const core = require('./utils/core.js')

App({
  onLaunch: function () {
    this.login()
    this.showStore()
  },
  globalData: {
    userInfo: null,
    pageStack: []
  },
  // 登录
  login() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('isLogin', true)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: err => {
        console.log('getUserInfo fail.')
      }
    })
  },
  // 输出本地缓存数据
  showStore(){
    wx.getStorageInfo({
      success: function(res) {
        console.log(`当前缓存列表: ${res.keys}`)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})