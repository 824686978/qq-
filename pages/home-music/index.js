// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index'

import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000, { trailing: true })
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
    rankings: { 0: {}, 2: {}, 3: {} },
    //
    currentSong: {},
    isPlaying: false,
    playAnimState: 'paused'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // playerStore.dispatch('playMusicWithSongIdAction', { id: 488249475 }) 
    // 获取页面数据
    this.getPageData()

    // 发起共享数据的请求
    rankingStore.dispatch('getRankingDataAction')
    

    this.setupPlayerStoreListener()
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
  // 请求巅峰榜数据
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
      if (rect) {
        this.setData({ swiperHeight: rect.height})
      }
    })
  },
  // 监听子组件更多的点击
  handleMoreClick() {
    this.navigateToDetailSongsPage("hotRanking")
  },
  // 监听暂停
  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },
  handlePlayBarClick() {
    wx.navigateTo({
      url: `/pages/music-player/index?id=${this.data.currentSong.id}`,
    })
  },
  navigateToDetailSongsPage(rangkingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rangkingName}&type=rank`,
    })
  },
  // 监听巅峰榜的点击
  handleRankingItemClick(event) {
    // 获取点击巅峰榜的idx
    const idx = event.currentTarget.dataset.idx
    // 根据idx 匹配定义数据
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },
  // 获取歌单
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.recommendSongs)
    playerStore.setState('playListIndex', index)

  },
  setupPlayerStoreListener() {
    // 获取排行榜的监听
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

    // 2. 播放器的监听
    playerStore.onStates(['currentSong', 'isPlaying'], ({ currentSong, isPlaying }) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) this.setData({ isPlaying, playAnimState: isPlaying ? 'running' : 'paused' })
    })
  }
})