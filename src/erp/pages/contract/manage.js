import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import ContractStatusSelect from '@/erp/container/searchComponent/ContractStatusSelect'
import { getListData } from '@/erp/api'
import { Table, Button } from 'antd'
import Dialog from '@/erp/container/Dialog'
import { fContractType, fOrderStatus, fDate, fFinancialAuditStatus} from '@/erp/config/filters'
import HasPower from '@/erp/container/HasPower'

let search = {
    items: [{
        label: '甲方/联系人',
        type: 'text',
        field: 'companyname'
    }, {
        label: '合同编号',
        type: 'text',
        field: 'contractNo'
    }, {
        label: '销售人员',
        type: 'text',
        field: 'SalesName',
        more: true
    }, {
        label: '订单状态',
        type: 'custom',
        field: 'contractStatus',
        view: ContractStatusSelect,
        defaultValue: '0',
        more: true
    }, {
        label: '合同类型',
        type: 'select',
        field: 'contractType',
        data:[{id:0,label:'请选择'},{id:1,label:'新增'},{id:2,label:'续费'}],
        defaultValue: '0',
        more: true
    }, {
        label: '财务状态选择',
        type: 'select',
        field: 'financeStatus',
        data:{ 
          0: "请选择",
          1: "待审核",
          2: "已审核",
          3: "已驳回"
        },
        defaultValue: '0',
        more: true
    }, {
        label: '合同签订日期',
        type: 'date',
        field: 'starttime',
        more: true
    }, {
        label: '至',
        type: 'date',
        field: 'endtime',
        more: true
    }],
    buttons:[]
};

class Manage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 15,
                showTotal(total) {
                  return `共计 @/erp{total} 条`;
                }
            },
            searchParams: {},
            loading: false,
        };
        
        this.onSearch = this.onSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
    }
    handleTableChange (pagination){
        this.setState({pagination: pagination})
        this.onSearch(this.state.searchParams,pagination);
    }
    onSearch(vals={"contractNo":"","companyname":"","contact":"","SalesName":"","contractStatus":"0","contractType":"0","financeStatus":"0","starttime":null,"endtime":null},pager) {

        this.setState({searchParams: vals, loading: true});
        const pagination = pager || this.state.pagination;
        vals.limit = pagination.pageSize;
        vals.offset = (pagination.current - 1) * pagination.pageSize;

        getListData('contract', vals).then(res => {
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
    openDialog(row){
        Dialog({
            content: (<div>test</div>),
            handleOk (){
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: '表头' 
        });
    }
    addNew(){
        Dialog({
            content: (<div>test</div>),
            handleOk (){
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: '合同新建' 
        });
    }
    componentDidMount() {
        this.onSearch();
    }
    render() {
        
        const columns = [{
            title: '合同编号',
            dataIndex: 'ContractNo',
        }, {
            title: '甲方',
            dataIndex: 'CompanyName',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '销售人员',
            dataIndex: 'SalesName',
        }, {
            title: '合同类型',
            dataIndex: 'OrderType',
            render: type=> fContractType(type)
        }, {
            title: '订单状态',
            dataIndex: 'OrderStatus',
            render: val=> fOrderStatus(val)
        }, {
            title: '合同签订日期',
            dataIndex: 'ContractDate',
            render: val=> fDate(val)
        }, {
            title: '合同总金额',
            dataIndex: 'Amount',
        }, {
            title: '财务审核',
            dataIndex: 'FinancialAuditStatus',
            render: val=> fFinancialAuditStatus(val)
        }, {
            title: '最后操作人',
            dataIndex: 'ModifyUserName',
        }, {
            title: '最后修改日期',
            dataIndex: 'ModifyDate',
            render: val=> fDate(val)
        }, {
            title: 'Action',
            render: (text, record) => (
                <HasPower power="TeT">
                  <a href="javascript:;" className="ant-dropdown-link" onClick={(e)=>this.openDialog(record)}>
                    More 
                  </a>
                </HasPower>
            ),
        }];

        search.buttons=[(<HasPower power="NEW" key="btn_addNew"><Button type="primary" onClick={this.addNew} >新建</Button></HasPower>)]
        
        return (
            <div>
                <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/> 
                <Table columns={columns} 
                    rowKey={record => record.OrderId}
                    dataSource={this.state.data} 
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="middle"
                    bordered={true}
                />
            </div>
        );
    }
}

export default Manage