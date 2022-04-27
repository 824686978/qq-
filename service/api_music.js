import yjRequest from './index'

// 请求轮播图数据
export function getBanners() {
  return yjRequest.get("/banner", {
    type: 2
  })
}

// 请求首页歌曲数据
export function getRankings(idx) {
  return yjRequest.get("/top/list", {
    idx
  })
}

// 请求歌单数据
export function getSongMenu(cat="全部", limit=6 , offset=0) {
  return yjRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}
// 请求歌单详情
export function getSongMenuDetail(id) {
  return yjRequest.get('/playlist/detail/dynamic', {
    id
  })
}
