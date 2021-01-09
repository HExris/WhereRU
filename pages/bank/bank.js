// pages/bank/bank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: {"nickName":"边吃苦瓜边洗澡","gender":1,"language":"zh_CN","city":"Miyazaki-shi","province":"Miyazaki-ken","country":"JP","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/w6BtlmSPr7aCsrmQG1kDTicM4vxGRlekmwyjEcM5oias9qKGjDiauXQQrGzJWJwHDONNnicHCiaMV11w5Cwrn8PjxlQ/132"}
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})