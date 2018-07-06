import React from 'react'
import { Button, Row, Col, Icon } from 'antd'
import Title from '@/erp/component/Title';
import AreaSelect from '@/erp/container/searchComponent/AreaSelect';
import ImageViewer from '@/erp/component/ImageViewer'
import { fDate, fAddedValue, fInfoSource } from '@/erp/config/filters'
class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data;
    return (
      <div>
        <Title title= '客户基本信息'/>
        <Row className="company-info">
          <Col span={8}>
            <label>信息来源</label>{fInfoSource(data.InfoSource)}
          </Col>
          <Col span={8}>
             <label>公司名称</label>{data.CompanyName}
          </Col>
          <Col span={8}>
            <label>联系人:</label>{data.Connector}
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={8}>
            <label>联系电话:</label>{data.Mobile}
          </Col>
          <Col span={8}>
            <label>座机:</label>{data.Telephone}
          </Col>
          <Col span={8}>
             <label>当前负责销售:</label>{data.SalesName}
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={8}>
            <label>纳税人类别:</label>{fAddedValue(data.AddedValue)}
          </Col>
          <Col span={8}>
            <label>所属区域:</label><AreaSelect value={data.AreaCode} disabled={true}/>
          </Col>
          <Col span={8}>
             <label>公司地址:</label>{data.Address}
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={8}>
             <label>统一社会信用代码:</label>{data.RegNO}
          </Col>
          <Col span={8}>
            <label>企业注册号:</label>{data.RegCode}
          </Col>
          <Col span={8}>
            <label>营业执照:</label> {data.BusinessLicense?<ImageViewer src={data.BusinessLicense} additional="?x-oss-process=image/resize,m_lfit,h_30,w_50" />: null}
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={8}>
            <label>注册资金:</label>{data.RegisteredCapital}
          </Col>
          <Col span={8}>
            <label>法人:</label>{data.LegalPerson}
          </Col>
          <Col span={8}>
             <label>营业期限:</label> {fDate(data.RegisterDate)}至{data.NoDeadLine?'无期限':fDate(data.BusnissDeadline)}
          </Col>
        </Row>
        <Row className="company-info" style={{height: 'auto'}}>
          <Col span={24} style={{display:'flex'}}>
             <label>经营范围:</label><div style={{maxHeight:'80px',overflow:'auto',flex:1}}> {data.BusinessScope}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Main
