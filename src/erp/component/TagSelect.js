import React from 'react'
import { Row, Col, Spin,Button } from 'antd'
import _ from 'lodash'
import Title from '@/erp/component/Title'

class TagRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selected: this.props.selected}
  }
  componentWillReceiveProps(nextProps) {
    this.setState({selected: nextProps.selected})
  }
  handleChange(tag){
    // if(checked){
      this.props.addTag(tag)
    //   this.setState({selected: tag.Id})
    // }else{
    //   this.props.deleteTag(tag)
    //   this.setState({selected: 0})
    // }
  }

  render() {
    return (
      <Row style={{borderBottom: '1px solid #ddd', margin: "6px 0",padding:"3px 0"}}>
        <Col span="4" style={{lineHeight:'28px',height: '28px'}}>{this.props.label}</Col>
        <Col span="20">{this.props.tags.map(tag=>{
          return <Button
            key={tag.TagName}
            size='small'
            style={{marginRight: '8px'}}
            onClick={this.handleChange.bind(this, tag)}
            > {tag.TagName} </Button>
        })}</Col>
      </Row>
    )
  }
}



class Main extends React.Component {
  constructor(props) {
    super(props);
    let selectedTags = {};
    _.each(this.props.selected, tag=>{
      selectedTags[tag.TagType] = tag.TagId
    })
    this.state= {
      selectedTags: selectedTags
    }
  }
  componentWillReceiveProps(nextProps) {
    let selectedTags = {};
    _.each(nextProps.selected, tag=>{
      selectedTags[tag.TagType] = tag.TagId
    })
    this.setState({
        selectedTags: selectedTags
    });
  }
  componentWillMount() {
    this.props.getTags()
  }
  render() {
    const tagGroups = _.groupBy(this.props.tags,'TagType')
    return (
      <div style={{position:"relative"}}>
        <div style={{display: (this.props.loading?'block':'none'),top:0,bottom:0,left:0,right:0,background:'rgba(255,255,255,.5)',position: 'absolute',zIndex:2}}> <Spin/></div>
        <Title title= '标签'/>
        {_.map(tagGroups,(arr,key)=>{
          return (<TagRow selected={this.state.selectedTags[key]} key={key} tags={arr} addTag={this.props.addTag} deleteTag={this.props.deleteTag} label={key} /> )
        })}
      </div>
    )
  }
}

export default Main
