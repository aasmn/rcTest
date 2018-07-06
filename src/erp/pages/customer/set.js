import React, {Component} from 'react'
import {Button, Row, Col, Input, Spin, Switch, message} from 'antd'
import {getListData, putData} from '@/erp/api'
import Immutable from 'immutable';

class SetContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      dateSource: null,
      checked: false
    };
    this.initData = this.initData.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);
  }

  initData() {
    this.setState({loading: true})
    return getListData('cuscategory').then(res => {
      if (res.status) {
        this.setState({
          data: Immutable.fromJS(res.data.sort((a, b) => (parseInt(a.Name) - parseInt(b.Name)))),
          dateSource: Immutable.fromJS(res.data),
          checked: res.cuscategoryCapacitySwitch
        });
      }
      return res;
    })
  }

  setFieldValue(index, field, value) {
    const {data} = this.state;
    const item = data.get(index).set(field, value);
    this.setState({
      data: data.set(index, item)
    });

  }

  componentWillMount() {
    this.initData();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }

  switchOnChange(checked) {
    this.setState({checked: checked})
    console.log(`switch to @/erp{checked}`);
    putData(`cuscategoryCapacitySwitch/@/erp{checked}`)
      .then(res => {
        if (res.status) {
          message.success('操作成功', 1)
        }
      })
  }

  handleSave() {
    putData(`cuscategory`, this.state.data.toJS())
      .then(res => {
        if (res.status) {
          message.success('保存成功', 1)
        }
      })
  }

  render() {
    if (!this.state.data) return <Spin/>
    return (
      <div className="gutter-example">
        <div className='wrap-switch'>
          <Switch className='switch' checked={this.state.checked} onChange={this.switchOnChange.bind(this)}/>
          <div className='description'>
            <p>启用/禁用</p>
            <p>库容库清设置</p>
            <p>如果开启，启用库容设置</p>
            <p>如果关闭，禁用库容设置</p>
          </div>
        </div>
        <Row gutter={{md: 24}}>
          <Col className="gutter-row" span={5}>意向度</Col>
          <Col className="gutter-row" span={5}>库容(/个)</Col>
          <Col className="gutter-row" span={5}>跟进期限(/天)</Col>
          <Col className="gutter-row" span={5}>最大保护期(/天)</Col>
        </Row>
        {this.state.data.map((item, index) => {
          return (
            <Row gutter={{md: 24}} key={item.get('CustomerCategoryId')} style={{margin: '12px 0'}}>
              <Col className="gutter-row" span={5}>{item.get('Name')}</Col>
              <Col className="gutter-row" span={5}>
                <Input type='number' value={item.get('Repertory')}
                       onChange={e => {
                         this.setFieldValue(index, 'Repertory', e.target.value)
                       }}/>
              </Col>
              <Col className="gutter-row" span={5}>
                <Input type='number' value={item.get('NoTrackDate')}
                       onChange={e => {
                         this.setFieldValue(index, 'NoTrackDate', e.target.value)
                       }}/>
              </Col>
              <Col className="gutter-row" span={5}>
                <Input type='number' value={item.get('LongestData')}
                       onChange={e => {
                         this.setFieldValue(index, 'LongestData', e.target.value)
                       }}/>
              </Col>
            </Row>
          )
        })}
        <br/>
        <br/>
        <Button style={{display: 'block', margin: '0 auto'}} type='primary'
                onClick={this.handleSave.bind(this)}>提交保存</Button>
        <div className='explain'>
          <div className='label'>库容库清算法：</div>
          <div className='content'>如果是刚刚导入的，意向度默认设置为0%，按照创建时间算跟进期限和最大保护期<br/>
            如果是已经跟进的，按照最后一次跟进时间算；<br/>
            掉入公海后，重新算最大保护期；<br/>
            掉入公海后和抢到后，意向度不会调整
          </div>
        </div>
      </div>
    )
  }
}

export default SetContent
