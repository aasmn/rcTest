import React from 'react'
import '@/erp/style/channel.less'
import { Icon } from 'antd'
import $ from 'jquery'
import path from '@/erp/config.json'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      path: '',
      qdpath: path
    }
  }
  componentWillMount () {
    const params = this.props.params
    let objParams = null
    if (params.start) {
      objParams = {
        startdate: params.start,
        enddate: params.end,
        channelid: params.id
      }
    } else {
      objParams = {
        year: params.year,
        months: params.months,
        channelid: params.id
      }
    }
    var query = $.param(objParams)
    query = '?' + query
    let url
    if (params.name === '预提单明细表') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exportbeforehandlist' + query
    } else if (params.name === '转正式订单明细表') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exporttoformallist' + query
    } else if (params.name === '零申报明细表') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exportzerolist' + query
    } else if (params.name === '零申报转小规模明细表') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exporttolittlelist' + query
    } else if (params.name === '零申报转一般纳税人明细表') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exportzerotoformallist' + query
    } else if (params.name === '小规模明细表') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exportlittlelist' + query
    } else if (params.name === '小规模转一般纳税人明细表') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/dataanalysis/exportlittletoformallist' + query
    } else if (params.name === '到期客户明细') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/download/getexpireorderdetails' + query
    } else if (params.name === '未续费客户明细') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/download/getnoreorderdetails' + query
    } else if (params.name === '续费客户明细') {
      url = this.state.qdpath.CHANNEL_SERVER_URL + '/api/download/getreorderdetails' + query
    } 
    this.setState({
      path: url
    })
  }
  render () {
    const params = this.props.params
    return (
      <div className="statis-header">
        <h3 className="vheader">{params.name}</h3>
        <div className="header-right">
          <div className="header-refresh" onClick={this.props.refresh}>
            <Icon type="retweet" />
            <span className="font-style">刷新</span>
          </div>
          <div className="header-download">
            <Icon type="arrow-down" />
            <a className="font-style" href={this.state.path}>下载</a>
          </div>
          <div className="header-download" onClick={this.props.back}>
            <Icon type="double-left" />
            <span className="font-style">返回</span>
          </div>
        </div>
      </div>
    )
  }
}