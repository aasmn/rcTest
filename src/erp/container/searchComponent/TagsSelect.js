import React, { Component } from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
import { getTags } from '@/erp/store/actions'
import _ from 'lodash'

const Option = Select.Option;
const OptGroup = Select.OptGroup;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    console.log(e)
    this.setState({value:e.join(',')});
    this.props.onChange(e.join(','));
  }
  componentWillMount() {
    this.props.getTags()
  }
  render() {
    if(!this.props.tags) return null;
    const tagGroup = _.groupBy(this.props.tags,'TagType');
    const options = _.map(tagGroup, (arr,key)=>{
      return (<OptGroup label={key} key={key}>{arr.map(d => <Option key={d.Id}>{d.TagName}</Option>)}</OptGroup>)
    })
    return (
      <Select
        style={{width: this.props.width || 160}}
        maxTagCount={1}
        maxTagPlaceholder="..."
        mode="multiple"
        onChange={this.handleChange}>
      {options}
      </Select>
    );
  }
}
const mapStateToProps = ({common}) => {
  return {
    tags: common.tags,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getTags: payload => {
      dispatch(getTags())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
