import React from 'react';
import { List } from 'antd';
import Title from '@/erp/component/Title'

class Department extends React.Component {
  state={selected: {}}
  onClick(item){
    this.props.onClick(item && item.DepartmentId)
    this.setState({
      selected: item || {}
    })
  }
  render() {
    return (
      <div style={this.props.style}>
        <Title title={this.props.companyName} onClick={()=>this.onClick()}/> 
        <List
          size="small"
          bordered
          dataSource={this.props.data}
          renderItem={item => (<List.Item className={this.state.selected.DepartmentId === item.DepartmentId? "m-list-item active":"m-list-item"} onClick={(e)=>this.onClick(item)}>{item.DepartmentName}</List.Item>)}
        />
      </div>
    );
  }
}

export default Department;
