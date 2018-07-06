import React, { Component } from 'react'
import { Table, Button, Row, Col } from 'antd'
import { getListData, getMockerData } from '@/erp/api'
import moment from 'moment'
import _ from 'lodash'
import { fContractStatus, fServiceStatus, fTaxStatus, fDate } from '@/erp/config/filters'


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                OrderItems:[],
                Amount: 0,
                ServiceMonths: 0,
                AgentStatus:0
            },
            loading: false,
        };
        this.onSearch = this.onSearch.bind(this);
    }
    onSearch() {
        this.setState({ loading: true });
        getListData('orderItems/' + this.props.companyId).then(res => {
            if (res.status) {
                let data = _.extend({}, this.state.data, res.data);
                _.each(data.OrderItems,(item=>{
                    data.Amount += +item.Amount;
                    if (data.ServiceStart > fDate(item.ServiceStart) || !data.ServiceStart) data.ServiceStart = fDate(item.ServiceStart);
                    if (data.ServiceEnd < fDate(item.ServiceEnd) || !data.ServiceEnd) data.ServiceEnd = fDate(item.ServiceEnd);
                }));
                data.ServiceMonths = (moment(data.ServiceEnd).diff(moment(data.ServiceStart), 'months') + 1) || 0;
                this.setState({
                    data: data,
                    loading: false
                });
            }
        }, err => {
            this.setState({
                loading: false
            });
        })
    }

    componentWillMount() {
        this.onSearch();
    }
    render() {
        const columns = [{
            title: '合同编号',
            dataIndex: 'ContractNo',
            width: 150
        }, {
            title: '项目',
            dataIndex: 'ChildItemName'
        },  {
            title: '费用',
            dataIndex: 'Amount'
        }, {
            title: '服务期限',
            dataIndex: 'OrderMonths',
            render: (val,row)=>{
                return (+row.OrderMonths) + row.GiftMonths;
            }
        }, {
            title: '服务开始时间',
            dataIndex: 'ServiceStart',
            render: fDate
        }, {
            title: '结束日期',
            dataIndex: 'ServiceEnd',
            render: fDate
        }, {
            title: '合同状态',
            dataIndex: 'Status',
            render: fContractStatus
        }, {
            title: '服务状态',
            dataIndex: 'ServiceStatus',
            render: fServiceStatus
        }];
        const data = this.state.data;
        return (
            <div>
                <Row className="company-info">
                    <Col style={{fontSize:'12px'}}>
                        <label>记账报税总金额:</label>{data.Amount}
                        <label>记账合同:</label>{data.OrderItems.length}个
                        <label>服务期限:</label>{data.ServiceMonths}个月
                        <label>报税状态:</label>{fTaxStatus(data.AgentStatus)}
                        <label>开始服务日期:</label>{fDate(data.ServiceStart)}
                        <label>结束日期:</label>{fDate(data.ServiceEnd)}
                    </Col>
                </Row>
                <Table columns={columns}
                    rowKey={record => record.OrderId}
                    dataSource={this.state.data.OrderItems}
                    pagination={false}
                    loading={this.state.loading}
                    size="middle"
                    bordered={true}
                />
            </div>
        )
    }
}

export default Main
