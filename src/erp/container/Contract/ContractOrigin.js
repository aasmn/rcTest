import React from 'react'
import Title from '@/erp/component/Title'
import _ from 'lodash'
import moment from 'moment'
import { Input, message, DatePicker } from 'antd'
import {fDate, fMonth} from '@/erp/config/filters'

function calcServiceMonth(orderItems, v){
    let serviceMonth = 0;
    if (v) {
        if (!fDate(orderItems.ServiceStart)) {
            serviceMonth = 0;
        } else if (v < moment(orderItems.ServiceStart)) {
            serviceMonth = 0;
        } else {
            serviceMonth = v.diff(moment(orderItems.ServiceStart), 'month')
        }
    }
    return serviceMonth
}

class Accounting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            serviceMonth: calcServiceMonth(_.find(props.data.CrmOrderItems, { MainItemId: 1 }), props.data.ChangeDate ? moment(props.data.ChangeDate) : null),
            orderItems: _.find(props.data.CrmOrderItems, { MainItemId: 1})
        }
        this.setFieldValue = this.setFieldValue.bind(this);
        this.getFieldValue = this.getFieldValue.bind(this);
        this.validateField = this.validateField.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
    }
    changeMonth(v){
        const orderItems = this.state.orderItems;
        const smonth = calcServiceMonth(orderItems, v);
        this.setState({ serviceMonth: smonth})
        this.props.onChange(v && v.format('YYYY-MM-01'), smonth)
    }

    setFieldValue(obj) {
        let data = _.cloneDeep(this.state.data);
        data = _.extend(data, obj);
        if (obj.ServiceStart) {
            const m = parseInt(data.OrderMonths || 0) + parseInt(data.GiftMonths || 0)
            if (!m) {
                message.error("请先设置服务期限");
                return;
            }
            data.ServiceEnd = moment(obj.ServiceStart).add(m - 1, 'months').endOf('month').format('YYYY-MM-DD');
        }
        this.setState({ data }, () => {
            if ('Amount' in obj) {
                this.props.onAmountChange();
            }
        });
    }
    validateField() {
        const data = this.state.data;
        if (!data.ContractNo) return '请填写合同编号';
        if (_.find(data.items, item => !item.ChildItemId)) return '请选择子项目';
        if (!data.OrderMonths) return '请填写服务期限';
        if (!data.Amount) return '请填写费用金额';
        return null
    }
    getFieldValue() {
        return this.state.data;
    }
    render() {
        const data = this.state.data;
        const orderItems = this.state.orderItems;
        const changeDate = fDate(data.ChangeDate)? moment(fDate(data.ChangeDate)) : null
        return (
            <div>
                <Title title="原合同信息"/>
                <div className="padding list-span">
                    <span>订单号：{data.OrderNo}</span>
                    <span>服务期限：{orderItems.OrderMonths}  {orderItems.GiftMonths ? (' + ' + orderItems.GiftMonths):''} 月</span>
                    <span>签订日期：{fDate(data.ContractDate)}</span>
                    <span>服务起止时间：{fMonth(orderItems.ServiceStart)} {orderItems.ServiceEnd ? (' 至 ' + fMonth(orderItems.ServiceEnd)) : ''}</span>
                    <span className="ant-form-item-required">变更日期：<DatePicker.MonthPicker disabled={this.props.readOnly} format="YYYY-MM" defaultValue={changeDate} onChange={e=>{this.changeMonth(e)}}/></span>
                    <span>已服务期限：{this.state.serviceMonth}</span>
                </div>
                <table className="erp-table ant-table-bordered">
                    <thead className="ant-table-thead">
                        <tr>
                            <th style={{ width: '200px' }}><span>合同编号</span></th>
                            <th style={{ width: '150px' }}><span>项目</span></th>
                            <th style={{ width: '200px' }}><span>子项目</span></th>
                            <th style={{ width: '100px' }}><span>费用</span></th>
                            <th><span>备注</span></th>
                        </tr>
                    </thead>
                    <tbody className="ant-table-tbody" key="group1">
                        <tr className="ant-table-row">
                            <td>{orderItems.ContractNo}</td>
                            <td>记账报税</td>
                            <td>{orderItems.ChildItemId === 1 ? "小规模" : "一般纳税人"}</td>
                            <td>{orderItems.Amount}</td>
                            <td>{orderItems.Remark}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );

    }
}
export default Accounting;