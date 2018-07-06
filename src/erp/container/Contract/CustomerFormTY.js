import React, { Component } from 'react'
import { Input, List, Spin, Button, Modal } from 'antd';
import { getListData } from '@/erp/api'
import onClickOutside from 'react-onclickoutside'

// const Search = Input.Search;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || props.value,
      loading: false,
      searchLoading: false,
      searchBoxStyle: {display: 'none'},
        visible:false,
        searchResult:''
    };
    // {UserId: 40, RealName: "十七", DepartmentId: 0}
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleInter =  this.handleInter.bind(this);
    this.handleCancel =  this.handleCancel.bind(this);
    this.searchUrl = this.searchUrl.bind(this);
  }
  handleClickOutside =(evt)=>{
    this.setState({
      searchBoxStyle: {display: 'none'}
    })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value || nextProps.defaultValue){
      this.setState({value: nextProps.defaultValue || nextProps.value})
    }
  }
  handleChange(e) {
    this.setState({value:e.target.value||''});
    this.props.onChange(e.target.value||'');
  }
  handleSearch(){
    if(this.state.value && this.state.value.length>0){
      this.setState({
        loading: true,
        searchBoxStyle: {display: 'block'},
        noData: false,
        data:[]
      })
      getListData('customer/listindispatch',{
        name: this.state.value,
        size: 5
      },{timeout: 1000 * 60 *5}).then(res=>{
        const result = JSON.parse(res.data);
        if(result.length> 0){
          this.setState({
            loading: false,
            data: result
          })
        }else{
          this.setState({
            loading: false,
            data: []
          })
        }
        
      },()=>{
        this.setState({
          loading: false,
          searchBoxStyle: {display: 'block'},
          data:[]
        })
      })
    }
  }
  handleInter(){
    this.setState({
      visible:true
    });
  }
  handleCancel(){
      this.setState({
          visible:false,
          searchResult:''
      })
  }
  handleSelect(item){
    this.setState({
      value: item.name,
      data:[],
      loading:true
    })
    this.props.onChange(item.name);
    getListData('customer/infoindispatch',{
      id: item.id
    }).then((res)=>{
      if(res.status){
        this.props.changeSource(1);
        this.props.onSearch(res.data)
      }
      this.setState({
        loading: false,
        searchBoxStyle: {display: 'none'},
        data:[]
      })
    })
  }
  searchUrl(value){
    this.setState({
        searchResult:'',
        searchLoading: true
    })
    getListData('customer/listincredit',{name:value},{timeout: 1000 * 60 *5}).then((res)=>{
        if(res.status){
          this.props.changeSource(2);
          this.props.onSearch(res.data);
          this.setState({
              visible:false,
              searchLoading: false
          })
        }else{
            this.setState({
              searchResult:'企业信息读取失败！',
              searchLoading: false
            })
        }

    })
  }
  handleSpecial=()=>{
    this.setState({special:true})
    this.props.setSpecialCompany()
  }
  render() {
    return (
      <div>
        <Input value={this.state.value} onChange={this.handleChange} style={{width:'270px'}}/>
        {(!this.state.special) && <Button.Group>
          <Button type="primary" loading={this.state.searchLoading} onClick={e=>{this.handleSearch()}}>查询</Button>
          <Button type="primary" onClick={this.handleInter}>网址</Button>
          <Button type="primary" onClick={this.handleSpecial}>特殊公司</Button>
        </Button.Group>}
        <Modal
          title="请输入网址！"
          footer={null}
          destroyOnClose={true}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <Input.Group compact>
            <Input
              className='urlSearch'
              placeholder=''
              style={{width:'400px'}}
            /><Button type="primary" loading={this.state.searchLoading} onClick={e=>{this.searchUrl(e.target.previousElementSibling.value)}}>查询</Button>
          </Input.Group>
          <div><a href="http://www.gsxt.gov.cn/index.html" target="blank">打开链接： http://www.gsxt.gov.cn/index.html</a></div>
        </Modal>
        <div style={this.state.searchBoxStyle} className="search-box">
          {this.state.loading && <div className="search-loading"><Spin size="small"/>公司正在检索中...</div>}
          {(!this.state.loading) &&<List
            size="small"
            bordered
            dataSource={this.state.data}
            renderItem={item => (<List.Item onClick={e=>{this.handleSelect(item)}}>{item.name}</List.Item>)}
          />}
        </div>
      </div>
    );
  }
}
export default onClickOutside(Main);
