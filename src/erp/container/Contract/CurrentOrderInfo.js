import React from 'react'
import { Button, Row, Col, Icon } from 'antd'
import Title from '@/erp/component/Title';
import ContractForm from '@/erp/container/Contract/ContractForm'

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data;
    return (
      <div>
        <Title title= '当前合同信息'/>
        <Row className="company-info">
          <Col span={6}>
             <label>订单号</label>{data.OrderNo}
          </Col>
          <Col span={6}>
            <label>签订日期:</label>{data.ContractDate && data.ContractDate.substr(0,10)}
          </Col>
          <Col span={6}>
            <label>订单金额:</label>{data.Amount}
          </Col>
          <Col span={6}>
            <label>签单销售:</label>{data.OrderSalesName}
          </Col>
        </Row>
        <ContractForm hideTitle={true} readOnly={true} data={data} showAction={this.props.showAction}/>
      </div>
    );
  }
}

export default Main
