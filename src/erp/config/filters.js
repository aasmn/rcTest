const contractType = {
  1: '新增',
  2: '续费'
}
const contractStatus = { //合同，财务状态
  2: '待审核',
  3: '已审核',
  4: '已驳回',
  5: '已结束',
  8: '已中止'
}
export default {}
//权限类
export const powerList = (plist) => {
  if (Array.isArray(plist)) {
    return (key) => { return plist.map(p => p.FunctionKey).indexOf(key) > -1; }
  }
  return () => false;
}

// 状态类
export const fContractType = (val) => {
  return contractType[val] || ''
}
// export const fOrderStatus =(val)=>{
//     return contractStatus[val]||''
// }
export const fFinancialAuditStatus = (val) => {
  return contractStatus[val] || ''
}
export const fServiceStatus = (status) => { //服务状态
  var str = ''
  switch (+status) {
    case 1:
      str = '待分配'
      break;
    case 2:
      str = '未开始'
      break;
    case 3:
      str = '外勤服务'
      break;
    case 4:
      str = '外勤会计服务'
      break;
    case 5:
      str = '会计服务'
      break;
    case 7:
      str = '结束'
      break;
    case 8:
      str = '中止'
      break;
  }
  return str
}
export const fCheckStatus = function (status) { //会计,外勤 处理状态
  var str = ''
  switch (+status) {
    case 0:
      str = '(空)'
      break;
    case 1:
      str = '待审核'
      break;
    case 2:
      str = '已审核'
      break;
    case 3:
      str = '已驳回'
      break;
    case 4:
      str = '外勤提交'
      break;
    case 5:
      str = '部分确认'
      break;
    case 6:
      str = '已提交'
      break;
    case 7:
      str = '已结束'
      break;
    case 8:
      str = '已中止'
      break;
  }
  return str
}
export const fPartTax = function (status) {
  var str = ''
  switch (+status) {
    case 0:
      str = '(空)'
      break;
    case 1:
      str = '国税报道'
      break;
    case 2:
      str = '地税报道'
      break;
  }
  return str
}
export const fMainTaskStatus = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '待分配'
      break;
    case 2:
      str = '待处理'
      break;
    case 3:
      str = '进行中'
      break;
    case 4:
      str = '已完成'
      break;
    case 5:
      str = '已取消'
      break;
  }
  return str
}
export const fSubTaskStatus = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '待分配'
      break;
    case 2:
      str = '待处理'
      break;
    case 3:
      str = '进行中'
      break;
    case 4:
      str = '已取消'
      break;
    case 5:
      str = '已完成'
      break;
  }
  return str
}

export const fOutworkStatus = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '启用'
      break;
    case 2:
      str = '停用'

      break;
  }
  return str
}
export const fOrderSource = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '电销'
      break;
    case 2:
      str = '天猫'

      break;
  }
  return str
}
export const fContractStatus = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '正常';
      break;
    case 2:
      str = '结束';
      break;
    case 3:
      str = '已中止';
      break;
    case 4:
      str = '已作废';
      break;
    case 5:
      str = '已变更';
      break;
    case 6:
      str = '变更中';
      break;
    case 7:
      str = '中止中';
      break;

  }
  return str
}

export const fOrderStatus = function (status, sourceId) {
  var str = ''
  switch (+status) {
    case 1:
      str = '审单待审核'
      break;
    case 2:
      str = '审单已审核'
      break;
    case 3:
      str = '审单驳回'
      break;
    case 4:
      if (sourceId === 1)
        str = '财务已审核';
      else
        str = '网店到款';
      break;
    case 5:
      str = '财务已驳回'
      break;
    case 6:
      str = '财务确认'
      break;
    case 7:
      str = '总经理审核'
      break;
    case 8:
      str = '总经理驳回'
      break;
    case 9:
      str = '已退款'
      break;
  }
  return str;
}


