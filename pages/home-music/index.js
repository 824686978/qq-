// pages/home-music/index.js
import { rankingStore } from '../../store/index'

import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    banners: [],
    // 屏幕宽度
    swiperHeight: 0,
    // 推荐歌曲
    recommendSongs: [],
    // 热门歌单
    hotSongMenu: [],
    // 推荐歌单
    recommendSongMenu: [],
    // 巅峰榜数据
    rankings: { 0: {}, 2: {}, 3: {} }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 获取页面数据
    this.getPageData()

    // 发起共享数据的请求
    rankingStore.dispatch('getRankingDataAction')
    // 获取共享数据
    rankingStore.onState('hotRanking', (res) => {
      // 判断是否有值
      if (!res.tracks) return
      // 获取前6条歌曲
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })
    rankingStore.onState('newRanking', this.getRankingHandler(0))
    rankingStore.onState('originRanking', this.getRankingHandler(2))
    rankingStore.onState('upRanking', this.getRankingHandler(3))
  },
  // 网络请求
  getPageData() {
    getBanners().then(res => {
      this.setData({ banners: res.banners })
    })
    getSongMenu().then(res => {
      this.setData({ hotSongMenu : res.playlists })
    })
    getSongMenu('华语').then(res => {
      this.setData({ recommendSongMenu : res.playlists })
    })
  },
  onUnload() {},

  // 事件处理逻辑
  // 监听搜索框的点击
  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  // 获取屏幕的宽度
  handleSwiperImageLoaded() {
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({ swiperHeight: rect.height})
    })
  },
  getRankingHandler(idx) {
    return (res) => {
      // 判断是否有数据
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = { name, coverImgUrl, playCount, songList }
      const newRankings = { ...this.data.rankings, [idx]: rankingObj }
      this.setData({
        rankings: newRankings
      })
    }
  } 

})