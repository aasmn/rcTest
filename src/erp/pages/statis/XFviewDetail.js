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
    console.log(this.state.params, 'this.state.params')
    const params = this.state.params
    let objParams = {
      year: params.year,
      months: params.months,
      channelid: params.id
    }
    if (params.name === '到期客户明细') {
      getListData('dataanalysis/getexpireorderdetails', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    } else if (params.name === '未续费客户明细') {
      getListData('dataanalysis/getnoreorderdetails', objParams).then(res => {
        if (res.status) {
          this.setState({
            data: res.data
          })
        }
      })
    } else if (params.name === '续费客户明细') {
      getListData('dataanalysis/getreorderdetails', objParams).then(res => {
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
      title: '联系人',
      dataIndex: 'Contacts'
    }, {
      title: '联系人电话',
      dataIndex: 'Mobile'
    }, {
      title: '销售',
      dataIndex: 'UserName'
    }, {
      title: '开始账期',
      dataIndex: 'ServiceStart'
    }, {
      title: '结束账期',
      dataIndex: 'ServiceEnd'
    }]
    if (params.name === '续费客户明细') {
      columns.push({
        title: '续费时间',
        dataIndex: 'CreateDate'
      })
    } else if (params.name === '到期客户明细') {
      columns.push({
        title: '是否续费',
        dataIndex: 'IsReOrderText'
      }, {
        title: '续费时间',
        dataIndex: 'ReOrderData'
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