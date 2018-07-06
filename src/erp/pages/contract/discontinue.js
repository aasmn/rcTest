import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'


import { Tabs, Icon } from 'antd'
import HasPower from '@/erp/container/HasPower'
import OrderTable from '@/erp/container/Contract/OrderTable'

import _ from 'lodash'
import { fContractReviewStatus } from '@/erp/config/filters'

import Dialog from '@/erp/container/Dialog'
import { deleteData } from '@/erp/api'
// import OrderViewDialog from '@/erp/container/Contract2/OrderViewDialog'
import CustomerViewDialog from '@/erp/container/Contract2/CustomerViewDialog'
import DiscontinueDialog from '@/erp/container/Contract2/DiscontinueDialog'
import RIf from '@/erp/component/RIF'
import Confirm from '@/erp/component/Confirm'

const TabPane = Tabs.TabPane;

let search = {
    items: [{
        label: '甲方/联系人',
        type: 'text',
        field: 'companyNameOrLinkman',
        tab: '12'
    }, {
        label: '合同/中止单号',
        type: 'text',
        field: 'contractNoOrWorkOrderNo',
        tab: '12'
    }, {
        label: '是否退费',
        type: 'select',
        field: 'isRefund',
        data: {
            ' ': '全部',
            "1": '退费',
            "0": '不退费'
        },
        more: true,
        tab: '12'
    }, {
        label: '审核状态',
        type: 'select',
        field: 'wfsStopContract',
        data: {
            ' ': "全部",
            1: "审单审核",
            2: "外勤审核",
            12: "外勤驳回",
            3: "会计审核",
            13: "会计驳回",
            4: "城市总审核",
            14: "城市总驳回",
            6: "结束"
        },
        more: true,
        tab: '12'
    }, {
        label: '中止月份',
        type: 'date',
        field: 'stopTimeStart',
        tab: '2',
        more: true
    }, {
        label: '至',
        type: 'date',
        field: 'stopTimeEnd',
        more: true,
        tab: '2'
    }, {
        label: '创建日期',
        type: 'date',
        field: 'createtimeStart',
        more: true,
        tab: '12'
    }, {
        label: '至',
        type: 'date',
        field: 'createtimeEnd',
        more: true,
        tab: '12'
    }],
    buttons: []
};

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParams1: {},
            searchParams2: {},
            activeTab: 'NOALL'
        };
        this.onSearch = this.onSearch.bind(this);
        this.onSearch1 = this.onSearch1.bind(this);
        this.onSearch2 = this.onSearch2.bind(this);
        this.viewOrder = this.viewOrder.bind(this);
    }
    onSearch() {
        this.onSearch1(this.state.searchParams1);
        this.onSearch2(this.state.searchParams2);
    }
    onSearch1(res) {
        if (!res) res = this.state.searchParams1;
        const params = { ...res };
        params._id = _.uniqueId('sq_');
        this.setState({ searchParams1: params });

    }
    onSearch2(res) {
        if (!res) res = this.state.searchParams2;
        const params = { ...res };
        params._id = _.uniqueId('sq_');
        this.setState({ searchParams2: params });

    }
    viewOrder(row) {
        row.BillSuspensionId = row.Id
        const dialog = Dialog({
            content: <DiscontinueDialog type={1} close={()=>{dialog.close(true)}} data={row} contractId={row.OrderItemId} reviewable={this.state.activeTab=="NOALL"} ref={v => { v && (v.handler = dialog) }} />,
            width: 1100,
            confirmLoading: false,
            footer: null,
            title: row.CompanyName
        })
        dialog.result.then(() => {
            this.onSearch(this.state.searchParams);
        }, () => {
            // this.onSearch(this.state.searchParams);
        });
    }
    viewCustomer=(row)=> {
        const dialog = Dialog({
            content: <CustomerViewDialog data={row} ref={v => { v && (v.handler = dialog) }} />,
            width: 1100,
            confirmLoading: false,
            footer: null,
            title: row.CompanyName
        })
        dialog.result.then(() => {
            
        }, () => {
            // this.onSearch(this.state.searchParams);
        });
    }
    delete = (row)=>{
        Confirm({
            handleOk: () => {
                deleteData('workorder/stopcontract/del?billSuspensionId=' + row.Id).then(res => {
                    if (res.status) {
                        this.onSearch(this.state.searchParams);
                    }
                });
            },
            message: "确定要删除吗？"
        })
        
    }
    render() {
        const columns = [{
            title: '中止单号',
            dataIndex: 'BillNo',
            width: 180,
            tab: '1',
            render: (val, record) => {
                return (<div style={{ position: "relative" }}>
                    <RIf if={record.AuditStatus == 1 || record.AuditStatus > 6 } key={val + '_1'}><HasPower power="DELETE"><Icon type="close-circle" className="list-close-icon" onClick={e => { this.delete(record) }} /></HasPower></RIf>
                    <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val||'（空）'}</a>
                </div>);
            }
        }, {
            title: '中止单号',
            dataIndex: 'BillNo',
            width: 180,
            tab: '2',
            render: (val, record) => {
                return (<div style={{ position: "relative" }}>
                    <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val}</a>
                </div>);
            }
        },{
            title: '甲方',
            dataIndex: 'CompanyName',
            tab: '12',
            render: (val, record) => {
                return <a href="javascript:;" onClick={this.viewCustomer.bind(this, record)}>{val}</a>;
            }
        }, {
            title: '联系人',
            dataIndex: 'Connector',
            tab: '12',
        }, {
            title: '退款金额',
            dataIndex: 'RefundAmount',
            tab: '12',
            render: val => { return (val || 0); }
        }, {
            title: '中止月份',
            dataIndex: 'SuspensionMonth',
            tab: '12'
        }, {
            title: '审核状态',
            dataIndex: 'AuditStatus',
            tab: '12',
            render: val => fContractReviewStatus(val)
        }];
        const searchItems1 = _.filter(search.items, t=>(t.tab.indexOf('1')>-1));
        const searchItems2 = _.filter(search.items, t => (t.tab.indexOf('2') > -1));
        const columns1 = _.filter(columns, t => (t.tab.indexOf('1') > -1));
        const columns2 = _.filter(columns, t => (t.tab.indexOf('2') > -1));
        return (
            <div>
                <Tabs defaultActiveKey="NOALL" onChange={t => { this.setState({ activeTab: t }) }}>
                    <TabPane tab="待处理" key="NOALL" forceRender={true}>
                        <SearchForm items={searchItems1} buttons={search.buttons} onSearch={this.onSearch1} />
                        <OrderTable SearchParams={this.state.searchParams1} searchUrl="workorder/stopcontract/list" columns={columns1} isAll={false} />
                    </TabPane>
                    <TabPane tab="全部" key="ALL" forceRender={true}>
                        <SearchForm items={searchItems2} buttons={search.buttons} onSearch={this.onSearch2} />
                        <OrderTable SearchParams={this.state.searchParams2} searchUrl="workorder/stopcontract/list" columns={columns2} isAll={true} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}




export default Main
