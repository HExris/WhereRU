//index.js
//获取应用实例
const app = getApp()
var core = require('../../utils/core.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    compents: ['dialog', 'toast'],
    toastTextColor: '#fff',
    emoji: null,
    emojiColor: '#fff'
  },
  onLoad: function () {
    // 获取本地登录态
    if (wx.getStorageSync('isLogin')) {
      try {
        wx.redirectTo({
          url: '/pages/map/map',
          success: () => {
            this.initPage()
          }
        })
      } catch (err) {
        console.log('fail redirect')
        console.log(err)
      }
    }else{
      this.initPage()
    }
  },
  onShow: function () {
    
  },
  initPage() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        // 更新用户信息
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', res.userInfo)
        // 跳转Map页面
        this.doOptions(res)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          this.doOptions(res)
        }
      })
    }
  },
  doOptions(res) {
    app.globalData.userInfo = res.userInfo
    this.setData({
      userInfo: res.userInfo,
      hasUserInfo: true
    })
  },
  onReady: function () {
    const { compents } = this.data
    core.getCompoents(compents,this)
    this.showDialog()
  },

  showDialog() {
    this.setData({ question: 'Trust me ?' })
    this.dialog.showDialog();
  },

  /* ========= Dialog ========= */

  // 拒绝
  refuse() {
    this.dialog.hideDialog();
  },

  // 同意
  agree() {
    this.dialog.hideDialog();
  },

  /* ========= Toast ========= */

  showToast(attr) {
    if (attr === 'Reject userinfo') {
      this.setData({
        toastMessage: `You don't have options . `,
        toastTextColor: '#fff',
        emoji: 'icon-smile',
        emojiColor: '#fffff'
      })
    } else if (attr === 'Success') {
      this.setData({
        toastMessage: `Thank you . `,
        toastTextColor: '#fff',
        emoji: 'icon-smile',
        emojiColor: '#5fff72'
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '../map/map'
        })
      }, 1500)
    } else {
      this.setData({
        toastMessage: `Why don't you trust me ??? `,
        toastTextColor: '#ff9b5f',
        emoji: 'icon-sad',
        emojiColor: '#fffff'
      })
    }
    this.toast.triggerToast();
  }
})
