import React, { Component } from 'react'
import { Form, Select, Input, Button, DatePicker, Icon } from 'antd';
import zhcn from 'antd/lib/date-picker/locale/zh_CN'
import _ from 'lodash'

const FormItem = Form.Item;
const Option = Select.Option;
function toControl(item, index, getFieldDecorator){
  if (item.type === "text") {
    return (
      <FormItem label={item.label} key={index}>
        {getFieldDecorator(item.field, { initialValue: item.defaultValue || '' })(<Input style={{ width: 150 }} />)}
      </FormItem>
    )
  } else if (item.type === "select") {
    if (!item.data) return null;
    let options;
    if (Array.isArray(item.data)) {
      options = item.data.map(d => <Option key={d[(item.option && item.option.key) || 'id']}>{d[(item.option && item.option.key) || 'label']}</Option>);
    } else if (typeof item.data === 'object') {
      let arr = [];
      for (var key in item.data) {
        arr.push({ id: key, label: item.data[key] })
      }
      options = arr.map(d => <Option key={d.id}>{d.label}</Option>);;
    }
    return (
      <FormItem label={item.label} key={index}>
        {getFieldDecorator(item.field, { initialValue: item.defaultValue || '' })(<Select style={{ width: 150 }}>{options}</Select>)}
      </FormItem>
    );
  } else if (item.type === "custom") {
    const options = item.options || {}
    return (
      <FormItem label={item.label} key={index}>
        {getFieldDecorator(item.field, { initialValue: item.defaultValue || null })(<item.view {...options} style={{ width: 150 }} />)}
      </FormItem>
    );
  } else if (item.type === "date") {
    return (
      <FormItem label={item.label} key={index}>
        {getFieldDecorator(item.field, { initialValue: item.defaultValue || null })(<DatePicker style={{ width: 150 }} />)}
      </FormItem>
    );
  } else if (item.type === "month") {
    return (
      <FormItem label={item.label} key={index}>
        {getFieldDecorator(item.field, { initialValue: item.defaultValue || null })(<DatePicker.MonthPicker format="YYYY-MM" style={{ width: 150 }} />)}
      </FormItem>
    );
  }
  return null;
}
class SearchForm extends Component {
  state = { showMore: false }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        _.each(values,(value,key)=>{
          if(value && value._isAMomentObject){
            values[key] = value.format('YYYY-MM-DD');
          }else if(value && value != '0'){
            values[key] = value.toString().trim();
          }else{
            delete values[key]
          }
        })
        this.props.onSearch(values)
      }
    })
  }
  toggleMore= ()=>{
    this.setState((preState)=>({showMore:!preState.showMore}));
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const baseItems = this.props.items.filter(item=>!item.more).map((item,index)=>{
      return toControl(item, index, getFieldDecorator);
    });
    const moreItems = this.props.items.filter(item => item.more).map((item, index) => {
      return toControl(item, index, getFieldDecorator);
    });
    const moreClass = this.state.showMore ? 'searchMore showmore' : 'searchMore'
    const moreType = this.state.showMore ? 'up-circle' : 'down-circle'
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} className="ant-advanced-search-form">
        <div className="searchContainer">
          <div className="searchContent">
            {baseItems}
            {moreItems.length > 0 ? (<div className={moreClass}>{moreItems}</div>) : null}
          </div> 
          <div className="searchBtns">
            {moreItems.length > 0 ? (
              <div className="moreBtn" onClick={this.toggleMore.bind(this)}><Icon type={moreType} /></div>) : null}
            {(this.props.buttons.length == 0) ? (
              <FormItem>
                <Button type="primary" htmlType="submit">查询</Button>
                {this.props.buttons}
              </FormItem>
            ): null}
          </div>
        </div>
        {this.props.buttons.length > 0 && <div>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            {this.props.buttons}
          </FormItem>
        </div>}
      </Form>
    );
  }
}
export default Form.create()(SearchForm);
