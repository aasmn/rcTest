import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
// import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
import { deleteData, putData } from '@/erp/api'
import { message } from 'antd'
import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
import OrderTable from '@/erp/container/Contract/OrderTable'
import _ from 'lodash'
// import { fDate } from '@/erp/config/filters'
import OrderDialog from '@/erp/container/Contract/OrderDialog'
import Dialog from '@/erp/container/Dialog'
// import ContractChangeDailog from '@/erp/container/Contract/ContractChangeDailog'
// import RIf from '@/erp/component/RIF'
import Confirm from '@/erp/component/Confirm'
import store from '@/erp/store'
import Prompt from '@/erp/component/Prompt'
import DiscontinueDialog from '@/erp/container/Contract2/DiscontinueDialog'
import ZFReason from '@/erp/container/searchComponent/ZFReason'

// const TabPane = Tabs.TabPane;
// const changeOrderStatus = [
//     { id: 0, label: '全部' },
//     { id: 1, label: '审单待审核' },
//     { id: 2, label: '审单已审核' },
//     { id: 3, label: '审单已驳回' },
//     { id: 4, label: '财务已审核/ 网店到款' },
//     { id: 5, label: '财务驳回' },
//     { id: 6, label: '财务确认' },
//     { id: 7, label: '总经理审核' },
//     { id: 8, label: '总经理驳回' },
//     { id: 9, label: '已退款' }
// ];
let search = {
    items: [ {
      label: '所属公司',
      type: 'custom',
      field: 'subsidiaryId',
      view: BelongCompany,
      defaultValue: '0',
      more: true
  }, {
        label: '甲方/联系人',
        type: 'text',
        field: 'CompanyName',
        
    }, {
        label: '合同/退款单号',
        type: 'text',
        field: 'RefundNo'
    }, {
      label: '作废原因',
      type: 'custom',
      field: 'reason',
      view: ZFReason,
      more: true
    },{
      label: '退款创建时间',
      type: 'date',
      field: 'createtimeStart',
      more: true
  }, {
      label: '至',
      type: 'date',
      field: 'createtimeEnd',
      more: true
  }],
    buttons: []
};

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParams: {}
        };
        this.onSearch = this.onSearch.bind(this);
        this.viewOrder = this.viewOrder.bind(this);
    }

    onSearch(res) {
        const params = { ...res };
        params._id = _.uniqueId('sq_');
        this.setState({ searchParams: params });
    }
    auditPass = (data, dialog) => {
        console.log(this.dialogContent);
        if (!this.dialogContent.state.refundData.RefundTime) {
            message.error('请填写打款时间！');
            return;
        }
        const post = {
            OrderId: data.OrderId,
            Remark: '',
            AuditVal: 3,
            RefundId: data.RefundId,
            RefundTime: this.dialogContent.state.refundData.RefundTime.format('YYYY-MM-DD')
        };
        putData('order/financeaudit', post).then(res => {
            if (res.status) {
                message.info('审核成功');
                dialog.close();
            }
        });
    }
    reject(data, dialog) {
        Prompt({
            title: '取消原因',
            handleOk: (resStr) => {
                if (!resStr) {
                    message.error('请填写取消原因！');
                    return false;
                }
                return new Promise((resolve, reject) => {
                    const state = store.getState();
                    resStr = resStr ? resStr + '{' + state.common.user.RealName + '}' : ''
                    putData('order/financeaudit', {
                        OrderId: data.OrderId,
                        Remark: resStr,
                        AuditVal: 4,
                        RefundId: data.RefundId,
                    }).then(res => {
                        if (res.status) {
                            message.info('取消成功！');
                            dialog.close()
                            resolve();
                        }
                    })
                });
            }
        });
    }
    deleteOrder(row) {
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
    viewOrder(row) {
      row.BillSuspensionId = row.Id
      const dialog = Dialog({
        content: <DiscontinueDialog type={2} close={()=>{dialog.close(true)}} data={row} reviewable={false} ref={v => { v && (v.handler = dialog) }} />,
        width: 1100,
        confirmLoading: false,
        footer: null,
        title: row.CompanyName || '中止合同'
      })
      dialog.result.then(() => {
          this.onSearch(this.state.searchParams);
      }, () => {
          // this.onSearch(this.state.searchParams);
      });

    }
    render() {
        const columns = [{
            title: '所属公司',
            dataIndex: 'SubCompanyName'
        }, {
            title: '退款单号',
            dataIndex: 'BillNo',
            width: 165,
            render: (val, record) => {
                return (<div style={{ position: "relative" }}>
                    <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val}</a>
                </div>);
            }
        },  {
            title: '甲方',
            dataIndex: 'CompanyName'
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '申请金额',
            dataIndex: 'RefundAmount',
        }, {
            title: '作废原因',
            dataIndex: 'Reason'
        }];
        return (
            <div>
                <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch} />
                <OrderTable SearchParams={this.state.searchParams} searchUrl="workorder/stopcontract/list4cancle" columns={columns} tab={1} />
            </div>
        );
    }
}

export default Main
