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
  }
  onDownload () {
    ExcelDown().tableToExcel('dataTable', '外勤状况统计')
  }
  export(ChannelId, isMainTask) {
    var Params = _.cloneDeep(this.state.searchParams)
    Params.channelid = ChannelId
    var query = $.param(Params)
    query = '?' + query
    let url
    if (isMainTask) {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/download/getmaintaskdetails' + query
    } else {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/download/getchildtaskdetails' + query
    }
    return url
  }
  onSearch(vals={}) {
    this.setState({searchParams: vals, loading: true})
    // 处理开始默认空字符串
    console.log(vals, 'searchParams')
    if (vals && !vals.startdate) {
      vals.startdate = moment().startOf('month').format('YYYY-MM-DD')
      vals.enddate = moment().endOf('month').format('YYYY-MM-DD')
    }
    console.log(vals)
    return getListData('dataanalysis/gettasknum', vals).then(res => {
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
      title: '预提单数',
      dataIndex: 'ordernum'
    }, {
      title: '外勤总任务数',
      dataIndex: 'allmainnum',
      render: (val, record) => {
        if (record.ChannelName1 == '合计') {
          return (<span>{val}</span>)
        } else {
          let downloadpath = this.export(record.ChannelId, true)
          return (
            <a href={downloadpath}>{val}</a>
          )
        }
      }
    }, {
      title: '总任务待分配',
      dataIndex: 'mainnum1',
    }, {
      title: '总任务待处理',
      dataIndex: 'mainnum2'
    }, {
      title: '总任务进行中',
      dataIndex: 'mainnum3'
    }, {
      title: '总任务已完成',
      dataIndex: 'mainnum4'
    }, {
      title: '总任务已取消',
      dataIndex: 'mainnum5'
    }, {
      title: '子任务总数量',
      dataIndex: 'allchildnum',
      render: (val, record) => {
        if (record.ChannelName1 == '合计') {
          return (<span>{val}</span>)
        } else {
          let downloadpath = this.export(record.ChannelId, false)
          return (
            <a href={downloadpath}>{val}</a>
          )
        }
      }
    }, {
      title: '子任务待分配',
      dataIndex: 'childnum1'
    }, {
      title: '子任务待处理',
      dataIndex: 'childnum2'
    }, {
      title: '子任务进行中',
      dataIndex: 'childnum3'
    }, {
      title: '子任务已完成',
      dataIndex: 'childnum4'
    }, {
      title: '子任务已取消',
      dataIndex: 'childnum5'
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
        ordernum: 0,
        allmainnum: 0,
        mainnum1: 0,
        mainnum2: 0,
        mainnum3: 0,
        mainnum4: 0,
        mainnum5: 0,
        allchildnum: 0,
        childnum1: 0,
        childnum2: 0,
        childnum3: 0,
        childnum4: 0,
        childnum5: 0
      }]
      _.each(datasource, item => {
        sumData[0]['ordernum'] += Number(item.ordernum)
        sumData[0]['allmainnum'] += Number(item.allmainnum)
        sumData[0]['mainnum1'] += Number(item.mainnum1)
        sumData[0]['mainnum2'] += Number(item.mainnum2)
        sumData[0]['mainnum3'] += Number(item.mainnum3)
        sumData[0]['mainnum4'] += Number(item.mainnum4)
        sumData[0]['mainnum5'] += Number(item.mainnum5)
        sumData[0]['allchildnum'] += Number(item.allchildnum)
        sumData[0]['childnum1'] += Number(item.childnum1)
        sumData[0]['childnum2'] += Number(item.childnum2)
        sumData[0]['childnum3'] += Number(item.childnum3)
        sumData[0]['childnum4'] += Number(item.childnum4)
        sumData[0]['childnum5'] += Number(item.childnum5)
      })
      datalast = datasource.concat(sumData)
    }
    return (
      <div className="more-notice recharge-apply" style={{ background: '#fff', padding: '10px' }}>
        <h3 className="vheader">外勤情况统计</h3>
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