import React from 'react'
import { Spin, message, Button } from 'antd'
import { getListData, postData, putData, getMockerData } from '@/erp/api'
import _ from 'lodash'
import * as ContractActions from '@/erp/config/contractActions'
import Dialog from '@/erp/container/Dialog'
import Title from '@/erp/component/Title'
import store from '@/erp/store'

import CustomerBaseInfo from '@/erp/container/Contract/CustomerBaseInfo'
import ContractDiscontinueList from '@/erp/component/ContractDiscontinueList'
import PayInfo from '@/erp/container/Contract/PayInfo'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            readOnly: false,
            loading: false
        }

        this.getOrderDetail = this.getOrderDetail.bind(this);
        this.getOrderDetail(props.data);
    }
    getOrderDetail(data) {
        if (data.Id) {
            getListData('workorder/stopcontract/detail?billSuspensionId=' + data.Id).then(res => {
                if (res.status) {
                    _.each(res.data.CrmOrderItems, item => {
                        item.checked = true;
                    });
                    const readOnly = !!(data.Id)
                    this.setState({ data: res.data, readOnly: readOnly });
                }
            })

        } else {
            getListData('order/getcontractbycustomer?customerId=' + data.CustomerId).then(res => {
                if (res.status) {
                    this.setState({ data: res.data });
                }
            })
        }

    }
    onSave = (data, type) => {
        this.setState({ loading: true });
        putData('order/cancelcontract?tab=' + type, data).then((res) => {
            if (res.status) {
                this.close()
            }
            this.setState({ loading: false })
        });
    }
    close = () => {
        this.props.close(true);
    }
    onEdit = () => {
        this.state({ readOnly: false });
    }
    onPass = () => {
        if (!this.ContractInfo.state.RefundItem.RefundTime) {
            message.error('请填写打款时间！');
            return;
        }
        postData('MoneyOrder/Remit',{
            moneyBillCode: this.props.data.MoneyBillCode,
            category: 1,
            refundTime: this.ContractInfo.state.RefundItem.RefundTime
        }).then(res => {
            if (res.status) {
                message.info('操作成功！');
                this.close()
            }
        })
    }
    onReject = () => {
        putData('workorder/stopcontract/reject?billSuspensionId=' + this.props.data.Id).then(res => {
            if (res.status) {
                this.close()
            }
        })
    }
    render() {
        if (!this.state.data) return <Spin />;
        return (
            <div style={this.props.style} className="order-dialog">
                {this.props.data && this.props.data.MoneyStatus == 1 && (<Button.Group style={{ textAlign: 'right', display: 'block' }}>
                    <Button type="primary" onClick={this.onPass.bind(this)}>财务打款</Button>
                </Button.Group>)}
                <ContractDiscontinueList loading={this.state.loading} readOnly={this.state.readOnly} pbReadOlny={this.props.data.MoneyStatus ==1} onSave={(data, type) => { this.onSave(data, type) }} ref={e => { this.ContractInfo = e }} payback={true} currentId={this.props.contractId} data={this.state.data} />
            </div>
        );
    }
}

export default Main
