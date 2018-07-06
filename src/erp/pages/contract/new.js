import React, { Component } from 'react'
import { Tabs, message, Row, Col, Input, Button } from 'antd'
import OrderDialog from '@/erp/container/Contract/OrderDialog'
import { getListData } from '@/erp/api'
const TabPane = Tabs.TabPane;
class Replenish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CompanyName: '',
            idStr: ''
        };
        this.next = this.next.bind(this)
    }
    getCompanyName = () => {
        const id = this.state.idStr
        this.setState({
            loading: true
        });
        if (!id) return;
        getListData('order/GetCompanyName/' + id).then(res => {
            if (res.status && res.data) {
                this.setState({
                    CompanyName: res.data,
                    agentId: id,
                    loading: false
                });
            } else {
                // message.error("查不到公司");
                this.setState({
                    agentId: '',
                    loading: false
                })
            }
        })
    }
    next() {
        if (!this.state.agentId) {
            message.info("请输入Agent公司ID");
            return;
        }
        this.props.next(this.state.agentId);
    }
    render() {
        const after = <Button onClick={this.getCompanyName} type="primary" >查询</Button>
        return (
            <div style={{ width: '400px',margin:'auto' }} className="replenish">
                <Row>
                    <Col span="6"><label className="ant-form-item-label">Agent公司ID</label></Col>
                    <Col span="16" className="ant-form-item-control">
                        <Input value={this.state.idStr} onChange={e => { this.setState({ idStr: e.target.value }) }} onPressEnter={e => { this.getCompanyName(e.target.value) }} addonAfter={after} />
                    </Col>
                </Row>
                <Row>
                    <Col span="6"><label className="ant-form-item-label">Agent公司名称</label></Col>
                    <Col span="16" className="ant-form-item-control"> <Input value={this.state.CompanyName} readOnly={true} /></Col>
                </Row>
                <Row>
                    <Col span="24" style={{ textAlign: 'center' }}><Button onClick={this.next} loading={this.state.loading} type="primary" disabled={!this.state.agentId}>下一步</Button></Col>
                </Row>
            </div>
        )
    }
}


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step:1
        };
    }
    nextStep = ()=>{
        this.setState({step: 2});
    }
    render() {
        return (
            <Tabs defaultActiveKey="New">
                <TabPane tab="新增订单" key="New">
                    <OrderDialog isPage={true}/>
                </TabPane>
                <TabPane tab="补单" key="Bu">
                    <Replenish next={this.nextStep} />
                    {this.state.step==2 && <OrderDialog isPage={true} />}
                </TabPane>
            </Tabs>
        );
    }
}

export default Main
