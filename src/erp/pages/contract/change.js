import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import { getListData, deleteData, putData } from '@/erp/api'
import { Button, Tabs, Icon, message, Input } from 'antd'
import HasPower from '@/erp/container/HasPower'
import OrderTable from '@/erp/container/Contract/OrderTable'
import _ from 'lodash'
import { fDate } from '@/erp/config/filters'
// import OrderDialog from '@/erp/container/Contract/OrderDialog'
import Dialog from '@/erp/container/Dialog'
import ContractChangeDailog from '@/erp/container/Contract/ContractChangeDailog'
import RIf from '@/erp/component/RIF'
import Confirm from '@/erp/component/Confirm'
import store from '@/erp/store'
import Prompt from '@/erp/component/Prompt'


const TabPane = Tabs.TabPane;
const changeOrderStatus = [
  { id: 0, label: '全部' },
  { id: 1, label: '审单待审核' },
  { id: 2, label: '审单已审核' },
  { id: 3, label: '审单已驳回' },
  { id: 4, label: '财务已审核/ 网店到款' },
  { id: 5, label: '财务驳回' },
  { id: 6, label: '财务确认' },
  { id: 7, label: '总经理审核' },
  { id: 8, label: '总经理驳回' },
  { id: 9, label: '已退款' }
];
let search = {
  items: [{
    label: '甲方/联系人',
    type: 'text',
    field: 'companyname'
  }, {
    label: '变更单号/原订单号',
    type: 'text',
    field: 'ChangeOrderNo'
  }, {
    label: '订单来源',
    type: 'select',
    field: 'OrderSourceId',
    data: [{ id: 0, label: '全部' }, { id: 1, label: '电销' }, { id: 2, label: '天猫' }],
    defaultValue: '0',
    more: true
  }, {
    label: '变更单状态',
    type: 'select',
    field: 'ChangeStatus',
    data: changeOrderStatus,
    more: true
  }, {
    label: '销售人员',
    type: 'text',
    field: 'SalesName',
    more: true
  }, {
    label: '签订日期',
    type: 'date',
    field: 'ContractStartDate',
    more: true
  }, {
    label: '至',
    type: 'date',
    field: 'ContractEndDate',
    more: true
  }],
  buttons: []
};

