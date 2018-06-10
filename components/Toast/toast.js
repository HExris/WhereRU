// components/Toast/toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    textColor: {
      type: String,
      value: '#fff',
    },
    backgroundColor: {
      type: String,
      value: 'rgba(0,0,0,0.4)',
    },
    message: {
      type: String,
      value: '???'
    },
    padding: {
      type: String,
      value: '10rpx 14rpx'
    },
    fontSize: {
      type: String,
      value: '32rpx'
    },
    opacity: {
      type: Number,
      value: 1
    },
    emoji: {
      type: String,
      value: null
    },
    emojiColor: {
      type: String,
      value: '#fff'
    },
    bottom: {
      type: String,
      value: '35vh'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    triggerToast(callback, duration = 3500) {
      console.log(this.data)
      this.setData({
        isShow: true
      })
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setData({
          isShow: false,
          emoji: null
        })
        typeof callback === 'function' && callback()
      }, duration)
    }
  }
})
