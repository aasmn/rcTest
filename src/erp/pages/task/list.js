import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'


import { Icon } from 'antd'
// import HasPower from '@/erp/container/HasPower'
import OrderTable from '@/erp/container/Contract/OrderTable'

import _ from 'lodash'
import { fServiceStatus, fCheckStatus, fAccountantStatus, fAssigningObject } from '@/erp/config/filters'

import Dialog from '@/erp/container/Dialog'
import { deleteData } from '@/erp/api'
// import TaxStatusSelect from '@/erp/container/searchComponent/TaxStatusSelect'
import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
import RIf from '@/erp/component/RIF'
import Confirm from '@/erp/component/Confirm'
import ViewTaskDialog from '@/erp/container/task/ViewTaskDialog'

// const TabPane = Tabs.TabPane;

let search = {
    items: [{
        label: '甲方/联系人',
        type: 'text',
        field: 'companyname',
        tab: '12'
    }, {
        label: '合同/订单编号',
        type: 'text',
        field: 'contractno',
        tab: '12'
    }, {
        label: '负责销售',
        type: 'text',
        field: 'salesname',
        more: true,
        tab: '12'
    }, {
        label: '区域',
        type: 'custom',
        field: 'areacode',
        view: AreaSelect,
        more: true,
        tab: '12'
    }, {
        label: '任务状态',
        type: 'select',
        field: 'taskstatus',
        data: {
            0: "全部",
            2: "未开始",
            3: "外勤服务",
            5: "会计服务",
            4: "外勤会计服务",
            7: "结束",
            8: "中止"
        },
        defaultValue: 0,
        more: true,
        tab: '2'
    }, {
        label: '分配对象',
        type: 'select',
        field: 'allocationobject',
        data: {
            0: "全部",
            2: "会计",
            3: "会计-外勤",
            1: "外勤"
        },
        defaultValue: 0,
        more: true,
        tab: '2'
    }, {
        label: '外勤审核状态',
        type: 'select',
        field: 'outWorkerstatus',
        data: {
            0: "全部",
            1: "待审核",
            2: "通过",
            3: "驳回",
            4: "其他（空）"
        },
        defaultValue: 0,
        more: true,
        tab: '2'
    }, {
        label: '会计审核状态',
        type: 'select',
        field: 'accountantstatus',
        data: {
            0: "全部",
            1: "待审核",
            2: "通过",
            3: "驳回",
            4: "其他（空）"
        },
        more: true,
        defaultValue: 0,
        tab: '2'
    }, {
        label: '创建日期',
        type: 'date',
        field: 'starttime',
        more: true,
        tab: '2'
    }, {
        label: '至',
        type: 'date',
        field: 'endtime',
        more: true,
        tab: '2'
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
        if (!res) res = this.state.searchParams;
        const params = { ...res };
        params._id = _.uniqueId('sq_');
        this.setState({ searchParams: params });
    }
    viewOrder(row) {
        const dialog = Dialog({
            content: <ViewTaskDialog row={row} close={v => { dialog.close(true) }}/>,
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
    delete = (row) => {
        Confirm({
            handleOk: () => {
                deleteData('DeleteTask?taskNoId=' + row.TaskBillId).then(res => {
                    if (res.status) {
                        this.onSearch(this.state.searchParams);
                    }
                })
            },
            message: "确定要删除吗？"
        })
        
    }
    canDelete = (row)=>{
        if (row.AssigningObject == 1 && row.OutWorkerStatus == 3) {
            return true;
        }
        if (row.AssigningObject == 2 && row.AccountantStatus == 3) {
            return true;
        }
        if (row.AssigningObject == 3 && row.OutWorkerStatus == 3 && row.AccountantStatus == 3) {
            return true;
        }   
        return false;
    }
    render() {
        const columns = [{
            title: '任务单号',
            dataIndex: 'TaskBillNo',
            width: 180,
            render: (val, record) => {
                // record.OutWorkerStatus == 3 && record.AccountantStatus == 3
                return (<div style={{ position: "relative" }}>
                    <RIf if={this.canDelete(record)} key={val + '_1'}><Icon type="close-circle" className="list-close-icon" onClick={e => { this.delete(record) }} /></RIf>
                    <RIf if={record.ContractNature} key={val + '_2'}><span className="newFlag" style={{ left: '16px', top: 0, right: 'auto' }}>{record.ContractNature}</span></RIf>
                    <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val || '（空）'}</a>
                </div>);
            }
        }, {
            title: '甲方',
            dataIndex: 'CompanyName',
            render: (val,record) => {
                let part;
                if(record.PartTax>0){
                part = record.PartTax === 1? '国税': '地税'
                }
                return <div>
                    <a href="javascript:;" onClick={e => { this.viewOrder(record)}}>{val}</a>
                    <RIf if={part}><span className="taxFlag">{part}</span></RIf>
                </div>
            }
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        },  {
            title: '任务状态',
            dataIndex: 'ServiceStatus',
            render: fServiceStatus
        }, {
            title: '分配对象',
            dataIndex: 'AssigningObject',
            render: fAssigningObject
        }, {
            title: '外勤审核状态',
            dataIndex: 'OutWorkerStatus',
            render: fCheckStatus
        }, {
            title: '会计审核状态',
            dataIndex: 'AccountantStatus',
            render: fAccountantStatus
        }];
        const searchItems = _.filter(search.items, t => (t.tab.indexOf('2') > -1));
        return (
            <div>
                <SearchForm items={searchItems} buttons={search.buttons} onSearch={this.onSearch} />
                <OrderTable SearchParams={this.state.searchParams} searchUrl="AllTaskList" columns={columns} />
            </div>
        );
    }
}

export default Main
