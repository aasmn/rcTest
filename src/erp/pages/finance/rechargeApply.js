import React from 'react'
import '@/erp/style/main.less'
import '@/erp/style/channel.less'
import { Table, Button, message } from 'antd'
import { getListData, putData, postData } from '@/erp/api'
import { fDate } from '@/erp/config/filters'
import Dialog from '@/erp/container/Dialog'
import SearchForm from '@/erp/container/SearchForm'
import RechargeApply from '@/erp/container/channel/RechargeApply'
import Confirm from '@/erp/component/Confirm'

let search = {
  items: [{
    label: '代理商',
    type: 'text',
    field: 'channelname'
  }, {
    label: '状态',
    type: 'select',
    field: 'status',
    data: [{ id: 0, label: '全部' }, { id: 1, label: '未审核' }, { id: 2, label: '通过' }, { id: 3, label: '拒审' }],
    defaultValue: '0'
  }, {
    label: '',
    type: 'date',
    field: 'start'
  }, {
    label: '',
    type: 'date',
    field: 'end'
  }],
  buttons:[]
};
export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal(total) {
          return `共计 @/erp{total} 条`;
        }
      },
      searchParams: {},
      loading: false,
      balance: '',
      data: []
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.viewapply = this.viewapply.bind(this)
    this.apply = this.apply.bind(this)
    this.delete = this.delete.bind(this)
  }
  handleTableChange (pagination){
    this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
  }
  onSearch(vals={}) {
    this.setState({searchParams: vals, loading: true});
    const pagination =this.state.pagination;
    vals.limit = pagination.pageSize;
    vals.offset = (pagination.current - 1) * pagination.pageSize;
    console.log(vals, 'vals')
    return getListData('finance/getprepai/list', vals).then(res => {
      if(res.status){
        const pagination = { ...this.state.pagination };
        pagination.total = res.Count;
        this.setState({
          loading: false,
          data: res.data,
          pagination,
        });
      }
      return res;
    },err=>{
      this.setState({
        loading: false
      });
    })
  }
  viewapply (item) {
    Dialog({
      content: <RechargeApply data={item} readOnly={true} ref={crmform =>{this.crmform = crmform}}/>,
      width: 800,
      handleOk: ()=>{
        return new Promise((resolve, reject) => {
          resolve()
        });
      },
      confirmLoading: false,
      handleCancel (){
        console.log('onCancel')
      },
      title: '充值申请'
    })
  }
  delete (id) {
    Confirm({
      handleOk: () => {
        putData('finance/deleteprepai?id=' + id)
          .then(res => {
            if (res.status) {
              message.info('删除成功！')
              this.onSearch(this.state.searchParams)
            }
          })
      },
      message: '确认要删除充值申请？'
    })
  }
  componentWillMount() {
    getListData('finance/balance').then(res => {
      if (res.status) {
        this.setState({
          balance: res.data
        })
      }
    })
    this.onSearch()
  }
  apply (item) {
    console.log(this, 'this')
    Dialog({
      content: <RechargeApply data={item} ref={crmform =>{this.crmform = crmform}}/>,
      width: 800,
      handleOk: ()=>{
        return new Promise((resolve, reject) => {
          console.log(this)
          const formValues = this.crmform.getFieldsValue()
          formValues.Status = 1
          if(formValues){
            console.log(formValues, 'formValues')
            if (formValues.Id) {
              putData('finance/putprepai', formValues).then(res => {
                if(res.status){
                  message.info('修改成功！')
                  resolve()
                }else{
                  // message.error(res.message);
                  reject()
                }
              })
            } else {
              postData('finance/addprepai', formValues).then(res => {
                if(res.status){
                  message.info('保存成功！')
                  resolve()
                }else{
                  // message.error(res.message);
                  reject()
                }
              })
            }
          }else{
            reject();
          }
        });
      },
      confirmLoading: false,
      handleCancel (){
        console.log('onCancel')
      },
      title: '充值申请'
    }).result.then(()=>{
        this.onSearch(this.state.searchParams)
    },()=>{});
  }
  render () {
    const columns = [{
      title: '一级代理商',
      dataIndex: 'ChannelName1'
    }, {
      title: '二级代理商',
      dataIndex: 'ChannelName2'
    }, {
      title: '充值金额',
      dataIndex: 'Amount'
    }, {
      title: '余额',
      dataIndex: 'Balance'
    }, {
      title: '申请时间',
      dataIndex: 'CreateDate',
      render: val => fDate(val)
    }, {
      title: '状态',
      dataIndex: 'Status',
      render: val => {
        let str = ''
        if (val === 1) {
          str = '未审核'
        } else if (val === 2) {
          str = '通过'
        } else if (val === 3) {
          str = '拒审'
        }
        return str
      }
    }, {
      title: '审批意见',
      dataIndex: 'AuditOpinion'
    }, {
      render: (text, record) => (
        <Button.Group>
          {
            record.Status === 2 &&
            <Button size="small" onClick={e => { this.viewapply(record)}}>查看</Button>
          }
          {
            record.Status !== 2 &&
            <div>
              <Button size="small" onClick={e => { this.apply(record)}}>修改</Button>
              <Button size="small" onClick={e => { this.delete(record.Id)}}>删除</Button>
            </div>
          }
        </Button.Group>
      )
    }]
    return (
      <div className="more-notice recharge-apply" style={{ background: '#fff', padding: '10px' }}>
        <h3 className="vheader">充值申请</h3>
        <div className="invoice-declare">
          <strong>账户金额</strong>
          <span style={{ color: 'red'}}>{this.state.balance}元</span>
          <Button type="primary" onClick={this.apply}>充值申请</Button>
        </div>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
        <Table columns={columns}
            rowKey={record => record.Id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            size="middle"
            bordered={true}
        />
      </div>
    )
  }
}