import React from 'react'
import '@/erp/style/main.less'
import SearchForm from '@/erp/container/SearchForm'
import { Table } from 'antd'
import { getListData } from '@/erp/api'

let search = {
  items: [{
      label: '文件名',
      type: 'text',
      field: 'filename'
  }, {
      label: '',
      type: 'select',
      field: 'type',
      data: [{ id: 1, label: '按上传日期倒序' }, { id: 2, label: '按文件名称升序' }],
      defaultValue: '1'
  }],
  buttons:[]
}
export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal(total) {
          return `共计 @/erp{total} 条`;
        }
      },
      searchParams: {},
      loading: false,
      documentList: []
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.goBack = this.goBack.bind(this)
  }
  handleTableChange (pagination){
    this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
  }
  onSearch(vals={}) {
    this.setState({searchParams: vals, loading: true});
    const pagination =this.state.pagination;
    vals.limit = pagination.pageSize;
    vals.offset = (pagination.current - 1) * pagination.pageSize;
    console.log(vals, 'vals')
    return getListData('doc/getDocList', vals).then(res => {
      if(res.status){
        const pagination = { ...this.state.pagination };
        pagination.total = res.Count;
        this.setState({
          loading: false,
          documentList: res.data,
          pagination,
        });
      }
      return res;
    },err=>{
      this.setState({
        loading: false
      });
    })
  }
  componentWillMount () {
    this.onSearch()
  }
  goBack () {
    this.props.history.goBack()
  }
  render () {
    const columns = [{
      title: '文件名',
      dataIndex: 'FileName'
    }, {
      title: '大小',
      dataIndex: 'FileSize'
    }, {
      title: '上传日期',
      dataIndex: 'CreateDate'
    }, {
      render: (text, record) => (
        <a href={record.FilePath} target='_blank'>下载</a>
      )
    }]
    return (
      <div className="more-notice">
        <h3 className="vheader">
          公告列表
          <span className="back-last" onClick={this.goBack}>返回首页</span>
        </h3>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
        <Table columns={columns}
            rowKey={record => record.Id}
            dataSource={this.state.documentList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            size="middle"
            bordered={true}
        />
      </div>
    )
  }
}