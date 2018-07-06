import React from 'react'
import {DatePicker} from 'antd'
import _ from 'lodash'
import moment from 'moment'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleClose(e) {
    this.props.onRemove(e.Id)
  }

  handleChange(m) {
    // this.props.onAdd(m.format('YYYY-MM-DD'))
    this.setState({value: m})
    this.props.emitDate(m)
  }
  resetValue() {
    this.setState({value: null})
  }
  disabledDate(current) {
    return current && current.valueOf() < Date.now();
  }

  render() {
    const {reservationDate} = this.props
    return (
      <div style={this.props.style} className="track-list">
        <div style={{margin: "12px 0", position: 'relative'}}>
          {/*{this.props.data && this.props.data.map(remind=>{*/}
          {/*return <Tag key={remind.Id} closable={true} afterClose={() => this.handleClose(remind)} color="#108ee9">*/}
          {/*{moment(remind.NextTrackTime).format('YYYY-MM-DD')}*/}
          {/*</Tag>*/}
          {/*})*/}
          {/*}*/}
          设置下次拜访时间：<DatePicker
          onChange={this.handleChange}
          disabledDate={this.disabledDate}
          value={this.state.value}
        />
          &nbsp;&nbsp;{reservationDate && moment(reservationDate).format('YYYY-MM-DD')}
        </div>
      </div>
    );
  }
}

export default Main