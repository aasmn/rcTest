import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'


// import { Tabs } from 'antd'
// import HasPower from '@/erp/container/HasPower'
import OrderTable from '@/erp/container/Contract/OrderTable'

import _ from 'lodash'
import { fDate, fTaxStatus } from '@/erp/config/filters'

import Dialog from '@/erp/container/Dialog'
import { deleteData } from '@/erp/api'
import TaxStatusSelect from '@/erp/container/searchComponent/TaxStatusSelect'
import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
// import RIf from '@/erp/component/RIF'

import TaskDialog from '@/erp/container/task/TaskDialog'

// const TabPane = Tabs.TabPane;

let search = {
    items: [{
        label: '甲方/联系人',
        type: 'text',
        field: 'company_name_or_linkman',
        tab: '12'
    }, {
        label: '合同/订单编号',
        type: 'text',
        field: 'contract_no',
        tab: '12'
    }, {
        label: '负责销售',
        type: 'text',
        field: 'sales_name',
        more: true,
        tab: '12'
    }, {
        label: '区域',
        type: 'custom',
        field: 'area_code',
        view: AreaSelect,
        defaultValue: '',
        more: true,
        tab: '12'
    }, {
        label: '报税状态',
        type: 'custom',
        field: 'agent_status',
        view: TaxStatusSelect,
        more: true,
        tab: '1'
    }, {
        label: '服务期止',
        type: 'date',
        field: 'service_end1',
        more: true,
        tab: '1'
    }, {
        label: '至',
        type: 'date',
        field: 'service_end2',
        more: true,
        tab: '1'
    }, {
        label: '任务状态',
        type: 'select',
        field: 'contractStatus',
        data: {
            ' ': "全部",
            1: "未开始",
            2: "外勤服务",
            3: "会计服务",
            4: "外勤会计服务",
            5: "结束",
            6: "中止"
        },
        more: true,
        tab: '2'
    }, {
        label: '分配对象',
        type: 'select',
        field: 'contractStatus',
        data: {
            ' ': "全部",
            1: "会计",
            2: "会计-外勤",
            3: "外勤"
        },
        more: true,
        tab: '2'
    }, {
        label: '外勤审核状态',
        type: 'select',
        field: 'contractStatus',
        data: {
            ' ': "全部",
            1: "待审核",
            2: "通过",
            3: "驳回",
            4: "其他（空）"
        },
        more: true,
        tab: '2'
    }, {
        label: '会计审核状态',
        type: 'select',
        field: 'contractStatus',
        data: {
            ' ': "全部",
            1: "待审核",
            2: "通过",
            3: "驳回",
            4: "其他（空）"
        },
        more: true,
        tab: '2'
    }, {
        label: '创建日期',
        type: 'date',
        field: 'createtimeStart',
        more: true,
        tab: '2'
    }, {
        label: '至',
        type: 'date',
        field: 'createtimeEnd',
        more: true,
        tab: '2'
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
        this.viewOrder = this.viewOrder.bind(this);
    }
    onSearch(res) {
        if (!res) res = this.state.searchParams1;
        const params = { ...res };
        params._id = _.uniqueId('sq_');
        this.setState({ searchParams1: params });
    }
    viewOrder(row) {
        const dialog = Dialog({
            content: <TaskDialog row={row} close={v => { dialog.close(true) }} refreshTable={this.onSearch} />,
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
    viewCustomer = (row) => {

    }
    delete = (row) => {
        deleteData('workorder/stopcontract/del?billSuspensionId=' + row.Id).then(res => {
            if (res.status) {
                this.onSearch(this.state.searchParams);
            }
        })
    }
    render() {
        const columns = [{
            title: '序列ID',
            dataIndex: 'SequenceNo',
            width: 180,
            render: (val, record) => {
                return (<div style={{ position: "relative" }}>
                    <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val || '（空）'}</a>
                </div>);
            }
        }, {
            title: '甲方',
            dataIndex: 'CompanyName',
            render: (val, record) => {
                return <a href="javascript:;" onClick={this.viewOrder.bind(this, record)}>{val}</a>;
            }
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '负责销售',
            dataIndex: 'SalesName',
        }, {
            title: '报税状态',
            dataIndex: 'AgentStatus',
            render: val => fTaxStatus(val)
        }, {
            title: '服务期止',
            dataIndex: 'ServiceEnd',
            render: fDate
        }];
        const searchItems1 = _.filter(search.items, t => (t.tab.indexOf('1') > -1));
        return (
            <div>
                <SearchForm items={searchItems1} buttons={search.buttons} onSearch={this.onSearch} />
                <OrderTable SearchParams={this.state.searchParams1} searchUrl="customer/to-do-list" columns={columns}/>
            </div>
        );
    }
}




export default Main
