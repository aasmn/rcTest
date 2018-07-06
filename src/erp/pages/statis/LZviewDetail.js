import React from 'react'
import { Table } from 'antd'
import { getListData } from '@/erp/api'
import '@/erp/style/main.less'
import '@/erp/style/channel.less'
import StatisDetailHeader from '@/erp/container/channel/Statis_Detail_Header'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      params: {},
      data: []
    }
  }
  componentWillMount () {
    console.log(this.props, 'props')
    this.setState({
      params: this.props.match.params
    }, () => {
      this.refresh()
    })
  }
  refresh () {
    return false
    console.log(this.state.params, 'this.state.params')
    const params = this.state.params
    let objParams = {
      startdate: params.start,
      enddate: params.end,
      channelid: params.id
    }
    if (params.name === '预提单明细表') {
      getListData('dataanalysis/getbeforehandlist', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    } else if (params.name === '转正式订单明细表') {
      getListData('dataanalysis/gettoformallist', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    } else if (params.name === '零申报明细表') {
      getListData('dataanalysis/getzerolist', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    } else if (params.name === '零申报转小规模明细表') {
      getListData('dataanalysis/gettolittlelist', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    } else if (params.name === '零申报转一般纳税人明细表') {
      getListData('dataanalysis/zerotoformallist', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    } else if (params.name === '小规模明细表') {
      getListData('dataanalysis/getlittlelist', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    } else if (params.name === '小规模转一般纳税人明细表') {
      getListData('dataanalysis/getlittletoformallist', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    }
  }
  back () {
    this.props.history.goBack()
  }
  render () {
    const { params, data } = this.state
    let columns = [{
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
      title: '公司名称',
      dataIndex: 'cname'
    }, {
      title: '纳税人类别',
      dataIndex: 'ctype'
    }, {
      title: '法人',
      dataIndex: 'lperson'
    }, {
      title: '提单时间',
      dataIndex: 'CreateDate'
    }, {
      title: '转化时间',
      dataIndex: 'ChangeDate'
    }, {
      itle: '转化周期（天）',
      dataIndex: 'cdays'
    }]
    if (params.name === '转正式订单明细表') {
      columns.splice(7, 0 , {
        title: '是否转为正式订单',
        dataIndex: 'ischange'
      })
    } else if (params.name === '零申报明细表') {
      columns.splice(7, 0 , {
        title: '是否转为小规模',
        dataIndex: 'little'
      }, {
        title: '是否转为一般纳税人',
        dataIndex: 'formal'
      })
    } else if (params.name === '小规模明细表') {
      columns.splice(7, 0 , {
        title: '是否转为正式订单',
        dataIndex: 'ischange'
      })
    }
    console.log(columns, 'columns')
    return (
      <div>
        <div className="more-notice recharge-apply" style={{ background: '#fff', padding: '10px' }}>
          <StatisDetailHeader params={params} refresh={this.refresh.bind(this)} back={this.back.bind(this)}/>
          <Table columns={columns}
            rowKey={record => record.ChannelId}
            dataSource={data}
            pagination={false}
            size="middle"
            bordered={true}
          />
        </div>
      </div>
    )
  }
}