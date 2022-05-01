import yjRequest from './index'
// 获取歌曲详情数据
export function getSongDetail(ids) {
  return yjRequest.get('/song/detail', { ids })
}
// 获取歌词
export function getSongLyric(id) {
  return yjRequest.get('/lyric', {
    id
  })
}