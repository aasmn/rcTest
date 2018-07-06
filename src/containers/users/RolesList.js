import React from 'react'
import { Card, Row, Col, Form, Input, Button, Table, Divider, message } from 'antd'
import { connect } from 'react-redux'
import styles from '@/stylus/tableContent'
import Modal from '@/components/common/Modal'
import UserInfo from '@/containers/users/userInfo'
import Search from '@/containers/Search'
import { fetchListAction } from '@/actions/usersAccount'
import { userRolesApi } from '@/utils/api'
import PowerSet from '@/containers/users/powerSet'
import RoleInfo from '@/containers/users/roleInfo'
import _ from 'lodash'

const FormItem = Form.Item
class UsersRoles extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      searchParams: {},
      pagination: {
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['15', '30', '50', '80', '100', '200'],
        showTotal (total) {
          return `共计 ${total} 条`
        }
      }
    }
    this.deleteUser = this.deleteUser.bind(this)
    this.accreditUser = this.accreditUser.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
  }
  componentWillMount () {
    this.onSearch()
  }
  onSearch (refresh, res) {
    res = res || []
    let searchParams = {
      name: res[0]
    }
    console.log(searchParams, 'searchParams')
    var vals = searchParams || {}
    const pagination = this.state.pagination
    vals.limit = pagination.pageSize
    vals.offset = (pagination.current - 1) * pagination.pageSize
    userRolesApi.get(vals).then(res => {
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
  editUser (record) {
    console.log(record, 'record')
  }
  deleteUser (record) {
    const modal = Modal.show({
      content: (
        <div>您确认要删除该角色吗？</div>
      ),
      title: '删除角色',
      mask: true,
      onOk: () => {
        console.log(record, '确定')
        userRolesApi.delete(record.id).then(res => {
          if (res.status) {
            this.onSearch()
            message.info('操作成功！')
            modal.hide()
          }
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  accreditUser (record) {
    let powers = []
    const modal = Modal.show({
      content: <PowerSet value={record.policies} onChange={v => { powers = v }} />,
      title: '角色授权',
      mask: true,
      onOk: () => {
        const data = _.extend({}, record, { policies: powers })
        userRolesApi.put(data).then(res => {
          if (res.status) {
            this.onSearch()
            message.info('操作成功！')
            modal.hide()
          }
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  addNew () {
    let roleFrom
    const modal = Modal.show({
      content: <RoleInfo ref={e => { roleFrom = e }} />,
      title: '新增角色',
      width: 800,
      mask: true,
      onOk: () => {
        roleFrom.validateFields((err, values) => {
          if (!err) {
            userRolesApi.post(values)
            this.onSearch()
            message.info('操作成功！')
            modal.hide()
          }
        })
        return true
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  render () {
    const dataSource = this.state.dataSource

    const columns = [{
      title: '角色名称',
      dataIndex: 'name'
    }, {
      title: '描述',
      dataIndex: 'desc'
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            {/* <a onClick={e => { this.editUser(record) }}>禁用</a> <Divider type="vertical" /> */}
            <a onClick={e => { this.accreditUser(record) }}>授权</a>
            {
              this.props.readonly &&
              <span></span>
            }
            {
              !this.props.readonly &&
              <span>
                <Divider type="vertical" />
                <a onClick={e => { this.deleteUser(record) }}>删除</a>
              </span>
            }
          </span>
        )
      }
    }]
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className="contentBody">
        <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
          {
            this.props.readonly &&
            <Search
              paramKeys={[1]}
              onSearch={this.onSearch.bind(this, false)}
            />
          }
          {
            !this.props.readonly &&
            <Search
              paramKeys={[1]}
              onSearch={this.onSearch.bind(this, false)}
              isAddUser={true}
              addNew={this.addNew.bind(this)}
              title='新增'
            />
          }
        </div>
        {/* <div className="searchPanel">
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('name')(
                <Input style={{ width: 200 }} placeholder="搜索角色名" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="button" onClick={this.handleSubmit} className="login-form-button"> 查询</Button>
            </FormItem>
            <Button type="primary" onClick={this.addNew} className="login-form-button" style={{ float: 'right' }}> 新增</Button>
          </Form>
        </div> */}
        <div style={{ background: '#fff' }}>
          <Table
            rowKey={record => (record.id)}
            childrenColumnName="nochildren"
            dataSource={dataSource}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
          <div style={{ margin: '12px 0', textAlign: 'right', background: '#fff' }}>共{dataSource.length}条记录</div>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(UsersRoles))
// export default UsersAccount
