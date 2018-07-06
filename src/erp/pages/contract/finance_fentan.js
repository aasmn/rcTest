import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
import { getListData, deleteData, putData } from '@/erp/api'
import { Button, message } from 'antd'
import _ from 'lodash'
import { fDate } from '@/erp/config/filters'
import Dialog from '@/erp/container/Dialog'
import FtCard from '@/erp/component/FtCard'
import ExportXlsUtil from '@/erp/component/exportXls'
import Confirm from '@/erp/component/Confirm'
// 分摊表

let search = {
  items: [{
    label: '月份选择',
    type: 'month',
    field: 'beginMonth'
  }, {
    label: '至',
    type: 'month',
    field: 'endMonth'
  }, {
    label: '所属公司',
    type: 'custom',
    field: 'subsidiaryId',
    view: BelongCompany,
    options: {
      hideAll: true
    }
  }],
  buttons: []
};

class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchParams: {},
      data: []
    };
    this.onSearch = this.onSearch.bind(this);
  }
  onSearch (params) {
    if (!params.beginMonth) {
      message.error('起始月份不能为空！')
      return;
    }
    if (!params.endMonth) {
      message.error('结束月份不能为空！')
      return;
    }
    if (!params.subsidiaryId) {
      message.error('所属公司不能为空！')
      return;
    }
    this.setState({ searchParams: params });
    getListData('order/incomeapportionmentbymonth', params).then(res => {
      if (res.status) {
        if (res.data.length > 1) {
          const cnt = _.reduce(res.data, (r, t) => {
            r.totalAmount += +t.totalAmount;
            r.totalRefundAmount += +t.totalRefundAmount;
            r.totalCustomer += t.totalCustomer;
            r.totalRefundCustomer += t.totalRefundCustomer
            return r
          }, {
              "totalAmount": 0,
              "totalRefundAmount": 0,
              "totalCustomer": 0,
              "totalRefundCustomer": 0
            })
          cnt.yearMonth = [res.data[0].yearMonth, '至', res.data[res.data.length - 1].yearMonth, '汇总'].join('')
          cnt.isTotal = true;
          res.data.push(cnt)
        }

        this.setState({
          data: res.data
        })
      }
    })
  }
  onDownload = (item) => {
    Confirm({
      handleOk: () => {
        this.download(item);
        return true;
      },
      message: '[温馨提示]数据下载量大时，请稍作等待。',
      okText: '确认下载'
    })
  }
  download = (item) => {
    let params = _.clone(this.state.searchParams)
    if (!item.isTotal) {
      params.beginMonth = item.yearMonth;
      params.endMonth = item.yearMonth;
    }
    params.isExport = 1
    getListData('order/incomeapportionmentbymonth', params).then(res => {
      if (!res.status) return;
      const data = res.data
      let headers = ['ReportMonth', // 月份
        'FinancialTime', // 创建时间
        'SubsidiaryName', // 直营
        'CompanyName',// 公司名称
        'ChildItemName',// 纳税类别 纳税性质
        'OrderNo',    //订单编号
        'ContractNo', // 合同编号
        'IsRefund',  // 是否退款
        'RefundAmount', // 退款金额
        'Refund',      // 退款日期
        'ContractDate', // 签订日期
        'OrderMonths',//  服务期限
        'ServiceStart', //开始账期
        'ServiceEnd',//结束账期
        'Amount', // 费用
        'TotalAmount' // 分摊合计
      ]
      var addon
      if (res.data.length > 0) {
        addon = _.filter(_.keys(data[0]), (key) => {
          return !isNaN(key.substr(0, 4))
        }).sort((a,b)=>{
          return a>b? 1: -1;
        })
        headers = headers.concat(addon)
      }
      let json = [{
        'ReportMonth': '月份',
        'FinancialTime': '创建时间',
        'SubsidiaryName': '直营',
        'CompanyName': '公司名称',
        'ChildItemName': '纳税类别',
        'OrderNo': '订单编号',
        'ContractNo': '合同编号',
        'IsRefund': '是否退款',
        'RefundAmount': '退款金额',
        'Refund': '退款日期',
        'ContractDate': '签订日期',
        'OrderMonths': '服务期限',
        'ServiceStart': '开始账期',
        'ServiceEnd': '结束账期',
        'Amount': '费用',
        'TotalAmount': "分摊合计"
      }]
      if (addon) {
        let title = json[0]
        addon.forEach(key => {
          title[key] = key
        })
      }
      data.forEach(list => {
        list.OrderMonths = list.OrderMonths + list.GiftMonths;
        json.push(_.pick(list, headers))
      });
      ExportXlsUtil.exportByJson(json, '', {
        headerIndex: headers,
        fileName: '分摊表'
      })
    })
  }
  render () {
    return (
      <div>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch} />
        <div>
          {this.state.data.map((item, index) => {
            return <FtCard key={index} data={item} onDownload={e => { this.onDownload(item) }} />
          })}
        </div>
      </div>
    );
  }
}

export default Main
