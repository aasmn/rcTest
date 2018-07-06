export default () => {
    var uri = 'data:application/vnd.ms-excel;base64,'
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head encoding="utf-8"><!--[if gte mso 9]><xml version="1.0" encoding="utf-8"><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>'
    var base64 = function(s) {
      return window.btoa(unescape(encodeURIComponent(s)))
    }
    var format = function(s, c) {
      return s.replace(/{(\w+)}/g, function(m, p) {
        return c[p]
      })
    }
    return {
      tableToExcel: function(tableId, worksheetName) {
        var el = document.createElement('a')
        var table = document.getElementById(tableId)
        var ctx = { worksheet: worksheetName, table: table.innerHTML }
        var href = uri + base64(format(template, ctx))
        el.href = href
        el.download = worksheetName + '.xls'
        el.setAttribute('style', 'display: none')
        document.documentElement.append(el)
        el.click()
        document.documentElement.removeChild(el)
        // return href
      }
    }
  }
  