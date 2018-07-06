import React from 'react'
import SearchForm from '@/erp/container/SearchForm'
import { Table, Button } from 'antd'
import { getListData } from '@/erp/api'
import moment from 'moment'
import _ from 'lodash'
import $ from 'jquery'
import ExcelDown from '@/erp/config/excelDown'
import '@/erp/style/main.less'
import '@/erp/style/channel.less'
import path from '@/erp/config.json'

let search = {
  items: [{
    label: '',
    type: 'date',
    field: 'startdate',
    defaultValue: moment().startOf('month')
  }, {
    label: '',
    type: 'date',
    field: 'enddate',
    defaultValue: moment().endOf('month')
  }, {
    label: '代理商状态',
    type: 'select',
    field: 'status',
    data: [{ id: ' ', label: '全部' }, { id: '1', label: '正常' }, { id: '0', label: '解约' }],
    defaultValue: ' '
  }],
  buttons:[]
}

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchParams: {},
      loading: false,
      data: [],
      qdpath: path
    }
    this.export = this.export.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onDownload = this.onDownload.bind(this)
    this.goDetail = this.goDetail.bind(this)
  }
  goDetail (ChannelId, name) {
    let start = this.state.searchParams.startdate
    let end = this.state.searchParams.enddate
    this.props.history.push(`/main/LZviewDetail/@/erp{ChannelId}/@/erp{name}/@/erp{start}/@/erp{end}`)
  }
  onDownload () {
    ExcelDown().tableToExcel('dataTable', '预提单转正式订单统计')
  }
  export(flag) {
    var Params = _.cloneDeep(this.state.searchParams)
    var query = $.param(Params)
    query = '?' + query
    let url
    if (flag === 1) {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exportzerolist' + query
    } else if (flag === 2) {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exporttolittlelist' + query
    } else if (flag === 3) {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exportzerotoformallist' + query
    }
    return url
  }
  onSearch(vals={}) {
    if (vals && !vals.startdate) {
      vals.startdate = moment().startOf('month').format('YYYY-MM-DD')
      vals.enddate = moment().endOf('month').format('YYYY-MM-DD')
    }
    this.setState({searchParams: vals, loading: true})
    // 处理开始默认空字符串
    console.log(vals, 'searchParams')
    return getListData('dataanalysis/Iszerostatistics', vals).then(res => {
      if(res.status){
        this.setState({
          loading: false,
          data: res.data
        });
      }
      return res;
    },err=>{
      this.setState({
        loading: false
      });
    })
  }
  componentWillMount () {
    this.onSearch()
  }
  render () {
    const columns = [{
      title: '省份',
      dataIndex: 'ProvinceName'
    }, {
      title: '城市',
      dataIndex: 'CityName'
    }, {
      title: '一级代理商',
      dataIndex: 'ChannelName1'
    }, {
      title: '二级代理商',
      dataIndex: 'ChannelName2'
    }, {
      title: '代理商状态',
      dataIndex: 'Status',
      render: val => {
        if (val === 1) {
          return '正常'
        } else if (val === 0) {
          return '解约'
        }
      }
    }, {
      title: '零申报数量',
      dataIndex: 'zeronum',
      render: (val, record) => {
        if (record.ChannelName1 == '合计') {
          let downloadpath = this.export(1)
          return (
            <a href={downloadpath}>{val}</a>
          )
        } else {
          return (
            <span className="href" onClick={() => this.goDetail(record.ChannelId, '零申报明细表')}>{val}</span>
          )
        }
      }
    }, {
      title: '转小规模数量',
      dataIndex: 'littlenum',
      render: (val, record) => {
        if (record.ChannelName1 == '合计') {
          let downloadpath = this.export(2)
          return (
            <a href={downloadpath}>{val}</a>
          )
        } else {
          return (
            <span className="href" onClick={() => this.goDetail(record.ChannelId, '零申报转小规模明细表')}>{val}</span>
          )
        }
      }
    }, {
      title: '转一般纳税人数量',
      dataIndex: 'formalnum',
      render: (val, record) => {
        if (record.ChannelName1 == '合计') {
          let downloadpath = this.export(3)
          return (
            <a href={downloadpath}>{val}</a>
          )
        } else {
          return (
            <span className="href" onClick={() => this.goDetail(record.ChannelId, '零申报转一般纳税人明细表')}>{val}</span>
          )
        }
      }
    }]
    search.buttons = [
      <Button key="1" type="primary" onClick={this.onDownload} style={{marginLeft: '20px'}}>导出</Button>
    ]
    const datasource = _.cloneDeep(this.state.data)
    // const datasource = [{"CreateDate":"2018-02-26","PartitionName":"西北区","parcode":38,"ccode":"650100","pcode":"650000","ProvinceName":"新  疆","ChannelId":"106501161010000035","pChannelid":"106501161010000035","ChannelName1":"新疆同城定制商务咨询有限公司","ChannelName2":"","CityName":"乌鲁木齐市","Status":1,"zeronum":5.0,"littlenum":1.0,"formalnum":0.0}]
    let datalast
    if (datasource.length > 0) {
      let sumData = [{
        ChannelName1: '合计',
        ChannelId: _.uniqueId('sum_'),
        zeronum: 0,
        littlenum: 0,
        formalnum: 0
      }]
      _.each(datasource, item => {
        sumData[0]['zeronum'] += Number(item.zeronum)
        sumData[0]['littlenum'] += Number(item.littlenum)
        sumData[0]['formalnum'] += Number(item.formalnum)
      })
      datalast = datasource.concat(sumData)
    }
    return (
      <div className="more-notice recharge-apply" style={{ background: '#fff', padding: '10px' }}>
        <h3 className="vheader">零申报转非零申报统计</h3>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
        <Table columns={columns}
          rowKey={record => record.ChannelId}
          dataSource={datalast}
          pagination={false}
          loading={this.state.loading}
          size="middle"
          bordered={true}
          id="dataTable"
        />
      </div>
    )
  }
}