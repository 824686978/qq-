// pages/music-player/index.js
import { getSongDetail, getSongLyric } from '../../service/api_player'
import { parseLyric } from '../../utils/parse-lyric'
import { audioContext } from '../../store/index'

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
    currentLyricIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.setData({ id })

    this.getPageData(id)
    // 动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - 44
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })

    // 创建播放器
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true
    this.setupAudioContextListener()
  },
  // 网络请求
  getPageData(id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
    })
    getSongLyric(id).then(res => {
      // 提取歌词
      const lyricString = res.lrc.lyric
      // 解析歌词
      const lyrics = parseLyric(lyricString)
      this.setData({ lyricInfo: lyrics })
    })
  },
  // 事件监听
  setupAudioContextListener() {
    // audioContext.onCanplay(() => {
    //   audioContext.play()
    // })
    // 获取当前播放时间
    audioContext.onTimeUpdate(() => {
      // 获取当前播放的时间
      const currentTime = audioContext.currentTime * 1000
      // 根据当前时间修改sliderValue和currentTime 
      if (!this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ sliderValue, currentTime })
      }
      // 根据当前播放时间查找对应歌词
      for (let i = 0; i < this.data.lyricInfo.length; i++) {
        const lyricInfo = this.data.lyricInfo[i]
        if (currentTime < lyricInfo.time) {
          const currentIndex = i - 1
          if (this.data.currentLyricIndex !== currentIndex) {
            const currentLyricInfo = this.data.lyricInfo[currentIndex]
            console.log(currentLyricInfo.text)
            this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex })
          }
          break
        }
      }
    })
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
    audioContext.pause()  // 暂停
    audioContext.seek(currentTime / 1000)

    // 记录最新的进度条
    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  handleSliderChanging(event) {
    // 获取进度条的值
    const value = event.detail.value

    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime, sliderValue: value })
  }


})