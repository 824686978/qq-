// pages/home-video/index.js
import { getTopMv } from '../../service/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    // 判断是否还有数据
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTopMvData(0)
  },

  // 封装网络请求
  async getTopMvData(offset) {
    // 判断是否可以请求
    if (!this.data.hasMore && offset !== 0) return

    // 开始请求数据
    const res = await getTopMv(offset)
    let newData = this.data.topMvs
    if(offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    this.setData({ topMvs: newData})
    this.setData({ hasMore: res.hasMore})
    // 关闭下拉刷线动画
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },
  // 封装事件处理的方法
  handleVideoItemClick(event) {
    // 获取id
    // 根据html中的data-item属性传过来的值获取
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
  },

  // 其他声明周期的回调函数
  /**
   * 当用户下拉刷新是会调用该函数
   */
  onPullDownRefresh() {
    this.getTopMvData(0)
  },

  /**
   * 当用户滑动到底部是会调用该函数
   */
  onReachBottom() {
    this.getTopMvData(this.data.topMvs.length)
  }
})