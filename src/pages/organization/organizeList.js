import React from 'react'
import { Tabs, Button, Table, Divider } from 'antd'
import { notification } from 'pilipa'
import Search from '@/containers/Search'
import styles from '@/stylus/serviceCard'
import ErpList from '@/containers/organization/ErpList'
import allArea from 'chinese-region-util'
import ChannelList from '@/containers/organization/ChannelList'
import AccountingCenterList from '@/containers/organization/AccountingCenterList'
import Modal from '@/components/common/Modal'
import SubsidiaryModal from '@/containers/organization/SubsidiaryModal'
import ChannelModal from '@/containers/organization/ChannelModal'
import AccountingCenterModal from '@/containers/organization/AccountingCenterModal'
import { accountingCenterApi, directApi, agentApi } from '@/utils/api'
import { fStatusChannel } from '@/utils/filters'
const TabPane = Tabs.TabPane
export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      key: '1', // 1直营2代理商3核算中心
      searchParams1: {},
      searchParams2: {},
      searchParams3: {}
    }
    this.callback = this.callback.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.subsidiaryModal = this.subsidiaryModal.bind(this)
    this.viewSubsidiaryModal = this.viewSubsidiaryModal.bind(this)
    this.deleteSubsidiary = this.deleteSubsidiary.bind(this)
    this.readyDelete = this.readyDelete.bind(this)
    this.deleteChannel = this.deleteChannel.bind(this)
  }
  componentWillMount () {
    this.onSearch()
  }
  onSearch (refresh, res) {
    console.log(res, 'search')
    res = res || []
    if (this.state.key === '1') {
      let searchParams1 = {
        cname: res[0],
        pcode: (res[1] && res[1][0]) || '',
        ccode: (res[1] && res[1][1]) || ''
      }
      console.log(searchParams1, 'searchParams1')
      this.setState({
        searchParams1: searchParams1
      })
    } else if (this.state.key === '2') {
      let searchParams2 = {
        channelname: res[0],
        provcode: (res[1] && res[1][0]) || '',
        citycode: (res[1] && res[1][1]) || '',
        status: res[2]
      }
      console.log(searchParams2, 'searchParams2')
      this.setState({
        searchParams2: searchParams2
      })
    } else if (this.state.key === '3') {
      let searchParams3 = {
        name: res[0]
      }
      console.log(searchParams3, 'searchParams3')
      this.setState({
        searchParams3: searchParams3
      })
    }
  }
  callback (key) {
    console.log(key)
    this.setState({
      key: key
    })
  }
  subsidiaryModal (record) {
    console.log(record.ext, 'record.ext')
    let data = record ? record.ext : {}
    if (!data) {
      notification.error({
        message: '后端返回数据错误！'
      })
    }
    const modal = Modal.show({
      content: (
        <SubsidiaryModal wrappedComponentRef={ crmform => { this.crmform = crmform }} data={data} id={record.id}/>
      ),
      title: '直营信息',
      mask: true,
      width: 900,
      okText: '保存',
      onOk: () => {
        this.crmform.handleSubmit(null, () => {
          modal.hide()
          this.onSearch()
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  viewSubsidiaryModal (record, isReadOnly) {
    let data = record ? record.ext : {}
    const modal = Modal.show({
      content: (
        <SubsidiaryModal data={data} readOnly={isReadOnly}/>
      ),
      title: '直营信息',
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
  deleteSubsidiary (record) {
    const modal = Modal.show({
      content: (
        <div>确认要删除直营？</div>
      ),
      title: '删除',
      mask: true,
      width: 400,
      okText: '确定',
      onOk: () => {
        // 删除接口
        directApi.delete(record.id).then(res => {
          if (res.status) {
            notification.success({
              message: '操作成功'
            })
          }
        })
        modal.hide()
        this.onSearch()
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  channelModal (record) {
    let data = record || {}
    const modal = Modal.show({
      content: (
        <ChannelModal wrappedComponentRef={ crmform => { this.crmform = crmform }} data={data}/>
      ),
      title: '代理商信息',
      mask: true,
      width: 900,
      okText: '保存',
      onOk: () => {
        this.crmform.handleSubmit(null, () => {
          modal.hide()
          this.onSearch()
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  viewChannelModal (record, isReadOnly) {
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
  readyDelete (record) {
    const modal = Modal.show({
      content: (
        <div>您确定要操作代理商准备解约吗?</div>
      ),
      title: '准备删除',
      mask: true,
      width: 400,
      okText: '确定',
      onOk: () => {
        // 删除接口
        const status = 5
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
  deleteChannel (record) {
    const modal = Modal.show({
      content: (
        <div>您确定删除代理商吗?</div>
      ),
      title: '删除',
      mask: true,
      width: 400,
      okText: '确定',
      onOk: () => {
        const status = 0
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
  accountingCenterModal (record) {
    console.log(record, 'record')
    let data = record || {}
    const modal = Modal.show({
      content: (
        <AccountingCenterModal wrappedComponentRef={ crmform => { this.crmform = crmform }} data={data}/>
      ),
      title: '核算中心信息',
      mask: true,
      width: 900,
      okText: '保存',
      onOk: () => {
        this.crmform.handleSubmit(null, () => {
          modal.hide()
          this.onSearch()
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  accountingCenterdelete (record) {
    const modal = Modal.show({
      content: (
        <div>删除后该核算中心下所有的账号关系同时也会被删除（账号不会被删除），是否确认删除？?</div>
      ),
      title: '删除',
      mask: true,
      width: 500,
      okText: '确定',
      onOk: () => {
        // 删除接口
        accountingCenterApi.delete(record.id).then(res => {
          if (res.status) {
            notification.success({
              message: '操作成功'
            })
            this.onSearch()
          }
        })
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  render () {
    const { key } = this.state
    const columns1 = [{
      title: '机构ID',
      dataIndex: 'id'
    }, {
      title: '直营',
      dataIndex: 'name'
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
      title: '创建时间',
      dataIndex: 'createtime'
    }, {
      title: '操作',
      render: (val, record) => {
        return (
          <span>
            <a onClick={e => { this.viewSubsidiaryModal(record, true) }}>查看</a>
            <Divider type="vertical" />
            <a onClick={e => { this.subsidiaryModal(record) }}>修改</a>
            <Divider type="vertical" />
            <a onClick={e => { this.deleteSubsidiary(record) }}>删除</a>
          </span>
        )
      }
    }]
    const columns2 = [{
      title: '机构ID',
      dataIndex: 'id'
    }, {
      title: '代理商',
      dataIndex: 'ChannelName'
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
      title: '下级机构',
      dataIndex: 'name2'
    }, {
      title: '创建时间',
      dataIndex: 'createtime'
    }, {
      title: '状态',
      dataIndex: 'status',
      render: val => fStatusChannel(val)
    }, {
      title: '操作',
      render: (val, record) => {
        return (
          <span>
            <a onClick={e => { this.viewChannelModal(record, true) }}>查看</a>
            <Divider type="vertical" />
            <a onClick={e => { this.channelModal(record) }}>修改</a>
            <Divider type="vertical" />
            {
              record.status !== 5 &&
              <a onClick={e => { this.readyDelete(record) }}>准备删除</a>
            }
            {
              record.status === 5 &&
              <a onClick={e => { this.deleteChannel(record) }}>删除</a>
            }
          </span>
        )
      }
    }]
    const columns3 = [{
      title: '机构编号',
      dataIndex: 'id'
    }, {
      title: '机构名称',
      dataIndex: 'name'
    }, {
      title: '核算地区范围',
      dataIndex: 'range',
      render: (val, record) => {
        var rangeName = ''
        if (val && val.length > 0) {
          for (var i in val) {
            rangeName = rangeName + val[i].name + ','
          }
          return <span>{rangeName}</span>
        } else {
          return <span></span>
        }
      }
    }, {
      title: '操作',
      render: (val, record) => {
        return (
          <span>
            <a onClick={e => { this.accountingCenterModal(record, true) }}>修改</a>
            {
              record.status === 1 &&
              <span>
                <Divider type="vertical" />
                <a onClick={e => { this.accountingCenterdelete(record) }}>删除</a>
              </span>
            }
          </span>
        )
      }
    }]
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="直营" key="1">
          <div className={styles['card-con']}>
            <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
              {
                key === '1' &&
                <Search
                  paramKeys={[11, 13]}
                  onSearch={this.onSearch.bind(this, false)}
                  showArea={true}
                  isAddUser={true}
                  addNew={this.subsidiaryModal.bind(this)}
                  title='新增'
                />
              }
            </div>
            <ErpList
              params={this.state.searchParams1}
              columns={columns1}
            />
          </div>
        </TabPane>
        <TabPane tab="代理商" key="2">
          <div className={styles['card-con']}>
            <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
              {
                key === '2' &&
                <Search
                  paramKeys={[12, 13, 14]}
                  onSearch={this.onSearch.bind(this, false)}
                  showArea={true}
                  isAddUser={true}
                  addNew={this.channelModal.bind(this)}
                  title='新增'
                />
              }
            </div>
            <ChannelList
              params={this.state.searchParams2}
              columns={columns2}
            />
          </div>
        </TabPane>
        <TabPane tab="核算中心" key="3">
          <div className={styles['card-con']}>
            <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
              {
                key === '3' &&
                <Search
                  paramKeys={[15]}
                  onSearch={this.onSearch.bind(this, false)}
                  isAddUser={true}
                  addNew={this.accountingCenterModal.bind(this)}
                  title='新增'
                />
              }
            </div>
            <AccountingCenterList
              params={this.state.searchParams3}
              columns={columns3}
            />
          </div>
        </TabPane>
      </Tabs>
    )
  }
}
