// pages/bank/bank.js
const app = getApp()
let calendarInstance
import dayjs from "../../utils/day";
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo: {},
    nbBackgroundColor: '#777777',
    keepDays: 0,
    totalDays: 0,
    totalAssets: '0.00',
    checked: false,
    today: dayjs().format('YYYY/MM/DD'),
    calendarConfig: {
      // autoChoosedWhenJump: true,
      // defaultDate: dayjs().format('YYYY-M-D'),
      markToday: '今',
      hideYearSwitch: true, // 隐藏年份切换
    },
    checkedList: [],
    currentDate: dayjs().format("YYYY/MM/DD"), // 当前选中日期
    checkText: '',
    firstDay: '', // 第一天
    showGuideFlag: false,
    animationClass: ''
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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9db61',
      animation: {
        duration: 400,
        timingFunc: 'ease'
      }
    })
    // 获取用户打卡记录
    this.getUserCheckLog()
    // 获取当日打卡记录
    this.getCurrentDayCheckStatus()
    // 获取开始日期
    this.getFirstDay()
    // 更新看板信息
    this.updateDashborad()
    // 显示用户引导弹窗
    this.showGuideToast()
  },
  // 获取开始日期
  getFirstDay() {
    let firstDay = wx.getStorageSync('firstDay') || null
    this.setData({
      firstDay
    })
  },
  // 关闭引导弹窗
  closeToast() {
    this.setData({
      showGuideFlag: false
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9db61',
      animation: {
        duration: 200,
        timingFunc: 'ease'
      }
    })
  },
  showGuideToast() {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#C7AF4E'
    })
    // 未选择开始日期时
    if (!this.data.firstDay) {
      this.setData({
        showGuideFlag: true,
        animationClass: 'animate__zoomInDown'
      })
      // this.showGuideFlag = true
      // this.setData({
      //   firstDay: dayjs().format("YYYY/MM/DD")
      // })
    }
  },
  /**
   * 获取当前选择日期的打卡状态
   * @param { date } 2020/01/24
   */
  getCurrentDayCheckStatus(date) {
    let currentDay = date || dayjs().format('YYYY/MM/DD')
    let checkText
    if (!this.data.firstDay) {
      checkText = '打卡'
    } else if (new Date(this.data.today) <= new Date(this.data.currentDate)) {
      checkText = '打卡'
    } else {
      checkText = '补签'
    }
    this.setData({
      checked: this.data.checkedList.findIndex(checkedDate => currentDay === checkedDate.date) > -1 ? true : false,
      checkText
    })
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
    // 更细连续打卡天数
    let keepDays = 0
    this.currentDate
    // 更细已完成天数
    let totalAssets = 0
    this.data.checkedList.forEach(v => {
      totalAssets += v.count
    })
    this.setData({
      totalAssets: totalAssets.toFixed(2),
      totalDays: this.data.checkedList.length
    })
  },
  updateDisabledDate() {
    // 已打卡日期
    const checkedList = this.data.checkedList.map(v => dayjs(v.date).format('YYYY-M-D'))
    calendarInstance.disableDates(checkedList)
    // 设置打卡所需金额
    calendarInstance.setTodos({
      pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
      dotColor: 'purple', // 待办点标记颜色
      // circle: true, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
      showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
      dates: [{
        year: 2021,
        month: 1,
        date: 24,
        todoText: '待办',
        color: '#ff4400bf' // 单独定义代办颜色 (标记点、文字)
      }]
    })
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
  },
  // 刷新开始日期
  updateStartDate() {
    wx.setStorage({
      data: this.data.currentDate,
      key: 'firstDay',
    })
    this.setData({
      firstDay: this.data.currentDate
    })
    app.globalData.firstDay = this.data.currentDate
  },
  // 打卡
  checkInterceptor() {
    if (this.data.checked) return false
    if (!this.data.firstDay) {
      wx.showModal({
        title: '提示',
        content: `确定要从${this.data.currentDate === this.data.today ? '今天':this.data.currentDate}开始打卡吗？`,
        success: action => {
          if (action.confirm) {

            this.check()
          }
        }
      })
    } else {
      this.check()
    }
  },
  check() {
    this.setData({
      checked: true
    })
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    this.updateCheckedList(this.data.checkedList.concat({
      date: this.data.currentDate,
      count: this.data.checkedList.length + 1
    }))
    this.updateDashborad()
    this.updateDisabledDate()
    wx.hideLoading()
    wx.vibrateShort({
      type: 'heavy'
    })
  },
  /**
   * 当改变月份时触发
   * => current 当前年月 / next 切换后的年月
   */
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 初始化组件实例
    calendarInstance = this.selectComponent('#calendar').calendar
    // 跳转到当前日期
    // calendarInstance.jump({
    //   year: new Date().getFullYear(),
    //   month: new Date().getMonth() + 1,
    //   date: new Date().getDate()
    // });
    // 设置禁用日期
    this.updateDisabledDate()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
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