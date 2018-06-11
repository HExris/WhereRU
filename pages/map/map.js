// pages/map/map.js
const { setDataInOtherPage, getCompoents} = require('../../utils/core.js')
const { getNetworkStatus } = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 22.54286,
    longitude: 114.05956,
    compents: ['toast'],
    scale: 16,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setDataInOtherPage('pages/map/map', [{ test: true }])
    this.getLocation()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let { compents } = this.data
    getCompoents(compents, this)
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        let latitude = res.latitude
        let longitude = res.longitude
        // this.setData({
        //   latitude,
        //   longitude
        // })
        this.mapCtx.moveToLocation()
        this.updateLocation(res.latitude, res.longitude)
        this.updated(() => {
          this.showToast('success')
        })
      },
      fail: res => {
        getNetworkStatus().then(res => {
          if (res.networkType === 'none') {
            wx.showModal({
              title: '无网络',
              content: '请打开数据或连接WiFi',
              confirmColor: '#fbab70',
              showCancel: false
            })
          }else{
            wx.showModal({
              title: 'Failed to locate',
              content: 'Please open the location service.',
              confirmText: 'Settings',
              confirmColor: '#fbab70',
              cancelText: '取消',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  wx.openSetting({
                    complete: res => {
                      this.getLocation()
                    }
                  })
                }
              }
            })
          }
        }).catch(err => {
          console.error(err)
        })
      }
    })
  },
  showAction() {
    wx.showActionSheet({
      itemList: ['小奶狗的定位', '更新我的定位'],
      success: res => {
        switch (res.tapIndex) {
          case 0:

            break;
          case 1:
            this.getLocation()
            break;
        }
      }
    })
  },
  // 上传用户位置到服务器
  updateLocation(latitude, longitude) {
    console.log(latitude, longitude)
  },
  /* ========= Toast ========= */

  showToast(attr) {
    if (attr === 'success') {
      this.setData({
        toastMessage: `Location is updated . `,
        toastTextColor: '#fff',
        bottom: '20vh'
      })
    }
    this.toast.triggerToast();
  },

  updated(callback) {
    typeof callback === 'function' && callback()
  },
  // 行为控制
  action(e) {
    let { attr } = e.target.dataset
    attr = Number(attr)
    switch (attr) {
      case 0:
        wx.showModal({
          title: '留下足迹？',
          content: '在地图上记录上你当前的位置',
          confirmColor: '#fbab70',
          success: (res) => {
            if (res.confirm) {
              console.log('确定')
            } else {
              console.log('取消')
            }
          }
        })
        break;
      case 1:
        console.log('拔起')
        break;
    }
  }
})