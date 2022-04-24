// app.js
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0
  },
  onLaunch() {
    // 获取屏幕宽度
    const info = wx.getSystemInfoSync()
    this.globalData.screenHeight = info.screenHeight
    this.globalData.screenWidth = info.screenWidth
  }
})
