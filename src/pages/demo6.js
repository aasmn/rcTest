import React from 'react'
import { Card, Row, Col, Form, Input, Button, Table, Divider } from 'antd'
import { connect } from 'react-redux'
import styles from '@/stylus/tableContent'
import Modal from '@/components/common/Modal'
import Search from '@/containers/Search'
import { fetchListAction } from '@/actions/usersAccount'
const FormItem = Form.Item
class CustomerService extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 15,
        showSizeChanger: true,
        showQuickJumper: true
      }
    }
    this.detail = this.detail.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
    console.log(this.props, 'props')
    // this.props.dispatch(fetchListAction())
  }
  handleTableChange (pagination) {
    this.setState({
      pagination: pagination
    })
  }
  onSearch (res) {
    console.log(res)
  }
  detail (record) {
    const detailData = []
    const modal = Modal.show({
      content: (
        <div>aaaa</div>
      ),
      title: '客户详情',
      mask: true,
      onOk: () => {
        console.log('关闭弹框')
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  render () {
    const dataSource = [{
      Id: 1,
      CompanyName: '北京爱康鼎科技有限公司',
      CityName: '北京市',
      Belong: '直营',
      Contactor: '噼里啪',
      Phone: '13521677472',
      Orders: '5'
    }, {
      Id: 2,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 3,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 4,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 5,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 6,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 7,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 8,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 9,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 10,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 11,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 12,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 13,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 14,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }, {
      Id: 15,
      CompanyName: '南京全时科技有限公司',
      CityName: '南京市',
      Belong: '渠道',
      Contactor: '全时',
      Phone: '13521677472',
      Orders: '3'
    }]
    const columns = [{
      title: '公司名称',
      dataIndex: 'CompanyName'
    }, {
      title: '所属城市',
      dataIndex: 'CityName'
    }, {
      title: '直营/渠道',
      dataIndex: 'Belong'
    }, {
      title: '联系人',
      dataIndex: 'Contactor'
    }, {
      title: '联系方式',
      dataIndex: 'Phone'
    }, {
      title: '订单数量',
      dataIndex: 'Orders'
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => { this.detail(record) }}>详情</a>
          </span>
        )
      }
    }]
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Search
              paramKeys={[1, 2, 3]}
              onSearch={this.onSearch.bind(this)}
              isAddUser={false}
            />
          </div>
          <div style={{ minHeight: '500px' }}>
            <Table
              rowKey={record => (record.Id)}
              dataSource={dataSource}
              columns={columns}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
              bordered={true}
            />
          </div>
        </div>
      </Card>
    )
  }
}
export default connect()(CustomerService)
// export default UsersAccount
