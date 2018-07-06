var tableToExcel = (function () {
  var uri = 'data:application/vnd.ms-excel;base64,'
  var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset=\'UTF-8\'><style>table td, table th {border-color: #ccc;}</style></head><body><table border="1" style="border-color: #ccc; border-collapse: collapse;">{table}</table></body></html>'
  var base64 = function (s) {
    return window.btoa(unescape(encodeURIComponent(s)))
  }
  var format = function (s, c) {
    return s.replace(/{(\w+)}/g, function (m, p) {
      return c[p]
    })
  }
  return function (table, name) {
    if (!table.nodeType) {
      table = document.getElementById(table)
    }
    var ctx = {
      worksheet: name || 'Worksheet',
      table: table.innerHTML
    }
    var href = uri + base64(format(template, ctx))
    var el = document.createElement('a')
    el.href = href
    el.download = name + '.xls'
    el.setAttribute('style', 'display: none')
    document.documentElement.append(el)
    el.click()
    document.documentElement.removeChild(el)
  }
})()
export default function exportToExcel (tableid) {
  tableToExcel(tableid)
}
$.exportToExcel = $.fn.exportToExcel = function (name) {
  console.log(this, 'arg')
  console.log($(this))
  var copy = $(this).clone().get(0)
  tableToExcel(copy, name)
}
