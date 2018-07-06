import React from 'react'
import SearchForm from '@/erp/container/SearchForm'
import { Table, Button } from 'antd'
import { getListData } from '@/erp/api'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import ExcelDown from '@/erp/config/excelDown'
import '@/erp/style/main.less'
import '@/erp/style/channel.less'
import path from '@/erp/config.json'

let search = {
  items: [{
    label: '年',
    type: 'select',
    field: 'year',
    data: [{id: '2018', label: '2018'}, {id: '2017', label: '2017'}, {id: '2016', label: '2016'}],
    defaultValue: moment().year()
  }, {
    label: '结束账期',
    type: 'select',
    field: 'months',
    data: [{id: 1, label:'1月'}, {id: 2, label: '2月'}, {id: 3, label: '3月'}, {id: 4, label: '4月'}, {id: 5, label: '5月'}, {id: 6, label:'6月'}, {id: 7, label:'7月'}, {id: 8, label:'8月'}, {id: 9, label:'9月'}, {id: 10, label:'10月'}, {id: 11, label:'11月'}, {id: 12, label:'12月'}],
    defaultValue: moment().month() + ''
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
    let year = this.state.searchParams.year
    let months = this.state.searchParams.months
    this.props.history.push(`/main/XFviewDetail/@/erp{ChannelId}/@/erp{name}/@/erp{year}/@/erp{months}`)
  }
  onDownload () {
    ExcelDown().tableToExcel('dataTable', '续费情况统计')
  }
  export(Flag) {
    var Params = _.cloneDeep(this.state.searchParams)
    var query = $.param(Params)
    query = '?' + query
    let url
    if (Flag === 1) {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/download/getexpireorderdetails' + query
    } else if (Flag === 2) {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/download/getnoreorderdetails' + query
    } else if (Flag === 3) {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/download/getreorderdetails' + query
    }
    return url
  }
  onSearch(vals={}) {
    if (vals && !vals.year) {
      vals.year = moment().year()
      vals.months = moment().month()
    }
    this.setState({searchParams: vals, loading: true})
    // 处理开始默认空字符串
    console.log(vals, 'searchParams')
    return getListData('report/getreordersnum', vals).then(res => {
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
    console.log(moment().month(), typeof(moment().month()))
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
      title: '到期客户数',
      dataIndex: 'ExpireNum',
      render: (val, record) => {
        if (record.ChannelName1 == '合计') {
          let downloadpath = this.export(1)
          return (
            <a href={downloadpath}>{val}</a>
          )
        } else {
          return (
            <span className="href" onClick={() => this.goDetail(record.ChannelId, '到期客户明细')}>{val}</span>
          )
        }
      }
    }, {
      title: '未续费客户数',
      dataIndex: 'NoReNum',
      render: (val, record) => {
        if (record.ChannelName1 == '合计') {
          let downloadpath = this.export(2)
          return (
            <a href={downloadpath}>{val}</a>
          )
        } else {
          return (
            <span className="href" onClick={() => this.goDetail(record.ChannelId, '未续费客户明细')}>{val}</span>
          )
        }
      }
    }, {
      title: '已续费客户数',
      dataIndex: 'ReNum',
      render: (val, record) => {
        if (record.ChannelName1 == '合计') {
          let downloadpath = this.export(3)
          return (
            <a href={downloadpath}>{val}</a>
          )
        } else {
          return (
            <span className="href" onClick={() => this.goDetail(record.ChannelId, '续费客户明细')}>{val}</span>
          )
        }
      }
    }]
    search.buttons = [
      <Button key="1" type="primary" onClick={this.onDownload} style={{marginLeft: '20px'}}>导出</Button>
    ]
    const datasource = _.cloneDeep(this.state.data)
    let datalast
    if (datasource.length > 0) {
      let sumData = [{
        ChannelName1: '合计',
        ChannelId: _.uniqueId('sum_'),
        ExpireNum: 0,
        NoReNum: 0,
        ReNum: 0
      }]
      _.each(datasource, item => {
        sumData[0]['ExpireNum'] += Number(item.ExpireNum)
        sumData[0]['NoReNum'] += Number(item.NoReNum)
        sumData[0]['ReNum'] += Number(item.ReNum)
      })
      datalast = datasource.concat(sumData)
    }
    return (
      <div className="more-notice recharge-apply" style={{ background: '#fff', padding: '10px' }}>
        <h3 className="vheader">续费情况统计</h3>
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