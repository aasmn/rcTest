import React from 'react'
import { Spin } from 'antd'
import { getListData } from '@/erp/api'
import _ from 'lodash'
// import * as ContractActions from '@/erp/config/contractActions'
// import Dialog from '@/erp/container/Dialog'
// import Title from '@/erp/component/Title'
// import store from '@/erp/store'

import ContractInfo from '@/erp/component/ContractList'
import PayInfo from '@/erp/container/Contract/PayInfo'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            readOnly: props.readOnly
        }

        this.getOrderDetail = this.getOrderDetail.bind(this);
        if (props.id) {
            this.getOrderDetail(props.id);
        } else {
            this.state.data = {};
        }
    }
    getOrderDetail(id) {
        getListData('orders/' + id).then(res => {
            if (res.status) {
                this.setState({ data: res.data });
            }
        })
    }
    render() {
        if (!this.state.data) return <Spin />;
        const data= this.state.data;
        return (
            <div style={this.props.style} className="order-dialog">
                <div className="smart-title">
                    <span><label>订单号:</label>{data.OrderNo}</span>
                    <span><label>甲方:</label>{data.CompanyName}</span>
                    <span><label>联系人:</label>{data.Connector}</span>
                    <span><label>联系电话:</label>{data.Mobile}</span>
                    <span><label>签单销售:</label>{data.OrderSalesName}</span>
                </div>
                <ContractInfo ref={e => { this.ContractInfo = e }} currentId={this.props.contractId} data={this.state.data} readOnly={true} />
                <PayInfo ref={e => { this.PayInfo = e }} data={this.state.data} readOnly={true} />
            </div>
        );
    }
}

export default Main
