// 获取query中的参数
const queryString = item => {
  let svalue = window.location.search.match(new RegExp('[?&]' + item + '=([^&]*)(&?)', 'i'))

  return Array.isArray(svalue) ? svalue[1] : ''
}
export default queryString
