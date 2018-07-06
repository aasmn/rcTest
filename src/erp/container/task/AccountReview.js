import React, { Component } from 'react'
import { Button, Row, Col, message, Form, Modal, DatePicker, Input, Spin } from 'antd'
import HasPower from '@/erp/container/HasPower'
import { fServiceStatus, fAccountantStatus, fCheckStatus, fDate } from '@/erp/config/filters'
import Confirm from '@/erp/component/Confirm'
import { putData, postData } from '@/erp/api'
import SetServiceMonth from '@/erp/container/Contract/SetServiceMonth'
import store from '@/erp/store'
import Dialog from '@/erp/container/Dialog'
import _ from 'lodash'
import { getListData } from '@/erp/api'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initRow: null,
            visible: false,
            setFirstMonth: ''
        }
        this.AccountCheck = this.AccountCheck.bind(this);
        this.AccountCheckSecond = this.AccountCheckSecond.bind(this);
        this.initData = this.initData.bind(this);
        this.onReject = this.onReject.bind(this);
        this.initData()
    }
    initData(){
        getListData("order/getorder/taskid?taskId="+this.props.id).then(res=>{
            if(res.data){
                res.data.AccountantTaskSource = res.data.AssigningObject == 1? "外勤": "会计"; 
                res.data.CrmOrderItems = res.data.OrderItem;
                res.data.TaskBillId = this.props.id;
                var setFirstMonth = _.find(res.data.OrderItem, {
                    "MainItemId": 1
                })
                if (setFirstMonth){
                    res.data.CustomerId = res.data.OrderItem[0].CustomerId;
                    // res.data.PartTax = setFirstMonth[0].PartTax;
                }
                this.setState({ initRow: res.data }, () => {
                    

                    this.setState({ setFirstMonth: setFirstMonth })
                    if (setFirstMonth && (!fDate(setFirstMonth.ServiceStart))) {
                        this.setState({ isSetFirstMonth: true })
                    } else {
                        this.setState({ isSetFirstMonth: false })
                    }
                })
            }
        })
    }
    AccountCheck = () => {
        const dialog = Dialog({
            content: <SetServiceMonth data={this.state.initRow} wrappedComponentRef={v => { if (v) v.handler = dialog; }} />,
            width: 500,
            confirmLoading: false,
            footer: null,
            title: '设置首报月'
        })
        dialog.result.then(() => {
            this.props.close && this.props.close();
        }, () => { });
    }

    closeAll() {

    }
    AccountCheckSecond() {
        let setFirstMonth = this.state.setFirstMonth;
        if (!setFirstMonth) setFirstMonth = {};
        const info = this.state.initRow
        var AccountantTaskSource = info.AccountantTaskSource,
            PartTax = info.PartTax||0,
            ServiceStatus = info.ServiceStatus,
            ServiceStart = setFirstMonth.ServiceStart ? setFirstMonth.ServiceStart : '',
            ServiceEnd = setFirstMonth.ServiceEnd ? setFirstMonth.ServiceEnd : '';
        putData('order/audit/pass/' + info.TaskBillId + '?accountantTaskSource=' + AccountantTaskSource + '&partTax=' + PartTax + '&serviceStatus=' + ServiceStatus + '&serviceStartDate=' + ServiceStart + '&serviceEndDate=' + ServiceEnd).then(res => {
            if (res.status) {
                message.info('审核成功！');
                this.props.close && this.props.close();
            }
        })
    }
    onReject() {
        const TaskBillId = this.state.initRow.TaskBillId
        let remark;
        const dialog = Dialog({
            content: (<div><label>驳回原因</label><Input.TextArea onChange={e => { remark = e.target.value }} /></div>),
            handleOk: () => {
                return save(remark|| '');
            },
            width: 450,
            confirmLoading: false,
            title: "确认驳回"
        })
        const that = this;
        function save(remark) {
            const state = store.getState();
            if (remark && !(/(\{.*\})$/.test(_.trim(remark)))) {
                remark = remark + '{' + state.common.user.RealName + '}';
            }
            return putData('order/audit/reject/' + TaskBillId, { remark: remark }).then(res => {
                if (res.status) {
                    // 关闭上一个弹窗并且刷新列表
                    message.info('驳回成功！');
                    that.props.close && that.props.close();
                }
            })
        }
    }
    render() {
        if(!this.state.initRow) return <Spin/>
        const data = this.state.initRow;
        // console.log(data.ServiceStart, data.AccountantStatus, 'render')
        console.log(data.AccountantStatus !== 1)
        console.log(data.AccountantStatus !== 3)
        return (
            <div style={{ float: 'right' }}>
                <Button.Group>
                    {(this.state.isSetFirstMonth) && <HasPower power="REVIEW" key={"btn_REVIEW"}>
                        <Button type="primary" onClick={this.AccountCheck} disabled={data.AccountantStatus > 1 || data.ServiceStatus === 8}>会计审核</Button>
                    </HasPower>}
                    {(!this.state.isSetFirstMonth) && <HasPower power="REVIEW" key={"btn_REVIEW"}>
                        <Button type="primary" onClick={this.AccountCheckSecond} disabled={data.AccountantStatus > 1 || data.ServiceStatus === 8}>会计审核</Button>
                    </HasPower>}
                    <HasPower power="REJECT" key={"btn_REJECT"}>
                        <Button type="primary" onClick={this.onReject} disabled={data.AccountantStatus > 1 || data.ServiceStatus === 8 }>会计驳回</Button>
                    </HasPower>
                </Button.Group>
            </div>
        )
    }
}

export default Main
