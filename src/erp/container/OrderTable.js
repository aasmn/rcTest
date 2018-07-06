import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { getListData, putData } from '@/erp/api'
import _ from 'lodash'
import Confirm from '@/erp/component/Confirm'

class OrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {
          current: 1,
          pageSize: 15,
          pageSizeOptions: ['20','50','80','100','200'],
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal(total) {
            return `共计 @/erp{total} 条`;
          }
      },
      searchParams: {},
      selectedRowKeys: [],
      loading: false,
    };
    this.Search = this.Search.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.checkAll = this.checkAll.bind(this);
  }

  handleTableChange (pagination){
    this.setState({pagination: pagination}, ()=>{this.Search()})
  }
  Search() {
      // console.log(this.state.searchParams, 'searchParams')
      this.setState({loading: true});
      const state = _.cloneDeep(this.state);
      const searchParams = state.searchParams;
      const pagination = state.pagination;
      // console.log(pagination, 'pagination')
      var vals = searchParams
      vals.limit = pagination.pageSize;
      vals.offset = (pagination.current - 1) * pagination.pageSize;
      if (this.props.isAll) {
        vals.treatedOrder = 0
      } else {
        vals.treatedOrder = 1
      }
      getListData(this.props.SearchUrl, vals).then(res => {
          if(res.status){
              const pagination = { ...this.state.pagination };
              pagination.total = res.data.total;
              this.setState({
                  loading: false,
                  data: res.data.list,
                  pagination,
              });
          }
      },err=>{
          this.setState({
              loading: false
          });
      })
  }
  componentWillMount () {
    this.Search()
  }
  componentWillReceiveProps(props) { // 在组件接收到新的props的时候调用
    // console.log(props, 'props Search')
    // console.log(this.props, 'this.props')
    if(!_.isEqual(this.props.SearchParams,props.SearchParams)){
      var pagination = {
        current: 1,
        pageSize: 15,
        showTotal(total) {
          return `共计 @/erp{total} 条`;
        }
      }
      this.setState({searchParams: props.SearchParams, pagination: pagination}, () => {
        this.Search()
      })
    }
  }

  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  checkAll() {
    // console.log(this.state.selectedRowKeys, '批量审核时的选中参数')
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请至少选择一个公司！');
      return false
    }
    const selectKeys = this.state.selectedRowKeys
    // console.log(selectKeys, typeof(selectKeys), 'selectKeys')
    Confirm({
        handleOk:()=>{
          putData('order/financeauditlist', selectKeys).then(res => {
            console.log(res)
            if (res.status) {
              message.info('审核成功！');
              this.Search()
              this.setState({selectedRowKeys: []})
            }
          })
        },
        message: '确认要批量审核吗？'
    })
  }

  render() {
    const btnStyle = {position:' relative', bottom: '45px'}
    var { selectedRowKeys } = this.state;
    var rowSelection = !this.props.isAll ? {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
          disabled: record.OrderStatus != 2
      })
    } : null;

    return (
      <div>
        <Table columns={this.props.columns}
            rowKey={record => record.OrderId}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            size="middle"
            bordered={true}
            rowSelection={rowSelection}
        />
        {(!this.props.isAll) && <Button style={btnStyle} type="primary" onClick={this.checkAll} >批量审核</Button>}
      </div>
    )
  }
}

export default OrderTable
