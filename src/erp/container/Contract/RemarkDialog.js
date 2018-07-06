import React, { Component } from 'react'
import { fDate, fOperation, fMark } from '@/erp/config/filters'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }
  componentWillMount() {
    console.log(this.props.row, 'row')
  }
  render() {
    const props = this.props.row
    const labelStyle = {fontWeight: '600'}
    const MarginRight = {marginRight:' 5px'}
    return (
      <div>
        <div>
          <label style={labelStyle}>标签：</label>
          <span>{fMark(props.RemarkSignId)}</span>
        </div>
        <div>
          <textarea defaultValue={props.Content} disabled style={{width: '400px', height: '100px'}}></textarea>
        </div>
        <div>
          <label style={labelStyle}>动作：</label>
          <span style={MarginRight}>{fOperation(props.Operation)}</span>
          <label style={labelStyle}>操作人：</label>
          <span style={MarginRight}>{props.RealName}</span>
          <label style={labelStyle}>操作时间：</label>
          <span>{fDate(props.OperationTime)}</span>
        </div>
      </div>
    )
  }
}

export default Main
