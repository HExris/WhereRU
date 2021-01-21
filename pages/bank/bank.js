// pages/bank/bank.js
const app = getApp()
let calendarInstance
import dayjs from "../../utils/day";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    nbFrontColor: '#000000',
    nbBackgroundColor: '#777777',
    keepDays: 0,
    totalDays: 0,
    totalAssets: '0.00',
    checked: false,
    today: dayjs().format('YYYY/MM/DD'),
    calendarConfig: {
      autoChoosedWhenJump: true,
      defaultDate: dayjs().format('YYYY-M-D'),
      markToday: '今',
      hideYearSwitch: true, // 隐藏年份切换
    },
    checkedList: [],
    currentDate: dayjs().format("YYYY/MM/DD"), // 当前选中日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  // 初始化页面
  init() {
    // 获取用户信息
    this.getUserInfoWitoutCredentials()
    // 修改导航栏颜色
    this.setData({
      nbFrontColor: '#222222',
      nbBackgroundColor: '#f9db61',
    })
    // 获取用户打卡记录
    this.getUserCheckLog()
    // 获取当日打卡记录
    this.getCurrentDayCheckStatus()
    // 更新看板信息
    this.updateDashborad()
  },
  /**
   * 获取当前选择日期的打卡状态
   * @param { date } 2020/01/24
   */
  getCurrentDayCheckStatus(date) {
    let currentDay = date || dayjs().format('YYYY/MM/DD')
    console.log(this.data.checkedList, currentDay)
    if (this.data.checkedList.findIndex(checkedDate => currentDay === checkedDate.date) > -1) {
      this.setData({
        checked: true
      })
    } else {
      this.setData({
        checked: false
      })
    }
  },
  // 获取用户信息
  getUserInfoWitoutCredentials() {
    wx.getUserInfo({
      withCredentials: false,
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  // 获取用户打卡记录
  getUserCheckLog() {
    // 将打卡记录从缓存中取出，放置到内存中
    let checkedList = wx.getStorageSync('checkedList') || []
    app.globalData.checkedList = checkedList
    // 存在打卡记录时更新页面数据
    if (app.globalData.checkedList instanceof Array && app.globalData.checkedList.length) {
      this.setData({
        totalDays: app.globalData.checkedList.length,
        checkedList: app.globalData.checkedList
      })
    } else {
      wx.setStorage({
        data: [],
        key: 'checkedList',
      })
      this.setData({
        totalDays: 0,
        checkedList: []
      })
    }
  },
  updateDashborad() {
    let totalAssets = 0
    this.data.checkedList.forEach(v => {
      totalAssets += v.count
    })
    this.setData({
      totalAssets: totalAssets.toFixed(2),
      totalDays: this.data.checkedList.length
    })
  },
  updateDisabledDate(){
    // console.log(this.data.checkedList.map(v => v.date.replace(/\//g,'-')))
    calendarInstance.disableDates(["2021-1-21", "2021-1-22", "2021-1-20", "2021-1-13", "2021-1-19"])
    // calendarInstance.disableDates(this.data.checkedList.map(v => v.date.replace(/\//g,'-')))
  },
  /**
   * 更新打卡记录
   * @params { Array } checkedList
   */
  updateCheckedList(checkedList) {
    this.setData({
      checkedList
    })
    wx.setStorageSync('checkedList', checkedList)
  },
  /**
   * 选择日期后执行的事件
   */
  afterTapDate(e) {
    if (e) {
      let {
        year,
        month,
        date
      } = e.detail
      let currentDate = `${year}/${month < 10? '0' + month: month}/${date < 10? '0' + date: date}`
      this.setData({
        currentDate
      })
      this.getCurrentDayCheckStatus(currentDate)
    }
    console.log('afterTapDate', e.detail) // => { year: 2019, month: 12, date: 3, ...}
  },
  // 打卡
  check() {
    this.setData({
      checked: true
    })
    wx.showLoading({
      mask: true
    })
    this.updateCheckedList(this.data.checkedList.concat({
      date: this.data.currentDate,
      count: this.data.checkedList.length + 1
    }))
    this.updateDashborad()
    this.updateDisabledDate()
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 初始化组件实例
    calendarInstance = this.selectComponent('#calendar').calendar
    // 跳转到当前日期
    calendarInstance.jump({year:new Date().getFullYear(), month: new Date().getMonth() + 1, date: new Date().getDate()});
    // 设置禁用日期
    this.updateDisabledDate()
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