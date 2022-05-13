import { HYEventStore } from 'hy-event-store'
import { parseLyric } from '../utils/parse-lyric'
import { getSongDetail, getSongLyric } from '../service/api_player'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    // 记录是否第一次播放
    isFirstPlay: true,
    isStoping: false,
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfo: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    isPlaying: false, // 是否播放
    // 播放模式
    playModeIndex: 0, // 0: 循环播放 1：单曲循环  2： 随机播放
    // 歌曲列表
    playListSongs: [],
    // 当前歌曲索引
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      // 重新进来播放同一位置
      if (ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id
      ctx.isPlaying = true
      // 重新请求去除上次的数据
      ctx.currentSong = {}
      ctx.ctxdurationTime = 0
      ctx.lyricInfo = []
  
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 请求歌曲数据
      getSongLyric(id).then(res => {
        // 提取歌词
        const lyricString = res.lrc.lyric
        // 解析歌词
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfo = lyrics
      }),
      // 播放该歌曲播放器
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      if (ctx.isFirstPlay) {
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirstPlay = false
      }
      
    },
    setupAudioContextListenerAction(ctx) {
      // 监听歌曲播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 监听当前播放时间
      audioContext.onTimeUpdate(() => {
        // 获取当前播放的时间
        const currentTime = audioContext.currentTime * 1000
        // 根据当前时间修改sliderValue和currentTime 
        ctx.currentTime = currentTime
        // 根据当前播放时间查找对应歌词
        if (!ctx.lyricInfo.length) return
        for (let i = 0; i < ctx.lyricInfo.length; i++) {
          const lyricInfo = ctx.lyricInfo[i]
          if (currentTime < lyricInfo.time) {
            const currentIndex = i - 1
            if (ctx.currentLyricIndex !== currentIndex) {
              const currentLyricInfo = ctx.lyricInfo[currentIndex]
              ctx.currentLyricIndex = currentIndex
              ctx.currentLyricText = currentLyricInfo.text

            }
            break
          }
        }
      })
      // 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch('changNewMusicAction')
      })
      // 监听音乐暂停/播放
      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      // 停止状态
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = currentSong.name
        audioContext.seek(ctx.currentTime)
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changNewMusicAction(ctx, isNext = true) {
      // 获取当前索引
      let index = ctx.playListIndex
      
      // 2.根据不同的播放模式， 获取下一首歌的索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index  = ctx.playListSongs.length -1
          if (index === ctx.playListSongs.length) index = 0
          break
        case 1: // 单曲循环
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }

      
      // 获取歌曲
      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        // 记录新的索引
        ctx.playListIndex = index
      }
      // 播放新的歌曲
      this.dispatch('playMusicWithSongIdAction', { id: currentSong.id, isRefresh: true })
    },
  }
})
export {
  audioContext,
  playerStore
}