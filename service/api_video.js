import yjRequest from './index'

// 请求视频信息
export function getTopMv(offset, limit = 10) {
  return yjRequest.get('/top/mv', {
    offset,
    limit
  })
}

// 请求MV地址
export function getMVURL(id) {
  return yjRequest.get('/mv/url', { id })
}

// 请求MV数据
export function getMVDetail(mvid) {
  return yjRequest.get('/mv/detail', { mvid })
}

// 请求MV相关商品
export function getMVRelated(id) {
  return yjRequest.get('/related/allvideo', { id })
}