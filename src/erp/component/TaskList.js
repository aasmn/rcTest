import React, { Component } from 'react'
import { Table, Spin, Button, DatePicker, message } from 'antd'
import { fDate, fContractStatus } from '@/erp/config/filters'
import _ from 'lodash'
import Dialog from '@/erp/container/Dialog'
import { postData } from '@/erp/api'

class OrderTable extends Component {
    constructor(props) {
        super(props);
        let selectedRowKeys;
        if (props.selectAll){
            selectedRowKeys = _.map(props.data, t=> t.Id);
        }
        this.state = {
            selectedRowKeys: selectedRowKeys,
        };
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys },()=>{
            this.props.onChange && this.props.onChange()
        });
        
    }
    onContractEnd = (item) => {
        let stopTime;
        const dialog = Dialog({
            content: (<div><label>结束日期</label><DatePicker onChange={e => { stopTime = e }} /></div>),
            handleOk: () => {
                if (!stopTime) {
                    message.error("请选择结束时间!")
                    return false;
                }
                return endContract(stopTime)
            },
            width: 450,
            confirmLoading: false,
            title: "确认结束"
        })
        const that = this;
        function endContract(stopTime) {
            return postData('order/endcontractlist', {
                ContractIds: [item.Id],
                StopTime: stopTime
            }).then(res => {
                if (res.status) {
                    item.OrderStatus = 2;
                    that.forceUpdate();
                }
            })
        }
    }
    expandedRowRender = (record)=>{
        if (record.MainItemName !== '记账报税' || !('OrderMonths' in record)){
            return null
        }
        return <div style={{ background: '#f8d795', padding: '3px 12px' }}>
            <span>服务期限:{record.OrderMonths}  {record.GiftMonths ? ('+' + record.GiftMonths) : ''}</span> <span style={{ marginLeft: '24px' }}>服务开始时间:{fDate(record.ServiceStart)}</span><span style={{ marginLeft: '24px' }}>服务结束时间:{fDate(record.ServiceEnd)}</span>
        </div>
    }
    render() {
        if(!this.props.data) return <Spin/>;
        const { selectedRowKeys } = this.state;
        const rowSelection = this.props.readOnly? null: {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelection: this.onSelection,
        };
        const columns = [{
            title: '合同编号',
            dataIndex: 'ContractNo',
            render: (val,record)=>{
                if(record.MainItemName === '记账报税'){
                    return <span className='contract-blue'>{val}</span>;
                }else{
                    return <span className='contract-green'>{val}</span>;
                }
            }
        }, {
            title: '项目',
            dataIndex: 'MainItemName',
        }, {
            title: '子项目',
            dataIndex: 'ChildItemName',
        }, {
            title: '费用',
            dataIndex: 'Amount',
        }, {
            title: '签单销售',
            dataIndex: 'OrderSalesName',
        }, {
            title: '签订日期',
            dataIndex: 'ContractDate',
            render: fDate
        }];
        
        if (this.props.showStatus){
            columns.push({
                title: '状态',
                dataIndex: 'OrderStatus',
                render: fContractStatus
            })
        }else{
            columns.push({
                title: '备注',
                dataIndex: 'Remark',
            })
        }
        if (this.props.endable) {
            columns.push({
                title: '操作',
                render: (val, record) => {
                    if (record.MainItemName === '财务服务费' && record.OrderStatus == 1)
                        return <Button onClick={e => { this.onContractEnd(record) }}>结束</Button>;
                    else
                        return null;
                }
            })
        }
        return (
            <Table 
                rowKey="Id"ya
                rowSelection={rowSelection} 
                columns={columns} 
                bordered={true}
                dataSource={this.props.data} 
                pagination= {false}
                expandedRowRender={this.expandedRowRender}
                defaultExpandAllRows={true}
                expandRowByClick={true}
                className= "tasklist-table"
            />
        );
    }
}

export default OrderTable
