import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Table, Button, message } from 'antd'
import styles from '@/stylus/strategy'
import { withRouter } from 'react-router'
import { strageApi } from '@/utils/api'
import ViewStrategy from '@/containers/users/viewStrategy'
import Modal from '@/components/common/Modal'
import Search from '@/containers/Search'

const FormItem = Form.Item
class StrageyList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
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
    // this.handleSubmit = this.handleSubmit.bind(this)
    this.addNew = this.addNew.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.showDetail = this.showDetail.bind(this)
    this.disableStrategy = this.disableStrategy.bind(this)
    this.enableStrategy = this.enableStrategy.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
  }
  static get propTypes () {
    return {
      readonly: PropTypes.bool
    }
  }
  // handleSubmit (e) {
  //   e.preventDefault()
  //   this.props.form.validateFields((errors, vals) => {
  //     Object.assign(vals, {
  //       readonly: this.props.readonly
  //     })
  //     this.onSearch(vals)
  //   })
  // }
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
    strageApi.get(vals).then(res => {
      if (res.status) {
        const pagination = { ...this.state.pagination }
        pagination.total = res.count
        this.setState({
          data: res.data,
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
  // onSearch (query = {}) {
  //   strageApi.get(query).then(res => {
  //     this.setState({ data: res.data })
  //   })
  // }
  addNew () {
    this.props.history.push('/usersAddStrategy?readonly=' + this.props.readonly)
  }
  // 查看策略
  showDetail (row) {
    this.props.history.push(`/usersAddStrategy?readonly=true&strategyId=${row.id}`)
  }
  // showDetail (row) {
  //   const modal = Modal.show({
  //     content: (
  //       <ViewStrategy
  //         strategyId={row.id}
  //       />
  //     ),
  //     title: '查看策略',
  //     footer: null,
  //     mask: true,
  //     onCancel: () => {
  //       modal.hide()
  //     }
  //   })
  // }
  // 禁用策略
  disableStrategy (row) {
    const _this = this
    const modal = Modal.show({
      content: (
        <p>确认禁用该策略吗?</p>
      ),
      title: '禁用策略',
      mask: true,
      onCancel () {
        modal.hide()
      },
      onOk () {
        const { id } = row
        strageApi.update(id, 2).then(res => {
          const { status } = res
          if (status) {
            _this.props.form.validateFields((errors, vals) => {
              Object.assign(vals, {
                readonly: _this.props.readonly
              })
              _this.onSearch(vals)
            })
          } else {
            message.error('禁用策略失败')
          }
          // 隐藏modal
          modal.hide()
        })
      }
    })
  }
  // 启用策略
  enableStrategy (row) {
    const _this = this
    const modal = Modal.show({
      content: (
        <p>确认启用该策略吗?</p>
      ),
      title: '禁用策略',
      mask: true,
      onCancel () {
        modal.hide()
      },
      onOk () {
        const { id } = row
        strageApi.update(id, 1).then(res => {
          const { status } = res
          if (status) {
            _this.props.form.validateFields((errors, vals) => {
              Object.assign(vals, {
                readonly: _this.props.readonly
              })
              _this.onSearch(vals)
            })
          } else {
            message.error('启用策略失败')
          }
          // 隐藏modal
          modal.hide()
        })
      }
    })
  }
  componentDidMount () {
    const { readonly } = this.props
    this.onSearch({
      readonly
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: '名称',
      dataIndex: 'name'
    }, {
      title: '说明',
      dataIndex: 'desc'
    }, {
      title: '操作',
      render: (val, row) => {
        return (<div>
          <a onClick={this.showDetail.bind(this, row)}>查看</a>&nbsp;&nbsp;
          {row.status === 1 && <a onClick={this.disableStrategy.bind(this, row)}>禁用</a>}
          {row.status === 2 && <a onClick={this.enableStrategy.bind(this, row)}>启用</a>}
        </div>)
      }
    }]
    const data = this.state.data
    return (
      <div className={'contentBody'}>
        {/* <div className="searchPanel">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="名称">
              {getFieldDecorator('name')(
                <Input style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem label="说明">
              {getFieldDecorator('desc')(
                <Input style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button"> 查询</Button>
            </FormItem>
            <Button type="primary" onClick={this.addNew} className="login-form-button" style={{ float: 'right' }}> 新增</Button>
          </Form>
        </div> */}
        <div style={{ marginBottom: 24, background: '#fff', padding: 15 }}>
          {
            this.props.readonly &&
            <Search
              paramKeys={[17, 18]}
              onSearch={this.onSearch.bind(this, false)}
            />
          }
          {
            !this.props.readonly &&
            <Search
              paramKeys={[17, 18]}
              onSearch={this.onSearch.bind(this, false)}
              isAddUser={true}
              addNew={this.addNew.bind(this)}
              title='新增'
            />
          }
        </div>
        <div style={{ background: '#fff' }}>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={data}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    )
  }
}
export default withRouter(Form.create()(StrageyList))
