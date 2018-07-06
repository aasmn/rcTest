import React, { Component } from 'react'
import { Table } from 'antd'
import { getListData } from '@/erp/api'
import SearchForm from '@/erp/container/SearchForm'

let search = {
    items: [{
        label: '开始日期',
        type: 'date',
        field: 'startdate'
    }, {
        label: '结束日期',
        type: 'date',
        field: 'enddate'
    }]
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchParams: {},
      loading: false,
    };
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(vals={}) {
    this.setState({searchParams: vals, loading: true});
    const data = {
      limit: 10000,
      offset: 0,
      startdate: vals.startdate||'',
      enddate: vals.enddate||''
    }
    return getListData('orderforcenter', data).then(res => {
      if(res.status){
        this.setState({
          loading: false,
          data: res.data.list
        });
      }
      return res;
    },err=>{
      this.setState({
        loading: false
      });
    })
  }

  componentWillMount() {
    this.onSearch();
  }

  render() {
    const columns = [{
      title: '直营公司',
      dataIndex: 'SubsidiaryName'
    }, {
      title: '小规模数量',
      dataIndex: 'SmallScale'
    }, {
      title: '小规模金额',
      dataIndex: 'SmallAmount'
    }, {
      title: '一般纳税人数量',
      dataIndex: 'GeneralTaxpayer'
    }, {
      title: '一般纳税人金额',
      dataIndex: 'GeneralAmount'
    }, {
      title: '合计数量',
      dataIndex: 'orderHJ'
    }, {
      title: '合计金额',
      dataIndex: 'AmountHJ'
    }];

    return (
      <div>
        <SearchForm items={search.items} onSearch={this.onSearch}/>
        <Table columns={columns}
            rowKey={record => record.SubsidiaryName}
            dataSource={this.state.data}
            loading={this.state.loading}
            size="middle"
            bordered={true}
        />
      </div>
    );
  }
}
export default Main
