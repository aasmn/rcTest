import React, { Component } from 'react'
import { Table, Button, Row, Col } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import {
    fOrderStatus,
    fDate,
    fOrderSource,
    fServiceStatus,
    fContractStatus,
    fAssigningObject,
    fAccountantStatus,
    fCheckStatus
} from '@/erp/config/filters'
import Dialog from '@/erp/container/Dialog'
import OrderDialog from '@/erp/container/Contract/OrderDialog'


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                OrderItems: [],
                Amount: 0,
                ServiceMonths: 0,
                AgentStatus: 0
            },
            loading: false,
        };
    }
    view(row) {
        const dialog = Dialog({
            content: <OrderDialog id={row.OrderId} readOnly={true}/>,
            width: 1100,
            confirmLoading: false,
            footer: null,
            title: '查看订单'
        })
        dialog.result.then((res)=>{
        },()=>{});
    }
    render() {
        const columns = [{
            title: '合同编号',
            dataIndex: 'ContractNo',
            width: 150
        }, {
            title: '项目',
            dataIndex: 'MainItemName'
        }, {
            title: '子项目',
            dataIndex: 'ChildItemName'
        }, {
            title: '费用',
            dataIndex: 'Amount'
        }, {
            title: '服务期限',
            dataIndex: 'OrderMonths',
            render: (val, row) => {
                return (+row.OrderMonths) + row.GiftMonths;
            }
        }, {
            title: '服务开始时间',
            dataIndex: 'ServiceStart',
            render: fDate
        }, {
            title: '合同状态',
            dataIndex: 'Status',
            render: fContractStatus
        }, {
            title: '服务状态',
            dataIndex: 'ServiceStatus',
            render: fServiceStatus
        }, {
            title: '任务单号',
            dataIndex: 'TaskBillNo',
        },{
            title: '分配对象',
            dataIndex: 'AssigningObject',
            render: fAssigningObject
        }, {
            title: '外勤状态',
            dataIndex: 'OutWorkerStatus',
            render: fCheckStatus
        }, {
            title: '会计状态',
            dataIndex: 'AccountantStatus',
            render: fAccountantStatus
        }];
        const data = _.extend({},this.state.data,this.props.data);
        return (
            <div className="order-row">
                <Row className="company-info">
                    <Col style={{ fontSize: '12px' }}>
                        <label>订单号:</label>{data.OrderNo}
                        <label>订单总额:</label>{data.Amount}
                        <label>签单销售:</label>{data.SalesName}
                        <label>签单日期:</label>{fDate(data.ContractDate)}
                        <label>创建时间:</label>{fDate(data.CreateDate)}
                        <label>来源:</label>{fOrderSource(data.OrderSourceId)}
                        <label> 订单状态: </label>{fOrderStatus(data.OrderStatus, data.OrderSourceId)}
                        <a herf="javascript:;" style={{float:"right",marginRight:'12px'}} onClick={e=>this.view(data)}>查看详情</a>
                    </Col>
                </Row>
                <Table columns={columns}
                    rowKey={record => record.OrderId}
                    dataSource={data.OrderItems}
                    pagination={false}
                    size="middle"
                    bordered={true}
                />
            </div>
        )
    }
}

export default Main
