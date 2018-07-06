import React from 'react'
import { Button, Row, Col } from 'antd'
import { fDate, fAgentStatus } from '@/erp/config/filters'
const fIsassign = function (status) {
  var str = ''
  switch (+status) {
    case 0:
      str = '未分配'
      break;
    case 1:
      str = '已分配'
      break;
  }
  return str
}
const fRecall = function (status) {
  var str = ''
  switch (+status) {
    case 1:
      str = '否'
      break;
    case 0:
      str = '是'
      break;
  }
  return str
}
class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data || {};
    const agentData = data.CustomerStatusInAgent || {};
    return (
      <Row className="company-info">
        <Col span={24}>
          <label>序列ID:</label>{data.SequenceNo}
          <label>开始账期:</label>{fDate(agentData.BusinessDate)}
          <label>主办会计:</label>{agentData.AccountantName}
          <label>是否分配:</label>{fIsassign(agentData.isassign)}
          <label>记账状态:</label>{fAgentStatus(agentData.Status)}
          <label>是否建账:</label>{fRecall(agentData.recall)}
        </Col>
      </Row>
    );
  }
  /* <HasPower power="MARK" key={"btn_Mark"}><Button type="primary" onClick={e => { this.props.onAction('mark', data) }}>{data.RemarkSignId ? '取消标记' : '标记'}</Button></HasPower>
  <HasPower power="GUAQI" key={"btn_GUAQI"}><Button type="primary" disabled={data.AgentStatus == 2 ? true : !data.IfCancelHangup} onClick={e => { this.props.onAction('hangUp', data) }}>挂起</Button></HasPower>
  <HasPower power="BGQYXX" key={"btn_BGQYXX"}><Button type="primary" onClick={e => { this.props.onAction('editCompany', data) }}>{data.isEditing ? '提交并保存' : '变更企业信息'}</Button></HasPower>
  <HasPower power="BGQYXX" key={"btn_BGQYXX1"}><Button type="primary" disabled={data.AgentStatus == 2 || data.FreChangeOrderId} onClick={e => { this.props.onAction('changeAddedValue') }}>变更企业性质</Button></HasPower> */
}
export default Main
