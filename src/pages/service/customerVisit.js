import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { notification } from 'pilipa'
import { Tabs, Button, Table, Divider } from 'antd'
import styles from '@/stylus/serviceCard'
import Search from '@/containers/Search'
import AreaSelect from '@/containers/searchComponent/AreaSelect'
import CustomerTable from '@/containers/service/CustomerTable'
import ReturnVisitTable from '@/containers/service/ReturnVisitTable'
import { postReturnVisit, putReturnVisit, fetchReturnVisitDetail, exportCustomerVisitList } from '@/utils/api'
import Modal from '@/components/common/Modal'
import ReturnVisitModal from '@/containers/service/ReturnVisitModal'
import ExportXlsUtil from '@/utils/exportXls'
const TabPane = Tabs.TabPane

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      type: '2', // 1直营2渠道
      key: '1', // 1客户2回访
      searchParams1: {},
      searchParams2: {},
      data1: [],
      data2: []
    }
    this.callback = this.callback.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.returnvisitModal = this.returnvisitModal.bind(this)
    this.viewreturnvisitModal = this.viewreturnvisitModal.bind(this)
  }
  componentWillMount () {
    this.onSearch()
  }
  onSearch (refresh, res) {
    console.log(res, 'search')
    res = res || []
    if (this.state.key === '1') {
      let searchParams1 = {
        type: res[0],
        pcode: (res[1] && res[1][0]) || '',
        ccode: (res[1] && res[1][1]) || '',
        name: res[2],
        start: res[3] ? res[3].format('YYYY-MM-DD') : '',
        end: res[4] ? res[4].format('YYYY-MM-DD') : '',
        channelname: res[5]
      }
      console.log(searchParams1, 'searchParams1')
      this.setState({
        type: res[0],
        searchParams1: searchParams1
      })
    } else if (this.state.key === '2') {
      let searchParams2 = {
        name: res[0],
        contacts: res[1],
        mobile: res[2],
        contactdata: res[3] ? res[3].format('YYYY-MM-DD') : '',
        communicationresults: res[4]
      }
      console.log(searchParams2, 'searchParams2')
      this.setState({
        searchParams2: searchParams2
      })
    }
  }
  callback (key) {
    console.log(key)
    this.setState({
      key: key
    })
  }
  export () { // 导出
    console.log('dachu')
    console.log(this.state.searchParams1, 'searchParams1')
    exportCustomerVisitList(this.state.searchParams1).then(res => {
      if (res.status) {
        let data = res.data
        console.log(data, 'resdata')
        let json = [
          { A: '直营/代理商', B: '客户地区', C: '客户名称', D: '联系人', E: '联系电话', F: '服务截止时间' }
        ]
        data.forEach((list) => {
          json.push({
            A: list.channelname ? list.channelname : '',
            B: list.provincename ? list.provincename : '',
            C: list.name,
            D: list.contacts,
            E: list.mobile,
            F: list.serviceend
          })
        })
        ExportXlsUtil.exportByJson(json, '', {
          headerIndex: ['A', 'B', 'C', 'D', 'E', 'F'],
          fileName: '客户统计'
        })
      }
    })
  }
  returnvisitModal (record) {
    console.log(record, 'record')
    const modal = Modal.show({
      content: (
        <ReturnVisitModal wrappedComponentRef={ crmform => { this.crmform = crmform }} data={record}/>
      ),
      title: '回访记录',
      mask: true,
      width: 900,
      okText: '保存',
      onOk: () => {
        this.crmform.props.form.validateFields((err, values) => {
          if (!err) {
            let formValues = values
            formValues.contactdata = formValues.contactdata ? formValues.contactdata.format('YYYY-MM-DD') : null
            formValues.reservedata = formValues.reservedata ? formValues.reservedata.format('YYYY-MM-DD') : null
            formValues = $.extend(true, {}, formValues, record)
            console.log(formValues, 'formValues')
            postReturnVisit(formValues).then(res => {
              if (res.status) {
                notification.success({
                  message: '添加回访记录成功'
                })
                modal.hide()
              }
            })
          }
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  viewreturnvisitModal (record, isReadOnly) {
    fetchReturnVisitDetail(record._id).then(res => {
      if (res.status) {
        let result = res.data
        const modal = Modal.show({
          content: (
            <ReturnVisitModal wrappedComponentRef={ crmform => { this.crmform = crmform }} data={result} readOnly={isReadOnly}/>
          ),
          title: '回访记录',
          mask: true,
          width: 900,
          okText: isReadOnly ? '关闭' : '保存',
          onOk: () => {
            if (isReadOnly) {
              modal.hide()
            } else {
              this.crmform.props.form.validateFields((err, values) => {
                if (!err) {
                  console.log(values, 'values')
                  let formValues = values
                  formValues.contactdata = formValues.contactdata ? formValues.contactdata.format('YYYY-MM-DD') : null
                  formValues.reservedata = formValues.reservedata ? formValues.reservedata.format('YYYY-MM-DD') : null
                  formValues = $.extend(true, {}, record, formValues)
                  console.log(formValues, 'formValues')
                  putReturnVisit(record._id, formValues).then(res => {
                    if (res.status) {
                      notification.success({
                        message: '修改回访记录成功'
                      })
                      this.onSearch()
                      modal.hide()
                    }
                  })
                }
              })
            }
          },
          onCancel: () => {
            modal.hide()
          }
        })
      }
    })
  }
  render () {
    const { key, type } = this.state
    const customerModalcolumns = [{
      title: '直营/代理商',
      dataIndex: 'channelname',
      render: (val, record) => {
        if (record.level === '二级') {
          return (
            <span title={'一级：' + record.channelname1}>{val}{'(' + record.level + ')'}</span>
          )
        } else {
          if (+type === 1 && record.level !== '一级') {
            record.level = '直营'
          }
          return (
            <span>{val}{'(' + record.level + ')'}</span>
          )
        }
      }
    }, {
      title: '客户地区',
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
      title: '客户名称',
      dataIndex: 'name'
    }, {
      title: '联系人',
      dataIndex: 'contacts',
      width: 100
    }, {
      title: '联系电话',
      dataIndex: 'mobile',
      width: 120
    }, {
      title: '服务截止时间',
      dataIndex: 'serviceend',
      width: 130
    }, {
      title: '操作',
      width: 70,
      render: (val, record) => {
        return (
          <span>
            <a onClick={e => { this.returnvisitModal(record, true) }}>回访</a>
          </span>
        )
      }
    }]
    const returnModalcolumns = [{
      title: '客户名称',
      dataIndex: 'name'
    }, {
      title: '联系人',
      dataIndex: 'contacts'
    }, {
      title: '联系电话',
      dataIndex: 'mobile'
    }, {
      title: '联系时间',
      dataIndex: 'contactdata'
    }, {
      title: '沟通结果',
      dataIndex: 'communicationresults',
      render: (val) => {
        if (val === '1') {
          return (
            <span>已接听</span>
          )
        } else if (val === '2') {
          return (
            <span>拒绝</span>
          )
        } else if (val === '3') {
          return (
            <span>无人接听</span>
          )
        } else if (val === '4') {
          return (
            <span>空号</span>
          )
        } else if (val === '5') {
          return (
            <span>非本人</span>
          )
        } else if (val === '6') {
          return (
            <span>停机</span>
          )
        } else if (val === '7') {
          return (
            <span>关机</span>
          )
        } else {
          return (
            <span></span>
          )
        }
      }
    }, {
      title: '操作',
      render: (val, record) => {
        return (
          <span>
            <a onClick={e => { this.viewreturnvisitModal(record, true) }}>查看</a>
            <Divider type="vertical" />
            <a onClick={e => { this.viewreturnvisitModal(record, false) }}>编辑</a>
          </span>
        )
      }
    }]
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="客户" key="1">
          <div className={styles['card-con']}>
            <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
              {
                key === '1' &&
                <Search
                  paramKeys={[7, 9, 1, 8, 10, 6]}
                  onSearch={this.onSearch.bind(this, false)}
                  export={this.export.bind(this)}
                  isExport={true}
                  title='导出'
                  showArea={true}
                  type={type}
                />
              }
            </div>
            <CustomerTable
              type={type}
              params={this.state.searchParams1}
              columns={customerModalcolumns}
            />
          </div>
        </TabPane>
        <TabPane tab="回访" key="2">
          <div className={styles['card-con']}>
            <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
              {
                key === '2' &&
                <Search
                  paramKeys={[1, 3, 2, 5, 4]}
                  onSearch={this.onSearch.bind(this, false)}
                  fetchCommunicationResults={true}
                />
              }
            </div>
            <ReturnVisitTable
              params={this.state.searchParams2}
              columns={returnModalcolumns}
            />
          </div>
        </TabPane>
      </Tabs>
    )
  }
}
