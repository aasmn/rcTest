import React, { Component } from 'react'
import { Input, Table } from 'antd'
import _ from 'lodash'


class Main extends Component {
  constructor(props) {
    super(props);
    this.data = _.cloneDeep(props.data);
    _.each(this.data, (t, index) => { t.Weight = t.Weight||(index+1);})
    this.state = {
      data: this.data
    };
    
    _.each(this.data, item=>{
      if(!item.TaskId) item.TaskId = item.Id;
    })
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(row,value){
    if (!row.TaskId) row.TaskId = row.Id;
    _.find(this.data,{TaskId: row.TaskId}).Weight = +value;
  }
  render() {
    const columns = [{
            title: '子任务名称',
            dataIndex: 'TaskName'
        }, {
            title: '权重',
            dataIndex: 'Weight',
            render: (val, row) => { return <Input defaultValue={val} onChange={e=>{this.handleInputChange(row,e.target.value)}}/>}
        }]
    return (
      <Table columns={columns}
        rowKey={record => record.TaskId}
        dataSource={this.state.data}
        loading={this.state.loading}
        pagination={false} 
        onChange={this.handleTableChange}
        size="middle"
        bordered={true}
      />
    );
  }
}


export default Main
