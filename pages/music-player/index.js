// pages/music-player/index.js
import { audioContext, playerStore } from '../../store/index'
const playModeNames = ['order', 'repeat', 'random']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    // 当前歌曲数据
    currentSong: {},
    // 记录头部歌曲|歌词
    currentPage: 0,
    // 内容高度
    contentHeight:0,
    // 是否显示歌词
    isMusicLyric: true,
    // 播放模式
    playModeIndex: 0,
    // 播放模式对应的图片
    playModeName: 'order',
    // 歌曲时长
    durationTime: 0,
    // 当前播放时间
    currentTime: 0,
    // 进度条
    sliderValue: 0,
    // 滑动改变进度条
    isSliderChanging: false,
    // 歌词
    lyricInfo: [],
    // 当前播放歌词文本
    currentLyricText: '',
    // 记录当前歌词匹配次数
    currentLyricIndex: 0,
    // 歌词滚动
    lyricScrollTop: 0,
    // 是否播放
    isPlaying: false,
    // 播放图片
    playName: 'pause'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.setData({ id })

    // playerStore.dispatch('playMusicWithSongIdAction', { id })

    this.setupPlayerStoreListener()
    // 动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - 44
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })
  },
  // 事件处理
  handleSwiperChange(event) {
    const current = event.detail.current
    this.setData({ currentPage: current})
  },
  handleSliderChange(event) {
    // 获取进度条的值
    const value = event.detail.value

    // 计算播放的时间长
    const currentTime = this.data.durationTime * value / 100
    // 设置进度条播放的时间点
    // audioContext.pause()  // 暂停
    audioContext.seek(currentTime / 1000)

    // 记录最新的进度条
    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  handleSliderChanging(event) {
    // 获取进度条的值
    const value = event.detail.value

    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime })
  },
  setupPlayerStoreListener() {
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfo'], ({
      currentSong,
      durationTime,
      lyricInfo
    }) =>{
       if (currentSong) this.setData({ currentSong })
       if (durationTime) this.setData({ durationTime })
       if (lyricInfo) this.setData({ lyricInfo })
    }),
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      if (currentLyricText) this.setData({ currentLyricText })
    }),
    playerStore.onStates(['playModeIndex', 'isPlaying'], ({ playModeIndex , isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] })
      }
      if (isPlaying !== undefined) {
        this.setData({ isPlaying, playName: isPlaying ? 'pause' : 'resume' })
      }
    })
  },
  // 返回
  handleBackClick() {
    wx.navigateBack()
  },
  // 播放模式
  handleModeBtnClick() {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    // 设置playerStore的playModeIndex的值
    playerStore.setState('playModeIndex', playModeIndex)
  },
  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePrevBtnClick() {
    playerStore.dispatch('changNewMusicAction', false)
  },
  handleNextBtnClick() {
    playerStore.dispatch('changNewMusicAction')
  }

})