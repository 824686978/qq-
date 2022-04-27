import yjRequest from './index'
// 搜索热门词
export function getSearchHot() {
  return yjRequest.get('/search/hot')
}
// 搜索提示词
export function getSearchSuggest(keywords) {
  return yjRequest.get('/search/suggest', {
    keywords,
    type: 'mobile'
  })
}

// 关键字搜索
export function getSearchResult(keywords) {
  return yjRequest.get('/search', {
    keywords
  })
}


