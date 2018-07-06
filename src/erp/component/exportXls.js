/**
 * Created by oyhanyu on 2018/3/7.
 * 导出excel
 */
import XLSX from 'xlsx'
import * as XLSXSTYLE from 'xlsx-style'
var DEFAULT_CELL_WIDTH = 100
function exportByTable (tableDom, headerText, option) {
  var wrapperHeader = exportUtil.wrapperHeader(tableDom, headerText, option.colSpan)
  if (!wrapperHeader) return
  var ws = this.table_to_sheet(wrapperHeader, { skipHeader: true })
  ws = exportUtil.formatNumberCell(ws, option.except || [], option.cellWidth || {})
  var wb = XLSX.utils.book_new()
  var sheetName = option.sheetName || 'Sheet1'
  var fileName = option.fileName
  exportUtil.addHeaderStyle(ws)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  exportUtil.saveWithStyle(wb, fileName, option.type || 'biff2')
}
function exportByJson (json = [], headerText, option = {}) {
  if (!json) {
    return
  }
  headerText ? json.unshift({}) : void (0)
  let defaultMerges = []
  const {headerIndex, merges, sheetName, fileName, except = [], cellWidth = {}, type} = option
  let ws = XLSX.utils.json_to_sheet(json, {header: headerIndex, skipHeader: true})
  ws = exportUtil.formatNumberCell(ws, except, cellWidth)
  if (headerText) {
    const colNum = Object.keys(json[1] || {}).length
    defaultMerges.push({
      s: {
        c: 0,
        r: 0
      },
      e: {
        c: colNum - 1,
        r: 0
      }
    })
    ws[`@/erp{headerIndex[0]}1`] = {t: 's', v: headerText}
  }
  if (merges) {
    ws['!merges'] = defaultMerges.concat(merges)
  }
  exportUtil.addHeaderStyle(ws)
  var wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1')
  exportUtil.saveWithStyle(wb, fileName, type || 'biff2')
}
var exportUtil = {
  addHeaderStyle (ws) {
    ws['A1'].s = {
      alignment: {
        vertical: 'center',
        horizontal: 'center'
      },
      font: {
        bold: true
      },
      fill: {
        bgColor: { indexed: 64 },
        fgColor: { rgb: 'CDC0B0' }
      }
    }
    return ws
  },
  formatNumberCell (ws, except, cellWidth) {
    const keys = Object.keys(ws)
    ws['!cols'] = ws['!cols'] || []
    keys.forEach((key) => {
      var keyStart = key.substring(0, 1)
      if (!exportUtil.includes(except, keyStart)) {
        if (key !== '!ref' && ws[key].t === 'n') {
          if (ws[key].v || ws[key].v === 0) {
            if (ws[key].v === 0 || ws[key].v.toString().indexOf('.') === -1) {
              ws[key].z = '#0.00'
            }
          }
        }
      } else {
        if (key !== '!ref') {
          ws[key].t = 's'
        }
      }
      if (key !== '!ref' && key !== '!cols' && key !== '!merges') {
        ws['!cols'].push({
          wpx: cellWidth[keyStart] || DEFAULT_CELL_WIDTH
        })
      }
      if (ws[key].z === 'm/d/yy') {
        ws[key].t = 'n'
        ws[key].z = 'yyyy-mm-dd'
      }
    })
    ws['!cols'].shift()
    return ws
  },
  wrapperHeader (tableDom, text, colspan) {
    if (!tableDom) {
      return null
    }
    var cloneNode = tableDom.cloneNode(true)
    var tr = document.createElement('tr')
    var td = document.createElement('td')
    colspan = colspan || cloneNode.rows.item(0).cells.length
    td.setAttribute('colSpan', colspan)
    text = document.createTextNode(text || '')
    td.appendChild(text)
    tr.appendChild(td)
    var thead = cloneNode.getElementsByTagName('thead')[0]
    var firstChild = thead.firstChild
    thead.insertBefore(tr, firstChild)
    return cloneNode
  },
  concatTable (header, body) {
    if (!header || !body) {
      return null
    }
    var table = document.createElement('table')
    table.appendChild(header.cloneNode(true))
    table.appendChild(body.cloneNode(true))
    return table
  },
  includes (arr, key) {
    if (Array.prototype.includes) {
      return arr.includes(key)
    } else {
      var newArr = arr.filter(function (el) {
        return el === key
      })
      return newArr.length > 0
    }
  },
  getCharCol (n) {
    let s = ''
    let m = 0
    while (n > 0) {
      m = n % 26 + 1
      s = String.fromCharCode(m + 64) + s
      n = (n - m) / 26
    }
    return s
  },
  s2ab (s) {
    if (typeof ArrayBuffer !== 'undefined') {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    } else {
      buf = new Array(s.length)
      for (var j = 0; j !== s.length; ++j) buf[j] = s.charCodeAt(j) & 0xFF
      return buf
    }
  },
  saveNoStyle (wb, fileName) {
    XLSX.writeFile(wb, fileName + '.xlsx' || '导出.xlsx')
  },
  saveWithStyle (wb, fileName = '导出', type) {
    var tmpa = document.createElement('a')
    var isSupportDownload = 'download' in tmpa
    if (isSupportDownload) {
      const bookType = type ? type === 'biff2' ? 'xlsx' : type : 'xlsx'
      const tmpDown = new Blob([this.s2ab(XLSXSTYLE.write(wb,
        { bookType, bookSST: false, type: 'binary' }
      ))], {
        type: ''
      })
      // tmpa = document.getElementById('normalDownload')
      tmpa.download = fileName + '.' + (type === 'biff2' ? 'xls' : bookType)
      tmpa.href = URL.createObjectURL(tmpDown)
      tmpa.click()
      setTimeout(function () {
        URL.revokeObjectURL(tmpDown)
      }, 100)
    } else {
      this.saveNoStyle(wb, fileName)
    }
  }
}
export default {
  sheet_to_json: XLSX.utils.sheet_to_json,
  table_to_sheet: XLSX.utils.table_to_sheet,
  XLSX,
  exportByTable,
  concatTable: exportUtil.concatTable,
  exportByJson
}
