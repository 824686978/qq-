// app.js
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    deviceRadio: 0
  },
  onLaunch() {
    // 获取屏幕宽度
    const info = wx.getSystemInfoSync()
    this.globalData.screenHeight = info.screenHeight
    this.globalData.screenWidth = info.screenWidth
    // 获取头部高度
    this.globalData.statusBarHeight = info.statusBarHeight
    // 手机宽高比
    const deviceRadio = info.screenHeight / info.screenWidth
    this.globalData.deviceRadio = deviceRadio

  }
})
