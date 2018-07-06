import React from 'react'
import { Button, Table, Divider } from 'antd'
import { notification } from 'pilipa'
import Search from '@/containers/Search'
import styles from '@/stylus/serviceCard'
import Modal from '@/components/common/Modal'
import ChannelModal from '@/containers/organization/ChannelModal'
// import ChannelPassModal from '@/containers/organization/ChannelPassModal'
// import RejectModal from '@/components/common/RejectModal'
import { agentApi } from '@/utils/api'
export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['15', '30', '50', '80', '100', '200'],
        showTotal (total) {
          return `共计 ${total} 条`
        }
      },
      searchParams: {}
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }
  componentWillMount () {
    this.onSearch()
  }
  onSearch (refresh, res) {
    res = res || []
    let searchParams = {
      time: res[0] ? res[0].format('YYYY-MM-DD') : '',
      channelname: res[1],
      provcode: (res[2] && res[2][0]) || '',
      citycode: (res[2] && res[2][1]) || ''
    }
    console.log(searchParams, 'searchParams')
    var vals = searchParams || {}
    const pagination = this.state.pagination
    vals.limit = pagination.pageSize
    vals.offset = (pagination.current - 1) * pagination.pageSize
    agentApi.get(vals).then(res => {
      if (res.status) {
        const pagination = { ...this.state.pagination }
        pagination.total = res.data.count
        this.setState({
          dataSource: res.data.list,
          pagination
        })
      }
    })
  }
  handleTableChange (pagination) {
    this.setState({ pagination: pagination }, () => {
      this.onSearch()
    })
  }
  view (record) {
    let data = record || {}
    const modal = Modal.show({
      content: (
        <ChannelModal data={data} readOnly={true}/>
      ),
      title: '渠道信息',
      mask: true,
      width: 900,
      footer: null,
      onOk: () => {
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  pass (record) {
    const modal = Modal.show({
      content: (
        // <ChannelPassModal wrappedComponentRef={ crmform => { this.crmform = crmform }}/>
        <div>您确定要审核通过？</div>
      ),
      title: '代理商审核',
      mask: true,
      width: 400,
      okText: '确定',
      onOk: () => {
        // this.crmform.props.form.validateFields((err, values) => {
        //   if (!err) {
        //     console.log(values, 'values')
        //     modal.hide()
        //   }
        // })
        const status = 2
        agentApi.changestatus(record.id, status).then(res => {
          if (res.status) {
            notification.success({
              message: '操作成功'
            })
            modal.hide()
            this.onSearch()
          }
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  reject (record) {
    // const label = '原因'
    const modal = Modal.show({
      content: (
        // <RejectModal label={label}/>
        <div>您确定要驳回？</div>
      ),
      title: '驳回',
      mask: true,
      width: 400,
      okText: '保存',
      onOk: () => {
        const status = 3
        agentApi.changestatus(record.id, status).then(res => {
          if (res.status) {
            notification.success({
              message: '操作成功'
            })
            modal.hide()
            this.onSearch()
          }
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  render () {
    const columns = [{
      title: '机构ID',
      dataIndex: 'id'
    }, {
      title: '区域',
      dataIndex: 'provincename',
      render: (val, record) => {
        if (val && record.cityname) {
          return (
            <span>{val + '-' + record.cityname}</span>
          )
        } else if (val && !record.cityname) {
          return (
            <span>{val}</span>
          )
        } else if (!val && record.cityname) {
          return (
            <span>{record.cityname}</span>
          )
        } else if (!val && !record.cityname) {
          return (
            <span>-</span>
          )
        }
      }
    }, {
      title: '代理商',
      dataIndex: 'ChannelName'
    }, {
      title: '地址',
      dataIndex: 'address'
    }, {
      title: '创建时间',
      dataIndex: 'createtime'
    }, {
      title: '创建人',
      dataIndex: 'person'
    }, {
      title: '操作',
      render: (val, record) => {
        if (record.status === 1) {
          return (
            <span>
              <a onClick={e => { this.view(record, true) }}>查看</a>
              <Divider type="vertical" />
              <a onClick={e => { this.pass(record) }}>通过</a>
              <Divider type="vertical" />
              <a onClick={e => { this.reject(record) }}>驳回</a>
            </span>
          )
        } else {
          return (
            <a onClick={e => { this.view(record, true) }}>查看</a>
          )
        }
      }
    }]
    return (
      <div className={styles['card-con']}>
        <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
          <Search
            paramKeys={[16, 12, 13]}
            onSearch={this.onSearch.bind(this, false)}
            showArea={true}
          />
        </div>
        <div style={{ background: '#fff' }}>
          <Table
            rowKey={record => (record.id)}
            dataSource={this.state.dataSource}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    )
  }
}
