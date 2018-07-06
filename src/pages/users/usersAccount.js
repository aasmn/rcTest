import React from 'react'
import { Card, Row, Col, Form, Input, Button, Table, Divider, message } from 'antd'
import { connect } from 'react-redux'
import Modal from '@/components/common/Modal'
import UserInfo from '@/containers/users/userInfo'
import Search from '@/containers/Search'
import { userApi } from '@/utils/api'
import PowerSet from '@/containers/users/powerSet'
import _ from 'lodash'

const FormItem = Form.Item
class UsersAccount extends React.Component {
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
    this.addNew = this.addNew.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
  }
  componentWillMount () {
    this.onSearch()
  }
  onSearch (refresh, res) {
    res = res || []
    let searchParams = {
      name: res[0],
      desc: res[1]
    }
    console.log(searchParams, 'searchParams')
    var vals = searchParams || {}
    const pagination = this.state.pagination
    vals.limit = pagination.pageSize
    vals.offset = (pagination.current - 1) * pagination.pageSize
    userApi.get(vals).then(res => {
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
    let user = { ...record }
    user.roles = user.roles
    console.log(user.roles, 'user.roles')
    user.node = record.depname.id
    const modal = Modal.show({
      content: (
        <UserInfo
          ref={userform => { this.userform = userform }}
          user={user}
          isNew={true}
        />
      ),
      title: '编辑用户',
      mask: true,
      onOk: () => {
        // ref 就能获取组件的信息了
        console.log(this.userform, '确定')
        this.userform.validateFields((err, values) => {
          if (!err) {
            userApi.put(values).then(res => {
              if (res.status) {
                this.onSearch()
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
  deleteUser (record) {
    const modal = Modal.show({
      content: (
        <div>确定要删除员工吗？</div>
      ),
      title: '',
      mask: true,
      onOk: () => {
        userApi.delete(record.mobile).then(res => {
          if (res.status) {
            message.info('操作成功！')
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
  accreditUser (record) {
    let powers = []
    const modal = Modal.show({
      content: <PowerSet value={(record.policies || []).map(t => t.id)} onChange={v => { powers = v }} />,
      title: '用户授权',
      mask: true,
      onOk: () => {
        const data = { policies: powers }
        console.log(data, 'data')
        userApi.setpower(record.mobile, data).then(res => {
          if (res.status) {
            this.onSearch()
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
    const modal = Modal.show({
      content: (
        <UserInfo
          ref={userform => { this.userform = userform }}
          user={{}}
          isNew={true}
        />
      ),
      title: '新建用户',
      mask: true,
      onOk: () => {
        // ref 就能获取组件的信息了
        console.log(this.userform, '确定')
        this.userform.validateFields((err, values) => {
          if (!err) {
            userApi.post(values).then(res => {
              if (res.status) {
                this.onSearch()
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
  render () {
    console.log(this.state.dataSource, 'sourcedata')
    const columns = [{
      title: '姓名',
      dataIndex: 'name'
    }, {
      title: '昵称',
      dataIndex: 'nickname'
    }, {
      title: '手机',
      dataIndex: 'mobile'
    }, {
      title: '邮箱',
      dataIndex: 'email'
    }, {
      title: '角色',
      dataIndex: 'rolesname',
      render: (val) => {
        // console.log(val, 'val')
        return (val && val[0] !== null) && val.map(v => v.name).join(',')
      }
    }, {
      title: '部门',
      dataIndex: 'depname.name'
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => { this.editUser(record) }}>修改</a>
            <Divider type="vertical" />
            {/* <a onClick={e => { this.deleteUser(record) }}>删除</a>
            <Divider type="vertical" /> */}
            <a onClick={e => { this.accreditUser(record) }}>授权</a>
          </span>
        )
      }
    }]
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className="contentBody">
        {/* <div className="searchPanel">
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('name')(
                <Input style={{ width: 200 }} placeholder="搜索姓名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('mobile')(
                <Input style={{ width: 200 }} placeholder="搜索手机号" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="button" onClick={this.handleSubmit} className="login-form-button"> 查询</Button>
            </FormItem>
            <Button type="primary" onClick={this.addNew} className="login-form-button" style={{ float: 'right' }}> 新增</Button>
          </Form>
        </div> */}
        <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
          <Search
            paramKeys={[19, 20]}
            onSearch={this.onSearch.bind(this, false)}
            isAddUser={true}
            addNew={this.addNew.bind(this)}
            title='新增'
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
// export default connect()(UsersAccount)
export default Form.create()(UsersAccount)
