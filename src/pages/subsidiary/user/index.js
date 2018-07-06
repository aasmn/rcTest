/**
 * Created by oyhanyu on 2018/6/27.
 */
import React from 'react'
import { Form, Input, Button, Table, Divider, message } from 'antd'
import Modal from '@/components/common/Modal'
import { subsidiaryApi } from '@/utils/api'
import UserForm from '@/containers/users/subsidiaryUserForm'

const FormItem = Form.Item

class UserList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      searchParams: {}
    }
  }
  handleSubmit () {
    this.props.form.validateFields((errors, vals) => {
      this.handleSubmit(vals)
    })
  }
  handleSearch (params) {
    // fetch data
    if (!params) {
      params = this.state.searchParams
    } else {
      this.setState({ searchParams: params })
    }
    subsidiaryApi.user.get(params).then(res => {
      console.log(res)
      if (res.status) {
        this.setState({
          data: res.data.list
        })
      }
    })
    // test
  }

  handleRemove (record) {
    console.log('remove')
    const modal = Modal.show({
      content: (
        <div>确定要删除员工吗？</div>
      ),
      title: '',
      mask: true,
      onOk: () => {
        subsidiaryApi.user.delete(record.mobile).then(res => {
          if (res.status) {
            message.info('操作成功！')
            this.handleSearch()
          }
        })
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }

  handleEdit (userInfo) {
    console.log('edit')
    let formFields = {}
    let method = 'post'
    let title = '新建用户'
    if (userInfo) {
      // edit
      formFields = {...userInfo}
      method = 'put'
      title = '编辑用户'
      formFields.roles = formFields.roles.map(r => r.id)
      formFields.node = formFields.organization.id
      console.log(formFields)
    }
    const modal = Modal.show({
      content: (
        <UserForm
          ref={userform => { this.userform = userform }}
          user={formFields}
          isNew={true}
        />
      ),
      title,
      mask: true,
      onOk: () => {
        // ref 就能获取组件的信息了
        console.log(this.userform, '确定')
        this.userform.validateFields((err, values) => {
          if (!err) {
            subsidiaryApi.user[method](values).then(res => {
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

  componentDidMount () {
    this.handleSearch()
  }
  render () {
    const getFieldDecorator = this.props.form.getFieldDecorator
    const columns = [{
      title: '姓名',
      dataIndex: 'name'
    }, {
      title: '用户名',
      dataIndex: 'nickname'
    }, {
      title: '手机',
      dataIndex: 'mobile'
    }, {
      title: '邮箱',
      dataIndex: 'email'
    }, {
      title: '角色',
      dataIndex: 'roles',
      render: (val) => {
        return val.map(v => v.name).join(',')
      }
    }, {
      title: '部门',
      dataIndex: 'organization.name'
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:;" onClick={this.handleEdit.bind(this, record) }>修改</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={this.handleRemove.bind(this, record) }>删除</a>
          </span>
        )
      }
    }]
    return (
      <div className="contentBody">
        <div className="searchPanel">
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
            <Button type="primary" onClick={this.handleEdit.bind(this)} className="login-form-button" style={{ float: 'right' }}> 新增</Button>
          </Form>
        </div>
        <div style={{ background: '#fff' }}>
          <Table
            rowKey={record => (record.id)}
            dataSource={this.state.data}
            columns={columns}
            pagination={false}
          />
          <div style={{ margin: '12px 0', textAlign: 'right' }}>共{this.state.data.length}条记录</div>
        </div>
      </div>
    )
  }
}

export default Form.create()(UserList)
