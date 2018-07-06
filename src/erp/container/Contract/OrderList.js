import React, { Component } from 'react'
import { getListData, postData, putData } from '@/erp/api'
import { Table, Button, message, Select, Input} from 'antd'
import Dialog from '@/erp/container/Dialog'
import { fDate, fTaxStatus } from '@/erp/config/filters'


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 15,
                pageSizeOptions: ['20','50','80','100','200'],
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal(total) {
                  return `共计 @/erp{total} 条`;
                }
            },
            loading: false,
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.openDialog = this.openDialog.bind(this)
    }

    handleTableChange (pagination){
        this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
    }
    onSearch(vals={}) {
        this.setState({searchParams: vals, loading: true});
        const pagination =this.state.pagination;
        vals.limit = pagination.pageSize;
        vals.offset = (pagination.current - 1) * pagination.pageSize;
        return getListData('signcustomerlist', vals).then(res => {
            if(res.status){
                const pagination = { ...this.state.pagination };
                pagination.total = res.data.total;
                this.setState({
                    loading: false,
                    data: res.data.list,
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
    openDialog(customer,title,width){
        
    }
    componentWillMount() {
        this.onSearch();
    }
    render() {
        
        const columns = [{
            title: '订单号',
            dataIndex: 'ContractNo',
            width: 150
        }, {
            title: '订单总金额',
            dataIndex: 'CompanyName'
        }, {
            title: '记账报税费用',
            dataIndex: 'AreaName',
        }, {
            title: '会计服务费用',
            dataIndex: 'Mobile',
        }, {
            title: '外勤服务费',
            dataIndex: 'SalesName'
        }, {
            title: '代收费用',
            dataIndex: 'AccountantName'
        }, {
            title: '签订日期',
            dataIndex: 'AgentStatus',
            render: val=> fTaxStatus(val)
        }, {
            title: '备注信息',
            dataIndex: 'ServiceEnd',
            render: val=> fDate(val)
        }, {
            title: '操作',
            render: (text, record) => (
                <Button size="small" onClick={e=>{this.mark(record)}}>查看</Button>
            ),
        }];
        const rowSelection = {
            onChange: vals =>{
              this.setState({selected: vals})
            }
        }
        // search.buttons=[
        // <HasPower power="NEW" key="btn_addNew"><Button type="primary" onClick={this.addNew} style={{margin:'0 8px'}}>新增客户</Button></HasPower>,
        // <HasPower power="IMPORT" key="btn_IMPORT"><ImportData onChange={this.onUpload} style={{margin:'0 8px'}}/></HasPower>]
        
        return (
            <div>
                <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/> 
                <Table columns={columns} 
                    rowKey={record => record.Id}
                    dataSource={this.state.data} 
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="middle"
                    bordered={true}
                    rowSelection = {rowSelection}
                />
                <Button  type="primary" onClick={this.toOthers}>批量换销售</Button>
            </div>
        );
    }
}

export default Main