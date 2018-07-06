import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'


import { Tabs, Icon } from 'antd'

import OrderTable from '@/erp/container/Contract/OrderTable'

import _ from 'lodash'
import { fDKStatus } from '@/erp/config/filters'

import Dialog from '@/erp/container/Dialog'
import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
import CustomerViewDialog from '@/erp/container/Contract2/CustomerViewDialog'
import PayBackDialog from '@/erp/container/Contract2/PayBackDialog'
import RIf from '@/erp/component/RIF'


const TabPane = Tabs.TabPane;

let search = {
    items: [{
        label: '甲方/联系人',
        type: 'text',
        field: 'companyName',
        tab: '12'
    }, {
        label: '打款单号',
        type: 'text',
        field: 'moneyBillCode',
        tab: '12'
    }, {
        label: '所属公司',
        type: 'custom',
        field: 'subsidiary',
        view: BelongCompany,
        defaultValue: '0',
        more: true,
        tab: '12'
    }, {
        label: '申请金额',
        type: 'text',
        field: 'amount',
        more: true,
        tab: '12'
    }, {
        label: '申请人',
        type: 'text',
        field: 'connector',
        more: true,
        tab: '12'
    }, {
        label: '来源',
        type: 'select',
        field: 'moneyOrderType',
        data: {
            ' ': "全部",
            1: "中止单",
            2: "领用单",
            3: "变更单",
        },
        more: true,
        tab: '12'
    }, {
        label: '打款状态',
        type: 'select',
        field: 'moneyStatus',
        data: {
            '-1': "全部",
            1: "财务打款",
            2: "结束"
        },
        defaultValue: '-1',
        more: true,
        tab: '2'
    }, {
        label: '创建日期',
        type: 'date',
        field: 'startTime',
        more: true,
        tab: '12'
    }, {
        label: '至',
        type: 'date',
        field: 'endTime',
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
            searchParams2: {}
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
        if(row.Category){
            row.Id = row.BillId;
            const dialog = Dialog({
                content: <PayBackDialog close={() => { dialog.close(true) }} data={row} contractId={row.OrderItemId} ref={v => { v && (v.handler = dialog) }} />,
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
    }
    viewCustomer = (row) => {
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
    delete = () => {
        console.log('delete')
    }
    render() {
        const columns = [{
            title: '直营',
            dataIndex: 'SubsidiaryName',
            tab: '12',
        }, {
            title: '打款单号',
            dataIndex: 'MoneyBillCode',
            render: (val, record) => {
                return (<div style={{ position: "relative" }}>
                    <RIf if={record.AuditStatus == 1 || record > 6} key={val + '_1'}><Icon type="close-circle" className="list-close-icon" onClick={e => { this.delete(record) }} /></RIf>
                    <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val}</a>
                </div>);
            },
            tab: '12',
        }, {
            title: '甲方',
            dataIndex: 'CompanyName',
            tab: '12',
        }, {
            title: '申请人',
            dataIndex: 'Connector',
            tab: '12',
        }, {
            title: '申请金额',
            dataIndex: 'Amount',
            tab: '12',
        }, {
            title: '打款状态',
            dataIndex: 'MoneyStatus',
            tab: '2',
            render: (val) => fDKStatus(val)
        }];
        const searchItems1 = _.filter(search.items, t => (t.tab.indexOf('1') > -1));
        const searchItems2 = _.filter(search.items, t => (t.tab.indexOf('2') > -1));
        const columns1 = _.filter(columns, t => (t.tab.indexOf('1') > -1));
        const columns2 = _.filter(columns, t => (t.tab.indexOf('2') > -1));
        return (
            <div>
                <Tabs defaultActiveKey="NOALL">
                    <TabPane tab="待处理" key="NOALL" forceRender={true}>
                        <SearchForm items={searchItems1} buttons={search.buttons} onSearch={this.onSearch1} />
                        <OrderTable keyStr="BillId" SearchParams={this.state.searchParams1} searchUrl="MoneyOrder" columns={columns1} isAll={false} />
                    </TabPane>
                    <TabPane tab="全部" key="ALL" forceRender={true}>
                        <SearchForm  items={searchItems2} buttons={search.buttons} onSearch={this.onSearch2} />
                        <OrderTable keyStr="BillId" SearchParams={this.state.searchParams2} searchUrl="MoneyOrder" columns={columns2} isAll={true} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Main
