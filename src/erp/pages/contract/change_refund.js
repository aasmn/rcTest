import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
import { getListData, deleteData, putData } from '@/erp/api'
import { Button, message } from 'antd'

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
    items: [{
        label: '所属公司',
        type: 'custom',
        field: 'SubsidiaryId',
        view: BelongCompany,
        defaultValue: '0',
        more: true
    }, {
        label: '甲方/联系人',
        type: 'text',
        field: 'CompanyName',
        
    }, {
        label: '退款单号/变更单号',
        type: 'text',
        field: 'RefundNo'
    },  {
        label: '签订日期',
        type: 'date',
        field: 'ContractStartDate',
        more: true
    }, {
        label: '至',
        type: 'date',
        field: 'ContractEndDate',
        more: true
    }, {
        label: '退款状态',
        type: 'select',
        field: 'RefundStatus',
        data: [{ id: 0, label: '全部' }, { id: 1, label: '待审核' }, { id: 2, label: '已打款' }, { id: 3, label: '已取消' }],
        defaultValue: '0',
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
        getListData('order/taxpayeredit/' + row.OrderId).then(res => {
            const AddOn = (props) => {
                return (<Button.Group>
                    <RIf if={props.data.RefundStatus == 1}><Button type="primary" onClick={e => this.auditPass(props.data, dialog)}>财务审核</Button></RIf>
                    <RIf if={props.data.RefundStatus == 1}><Button type="primary" onClick={e => this.reject(props.data, dialog)}>财务取消</Button></RIf>
                </Button.Group>)
            };
            const dialog = Dialog({
                content: <ContractChangeDailog RefundStatus={row.RefundStatus} readOnly={true} addOn={<AddOn data={row} />} data={res.data} review={true} ref={e => { e && (e.handler = dialog, this.dialogContent = e) }} />,
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
    render() {
        const columns = [{
            title: '所属公司',
            dataIndex: 'subCompanyName'
        }, {
            title: '退款单号',
            dataIndex: 'RefundOrderNo',
            width: 165,
            render: (val, record) => {
                return (<div style={{ position: "relative" }}>
                    <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val}</a>
                </div>);
            }
        }, {
            title: '变更单号',
            dataIndex: 'OrderNo',
        }, {
            title: '甲方',
            dataIndex: 'CompanyName'
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '申请金额',
            dataIndex: 'RefundAmount',
        }, {
            title: '签订日期',
            dataIndex: 'ContractDate',
            render: val => fDate(val)
        }, {
            title: '申请状态',
            dataIndex: 'RefundStatus',
            render: (val, record) => {
                const refundStatus = [{ id: 1, label: '待审核' }, { id: 2, label: '已打款' }, { id: 3, label: '已取消' }];
                const item = _.find(refundStatus, { id: val });
                return item && item.label;
            }
        }];
        return (
            <div>
                <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch} />
                <OrderTable SearchParams={this.state.searchParams} searchUrl="order/changerefundlist" columns={columns} tab={1} />
            </div>
        );
    }
}

export default Main
