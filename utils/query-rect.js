// 查询组件的高度（用于轮播图）
export default function (selector) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec((res) => {
      resolve(res)
    })
  })
}