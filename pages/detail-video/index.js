// pages/detail-video/index.js
import { getMVURL, getMVDetail, getMVRelated} from '../../service/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    getMVDetail: {},
    relatedVideos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const id = options.id

    // 请求页面数据
    this.getPageData(id)
    
  },

  // 封装网络请求页面数据
  getPageData(id) {
    // 1.请求播放地址
    getMVURL(id).then(res => {
      this.setData({ mvURLInfo: res.data })
    })
    // 2.请求视频信息
    getMVDetail(id).then(res => {
      this.setData({ getMVDetail: res.data })
    })
    // 3.请求相关视频
    getMVRelated(id).then(res => {
      this.setData({ relatedVideos: res.data })
    })
  }
  
})