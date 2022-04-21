import yjRequest from './index'

// 请求轮播图数据
export function getBanners() {
  return yjRequest.get("/banner", {
    type: 2
  })
}