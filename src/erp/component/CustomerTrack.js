import React from 'react'
import {Tag, Input} from 'antd'
import Title from '@/erp/component/Title'

const TextArea = Input.TextArea

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.resetValue = this.resetValue.bind(this)
  }

  handleChange(e) {
    this.setState({value: e.target.value})
    this.props.emitTrack(e.target.value);
  }

  resetValue() {
    this.setState({value: ''})
  }

  deleteSelf(tag) {
    this.props.deleteTag(tag)
  }

  render() {
    const {tags} = this.props
    return (

      <div style={this.props.style} className="track-list">
        {(!this.props.readOnly) && <Title title='跟进记录'/>}
        {tags && tags.length > 0 && tags.map(tag => {
          return <Tag
            closable
            onClose={this.deleteSelf.bind(this, tag)}
            style={{marginTop: '5px'}}
            key={tag.TagName}
          >{tag.TagName}</Tag>
        })}
        {(!this.props.readOnly) &&
        <TextArea onChange={this.handleChange.bind(this)}
                  value={this.state.value}
                  style={{marginTop: '5px'}}
                  rows={2}/>}
      </div>
    );
  }
}

export default Main