export const fTaxStatus = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '未开始'
      break;
    case 2:
      str = '挂起'
      break;
    case 3:
      str = '服务中'
      break;
  }
  return str
}
export const fAddedValue = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '小规模'
      break;
    case 2:
      str = '一般纳税人'
      break;
  }
  return str
}
export const fAccountantStatus = function (status) {
  var str = ''
  switch (+status) {
    case 0:
      str = '(空)'
      break;
    case 1:
      str = '待审核'
      break;
    case 2:
      str = '已审核'
      break;
    case 3:
      str = '已驳回'
      break;
    case 5:
      str = '部分审核'
      break;
  }
  return str;
}

// 日期类
export const fDate = (val) => {
  if ((!val) || val.substr(0, 4) === '0001') return '';
  return val.substr(0, 10);
}
export const fDateT = (val) => {
  if ((!val) || val.length < 10 || val.substr(0, 4) === '0001') return '';
  return val.substr(0, 19).replace('T', ' ');
}
export const fMonth = (val) => {
  if ((!val) || val.length < 10 || val.substr(0, 4) === '0001') return '';
  return val.substr(0, 7);
}
// 类型
export const fBusinessType = function (type) {
  var str = ''
  switch (+type) {
    case 1:
      str = '税务'
      break;
    case 2:
      str = '工商'
      break;
    case 3:
      str = '其他'
      break;
    case 4:
      str = '特殊'
      break;
  }
  return str
}

// 费用类
export const fPrice = (val) => {
  val = parseFloat(val);
  if (isNaN(val)) return '';
  return '￥' + val.toFixed(2)
}

// 操作过滤
export const fOperation = function (type) {
  var str = ''
  switch (+type) {
    case 1:
      str = '标记'
      break;
    case 2:
      str = '挂起'
      break;
  }
  return str
}
// 标记过滤
export const fMark = function (type) {
  var str = ''
  switch (+type) {
    case 1:
      str = '低'
      break;
    case 2:
      str = '中'
      break;
    case 3:
      str = '高'
      break;
  }
  return str
}

export const fAgentStatus = function (status) { //中心账户 数据修改
  var str = ''
  switch (+status) {
    case 1:
      str = '正常'
      break;
    case 2:
      str = '挂起'
      break;
    case 5:
      str = '建账中'
      break;
  }
  return str
}
export const fContractReviewStatus = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '审单审核'
      break;
    case 2:
      str = '外勤审核'
      break;
    case 3:
      str = '会计审核'
      break;
    case 4:
      str = '城市总审核'
      break;
    case 5:
      str = '财务打款'
      break;
    case 6:
      str = '结束'
      break;
    case 12:
      str = '外勤驳回'
      break;
    case 13:
      str = '会计驳回'
      break;
    case 14:
      str = '城市总驳回'
      break;
  }
  return str;

}
export const fDKStatus = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '财务打款'
      break;
    case 2:
      str = '结束'
      break;
  }
  return str;

}
export const fInfoSource = function (val) {
  var str = ''
  switch (+val) {
    case 1:
      str = '天眼查'
      break;
    case 2:
      str = '国家信息公示网'
      break;
    case 3:
      str = '特殊公司'
      break;
    default:
      str = "";
  }
  return str;
}
export const fAssigningObject = function (val) {
  var str = ''
  switch (+val) {
    case 1:
      str = '外勤'
      break;
    case 2:
      str = '会计'
      break;
    case 3:
      str = '外勤会计'
      break;
    default:
      str = "";
  }
  return str;
}
export const fLingYongStatus = (val) => {
  // 2主管驳回，3主管审核，4财务打款失败，5财务打款,6结束
  var str = ''
  switch (+val) {
    case 2:
      str = '主管驳回'
      break
    case 3:
      str = '主管审核'
      break
    case 4:
      str = '财务打款失败'
      break
    case 5:
      str = '财务打款'
      break
    case 6:
      str = '结束'
  }
  return str
}