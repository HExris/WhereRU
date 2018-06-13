const { baseUrl } = require('../utils/config.js')

/**
 * 格式化时间
 * @date date对象
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 计算方法类
 * @param arg1 
 * @param this.arg2 
 * @returns {Number} 
 */
class CalcMethod {
  constructor(arg1, arg2) {
    this.arg1 = arg1
    this.arg2 = arg2
  }
  /** 
   * 乘法 
   * @param arg1 
   * @param this.arg2 
   * @returns {Number} 
   */
  M() {
    var m = 0, s1 = this.arg1.toString(), s2 = this.arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  }
  /** 
   * 除法 
   * @param this.arg1 
   * @param this.arg2 
   * @returns {Number} 
   */
  D() {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = this.arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = this.arg2.toString().split(".")[1].length } catch (e) { }
    r1 = Number(this.arg1.toString().replace(".", ""))
    r2 = Number(this.arg2.toString().replace(".", ""))
    return (r1 / r2) * Math.pow(10, t2 - t1);
  }
  /** 
   * 加法 
   * @param this.arg1 
   * @param this.arg2 
   * @returns {Number} 
   */
  A() {
    var r1, r2, m, c;
    try { r1 = this.arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = this.arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2))
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        this.arg1 = Number(this.arg1.toString().replace(".", ""));
        this.arg2 = Number(this.arg2.toString().replace(".", "")) * cm;
      }
      else {
        this.arg1 = Number(this.arg1.toString().replace(".", "")) * cm;
        this.arg2 = Number(this.arg2.toString().replace(".", ""));
      }
    }
    else {
      this.arg1 = Number(this.arg1.toString().replace(".", ""));
      this.arg2 = Number(this.arg2.toString().replace(".", ""));
    }
    return (this.arg1 + this.arg2) / m
  }
  /** 
   * 减法 
   * @param this.arg1 
   * @param this.arg2 
   * @returns 
   */
  S() {
    var r1, r2, m, n;
    try { r1 = this.arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = this.arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka  
    //动态控制精度长度  
    n = (r1 >= r2) ? r1 : r2;
    return ((this.arg1 * m - this.arg2 * m) / m).toFixed(n);
  }
}

/** 
 * 获取网络状态
*/
function getNetworkStatus() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

/** 
 * 获取openID
*/
function getOpenID() {
  return new Promise((resolve, reject) => {
    const app = new getApp(),
      { code, userInfo } = app.globalData
    wx.request({
      method: 'post',
      url: baseUrl.login,
      data: { code, userInfo },
      success: res => {
        wx.setStorage({
          key: 'openID',
          data: res.data.data,
        })
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

module.exports = {
  formatTime,
  CalcMethod,
  getNetworkStatus,
  getOpenID,
}
