// base-ui/nav-bar/index.js
Component({
  options: {
    // 设置多个插槽
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 头部高度
    statusBarHeight: getApp().globalData.statusBarHeight
  },
  lifetimes: {
    ready() {
      // 获取头部高度
      const info = wx.getSystemInfoSync()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
