import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
import { getListData, deleteData, putData } from '@/erp/api'
import { Button, Tabs, message } from 'antd'
// import HasPower from '@/erp/container/HasPower'
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
        label: '所属公司',
        type: 'custom',
        field: 'SubsidiaryId',
        view: BelongCompany,
        defaultValue: '0',
        more: true
    }, {
        label: '甲方/联系人',
        type: 'text',
        field: 'companyname'
    }, {
        label: '变更单号/订单号',
        type: 'text',
        field: 'ChangeOrderNo'
    },  {
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
        const post = {
            OrderId: data.OrderId,
            Remark: '',
            AuditVal: 0,
            RefundId: (data.RefundItem && data.RefundItem.Id) || 0,
            OrderSourceId: data.OrderSourceId
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
            title: '驳回原因',
            handleOk: (resStr) => {
                // if (!resStr) {
                //     message.error('请填写驳回原因！');
                //     return false;
                // }
                return new Promise((resolve, reject) => {
                    const state = store.getState();
                    resStr = resStr ? resStr + '{' + state.common.user.RealName + '}' : ''
                    putData('order/financeaudit', {
                        OrderId: data.OrderId,
                        Remark: resStr,
                        AuditVal: 1,
                        RefundId: (data.RefundItem && data.RefundItem.Id) || 0,
                        OrderSourceId: data.OrderSourceId
                    }).then(res => {
                        if (res.status) {
                            message.info('驳回成功！');
                            dialog.close()
                            resolve();
                        }
                    })
                });
            }
        });
    }
    sure = (data, dialog)=> {
        const post = {
            OrderId: data.OrderId,
            remark: '',
            auditVal: 2
        };
        putData('order/financeaudit', post).then(res => {
            // console.log(res)
            if (res.status) {
                dialog.close()
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
        console.log(this.refs.tabs)
        getListData('order/taxpayeredit/' + row.OrderId).then(res => {
            const AddOn = (props) => {
                return (<Button.Group>
                    <RIf if={props.data.OrderStatus == 2 || props.data.OrderStatus == 7}><Button type="primary" onClick={e => this.auditPass(props.data, dialog)}>{props.data.OrderSourceId==1?'财务审核':'网店到款'}</Button></RIf>
                    <RIf if={props.data.OrderStatus == 2 || props.data.OrderStatus == 7}><Button type="primary" onClick={e => this.reject(props.data, dialog)}>财务驳回</Button></RIf>
                    <RIf if={props.data.OrderSourceId == 2}><Button type="primary" onClick={e => { this.sure(props.data, dialog) }} disabled={props.data.OrderStatus !== 4}>财务确认</Button></RIf>
                </Button.Group>)
            };
            const dialog = Dialog({
                content: <ContractChangeDailog readOnly={true} centerReadOnly={true} addOn={<AddOn data={res.data.ChangeOrderDto} />} data={res.data} ref={e => { e && (e.handler = dialog) }} />,
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
            dataIndex: 'subCompanyName',
        }, {
            title: '变更单号',
            dataIndex: 'OrderNo',
            width: 165,
            render: (val, record) => {
                return (<div style={{ position: "relative" }}>
                    <a href="javascript:;" onClick={e => this.viewOrder(record)}>{val}</a>
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
            title: '订单状态',
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
                <Tabs defaultActiveKey="NOALL" ref="tabs">
                    <TabPane tab="待处理" key="YY" forceRender={true}>
                        <OrderTable SearchParams={this.state.searchParams} searchUrl="order/financetaxpayerlist" columns={columns} tab={1} />
                    </TabPane>
                    <TabPane tab="全部订单" key="ALL" forceRender={true}>
                        <OrderTable SearchParams={this.state.searchParams} searchUrl="order/financetaxpayerlist" columns={columns} tab={2} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Main
