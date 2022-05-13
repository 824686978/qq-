// pages/detail-songs/index.js
import { playerStore, rankingStore } from '../../store/index'
import { getSongMenuDetail } from '../../service/api_music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    // 榜单
    ranking: '',
    // 榜单的数据
    songInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({ type })
    if (type === 'menu') {
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({ songInfo: res.playlist })
      })
    } else if (type === 'rank') {
      const ranking = options.ranking
      this.setData({ ranking })
      rankingStore.onState(ranking, this.getRangkingDataHanlder)
    }
    
  },

 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRangkingDataHanlder)
    }
  },

  // 事件处理函数
  getRangkingDataHanlder(res) {
    this.setData({ songInfo: res })
  },
  handleItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.songInfo.tracks)
    playerStore.setState('playListIndex', index)
  }
})