class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchParams: {}
    };
    this.onSearch = this.onSearch.bind(this);
    this.viewOrder = this.viewOrder.bind(this);
  }

  onSearch (res) {
    const params = { ...res };
    params._id = _.uniqueId('sq_');
    this.setState({ searchParams: params });
  }
  auditPass = (data, dialog) => {
    const post = {
      OrderId: data.OrderId,
      remark: '',
      auditVal: 0
    };
    putData('order/audit', post).then(res => {
      // console.log(res)
      if (res.status) {
        message.info('审核成功')
        dialog.close()
      }
    });
  }
  auditMgPass = (data, dialog) => {
    let remark;
    Dialog({
      content: (<div><label>审核意见</label><Input.TextArea onChange={e => { remark = e.target.value }} /></div>),
      handleOk: () => {
        if (!remark) {
          message.error('请填写审核意见!');
          return false;
        }
        return save(remark);
      },
      width: 450,
      confirmLoading: false,
      title: "城市总审核"
    })
    function save (remark) {
      const state = store.getState();
      if (remark && !(/(\{.*\})$/.test(_.trim(remark)))) {
        remark = remark + '{' + state.common.user.RealName + '}';
      }
      const post = {
        OrderId: data.OrderId,
        remark: remark,
        AuditVal: 0,
        RefundId: data.RefundItem.Id,
        OrderSourceId: data.OrderSourceId
      };
      return putData('order/manageraudit', post).then(res => {
        if (res.status) {
          message.info('审核成功');
          dialog.close();
        }
      });
    }
  }
  reject (data, dialog) {
    Prompt({
      title: '驳回原因',
      handleOk: (resStr) => {
        // if(!resStr){
        //     message.error('请填写驳回原因！');
        //     return false;
        // }
        return new Promise((resolve, reject) => {
          const state = store.getState();
          resStr = resStr ? resStr + '{' + state.common.user.RealName + '}' : ''
          putData('order/audit', {
            OrderId: data.OrderId,
            remark: resStr,
            auditVal: 1
          }).then(res => {
            if (res.status) {
              message.info('驳回成功！');
              dialog.close()
              resolve();
            } else {
              reject()
            }
          })
        });
      }
    });
  }
  mgReject (data, dialog) {
    Prompt({
      title: '驳回原因',
      handleOk: (resStr) => {
        // if (!resStr) {
        //     message.error('请填写驳回原因！');
        //     return false;
        // }
        return new Promise((resolve, reject) => {
          const state = store.getState();
          resStr = resStr ? resStr + '{' + state.common.user.RealName + '}' : ''
          putData('order/manageraudit', {
            OrderId: data.OrderId,
            remark: resStr,
            AuditVal: 1,
            RefundId: data.RefundItem.Id,
            OrderSourceId: data.OrderSourceId
          }).then(res => {
            if (res.status) {
              message.info('驳回成功！');
              dialog.close()
              resolve();
            } else {
              reject()
            }
          })
        });
      }
    });
  }

  deleteOrder (row) {
    Confirm({
      handleOk: () => {
        deleteData('order/taxpayerdelete/' + row.OrderId).then(res => {
          if (res.status) {
            message.info('删除成功！');
            this.onSearch(this.state.searchParams)
          }
        })
      },
      message: '确认要删除吗？'
    })

  }
  viewOrder (row) {
    getListData('order/taxpayeredit/' + row.OrderId).then(res => {
      const AddOn = (props) => {
        return (<Button.Group>
          <HasPower power="SDSH"><RIf if={row.OrderStatus == 1}><Button type="primary" onClick={e => this.auditPass(props.data, dialog)}>审单审核</Button></RIf></HasPower>
          <HasPower power="SDSH"><RIf if={row.OrderStatus == 1}><Button type="primary" onClick={e => this.reject(props.data, dialog)}>审单驳回</Button></RIf></HasPower>
          <HasPower power="ZJSH"><RIf if={row.OrderStatus == 2 && props.data.RefundItem}><Button type="primary" onClick={e => this.auditMgPass(props.data, dialog)}>总经理审核</Button></RIf></HasPower >
          <HasPower power="ZJSH"><RIf if={row.OrderStatus == 2 && props.data.RefundItem}><Button type="primary" onClick={e => this.mgReject(props.data, dialog)}>总经理驳回</Button></RIf></HasPower >
        </Button.Group>)
      };
      const dialog = Dialog({
        content: <ContractChangeDailog readOnly={true} addOn={<AddOn data={res.data.ChangeOrderDto} />} data={res.data} onClose={e => { dialog.close() }} />,
        width: 1100,
        confirmLoading: false,
        footer: null,
        title: '查看订单'
      })
      dialog.result.then((res) => {
        this.onSearch(this.state.searchParams);
      }, () => { });
    });
  }
  render () {
    const columns = [{
      title: '变更单号',
      dataIndex: 'OrderNo',
      width: 165,
      render: (val, record) => {
        return (<div style={{ position: "relative" }}>
          <RIf if={record.OrderStatus == 1 || record.OrderStatus === 3 || record.OrderStatus === 5 || record.OrderStatus === 8} key={val + '_1'}><Icon type="close-circle" className="list-close-icon" onClick={e => { this.deleteOrder(record) }} /></RIf>
          <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val}</a>
        </div>);
      }
    }, {
      title: '订单号',
      dataIndex: 'OldOrderNo',
    }, {
      title: '甲方',
      dataIndex: 'CompanyName',
      render: (val, record) => {
        return <a href="javascript:;" onClick={e => this.viewOrder(record)}>{val}</a>
      }
    }, {
      title: '联系人',
      dataIndex: 'Connector',
    }, {
      title: '签单销售',
      dataIndex: 'OrderSalesName',
    }, {
      title: '订单来源',
      dataIndex: 'OrderSourceName'
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
      render: val => fDate(val)
    }, {
      title: '变更合同金额',
      dataIndex: 'Amount',
    }, {
      title: '退款金额',
      dataIndex: 'refundAmount',
    }, {
      title: '变更单状态',
      dataIndex: 'OrderStatus',
      render: (val, record) => {
        if (record.OrderStatus != 4) {
          return _.find(changeOrderStatus, { id: record.OrderStatus }).label;
        } else {
          return record.OrderSourceId == 1 ? '财务已审核' : '网店到款';
        }
      }
    }];
    return (
      <div>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch} />
        <Tabs defaultActiveKey="NOALL" >
          <TabPane tab="运营待处理" key="YY" forceRender={true}>
            <OrderTable SearchParams={this.state.searchParams} searchUrl="order/taxpayerlist" columns={columns} tab={1} />
          </TabPane>
          <TabPane tab="总经理待处理" key="ZJL" forceRender={true}>
            <OrderTable SearchParams={this.state.searchParams} searchUrl="order/taxpayerlist" columns={columns} tab={2} />
          </TabPane>
          <TabPane tab="全部变更单" key="ALL" forceRender={true}>
            <OrderTable SearchParams={this.state.searchParams} searchUrl="order/taxpayerlist" columns={columns} tab={3} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Main
