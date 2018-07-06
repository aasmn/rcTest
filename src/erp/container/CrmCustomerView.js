import React from 'react'
import {Row, Col, Spin, List, Tabs, Tag} from 'antd'
import {connect} from 'react-redux'
import CrmCustomer from '@/erp/component/CrmCustomer'
import {getListData, deleteData, postData} from '@/erp/api'
import TagSelect from '@/erp/component/TagSelect'
import _ from 'lodash'
import CustomerTrack from '@/erp/component/CustomerTrack'
import RemindDate from '@/erp/component/RemindDate'
import {getTags} from '@/erp/store/actions'
import { fDateT, fDate } from '@/erp/config/filters'

const mapDispatchToProps = dispatch => {
  return {
    getTags: payload => {
      dispatch(getTags())
    }
  }
}


const Tags = connect(({common}) => {
  return {
    tags: common.tags,
  }
}, mapDispatchToProps)(TagSelect)

class CTag extends React.Component {
  render(){
    if(!(this.props.tags && this.props.tags.length>0)  ) return <Spin/>
    const tags = this.props.tags;
    const tagname = _.find(tags,{Id: +this.props.value}).TagName;
    return(
      <Tag color="#108ee9">{tagname}</Tag>
    )
  }
}
const MyTag = connect(({common}) => {
  return {
    tags: common.tags,
  }
}, mapDispatchToProps)(CTag);



function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
function fomateData(item) {
  let t = _.pick(item, ['CompanyName', 'RegisterDate', 'Connector', 'Mobile', 'Telephone', 'Category', 'AddedValue','CustomerTypeId' , 'AreaCode', 'Address']);
  t.RegisterDate = fDate(t.RegisterDate + '');
  return t;
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {},
      customerId: this.props.customerId,
      tagSelected: [],
      tags: null,
      trackDescription: '',
      remindDateStr: '',
      customerLogs: []
    }
    this.getDateFromSub = this.getDateFromSub.bind(this)
    this.getTrack = this.getTrack.bind(this)
  }
  reset= ()=>{
    this.setState({
      trackDescription: '',
      taremindDateStrgs: '',
      tags: null
    })
    this.refs.CustomerTrack.resetValue();
    this.refs.RemindDate.resetValue();
    this.resetTagSelected();
  }
  saveCustomer = () => {
    const that = this;
    return new Promise((resolve, reject) => {
      var result = that.cusform.getFieldsValue();
      if (result) {
        let org = this.state.customer; 
        // if (org.RegisterDate && org.RegisterDate.substr(0, 4) !== '0001')
        //   org.RegisterDate = moment(org.RegisterDate).format('YYYY-MM-DD');
        // else
        //   org.RegisterDate = null;
        // // if (org.CreateDate && org.CreateDate.substr(0, 4) !== '0001')
        // //   org.CreateDate = moment(org.CreateDate).format('YYYY-MM-DD');
        // // else
        // //   org.CreateDate = null;

        if (!_.isEqual(fomateData(org), fomateData(result))) {
           result.isSave = true
        }
        
        resolve(result)
      } else {
        reject();
      }
    })

  }
  getFieldsValue = () => {
    const errors = this.props.form.getFieldsError();
    if (!hasErrors(errors)) {
      const formValues = this.props.form.getFieldsValue()
      if (this.props.data.Id) {
        return {...this.props.data, ...formValues}
      } else {
        return formValues
      }
    }
    return null
  }
  resetTagSelected() {
    this.setState({tagSelected: []})
  }
  addTag = (tag) => {
    const {tagSelected} = this.state
    for (let i = 0; i < tagSelected.length; i++) {
      if (tagSelected[i]['Id'] === tag.Id) {
        return;
      }
    }
    this.setState({tagSelected: tagSelected.concat(tag)})


  }
  deleteTag = (tag) => {
    const {tagSelected} = this.state
    tagSelected.splice(tagSelected.indexOf(tag), 1)
    this.setState({tagSelected: tagSelected})
    // delete this.state.selectedTags[tag]
    // this.setState({
    //   tagLoading: true
    // })
    // const selected = _.find(this.state.tagSelected, {TagId: +tag.Id})
    // if(selected){
    //   this._deleteTag(selected).then(res=>{
    //     this.getSelectedTags()
    //   })
    // }
  }
  _deleteTag = (tag) => {
    return deleteData('customertag/' + tag.Id)
  }
  // 获取客户详情
  getCustomerInfo = () => {
    getListData('customerdetail/' + this.state.customerId).then(res => {
      if (res.status) {
        this.setState({customer: res.data})
      }
    })
  }
  getSelectedTags = () => {
    getListData('customertag/' + this.state.customerId).then(res => {
      if (res.status) {
        this.setState({tagSelected: res.data}, () => {
          this.setState({tagLoading: false})
        })
      }
    });
  }
  getCustomerTrack = () => { 
    getListData('customertrack/' + this.state.customerId).then(res => {
      if (res.status) {
        this.setState({customertrack: res.data})
      }
    });
  }
  // 获取系统记录
  getCustomerLogs() {
    getListData(`customer/sales/logs?customerId=@/erp{this.state.customerId}`)
      .then(res => {
        if (res.status) {
          this.setState({customerLogs: res.data})
        }
      })
  }

  getRemindDate = () => {
    getListData('nexttrackremind/' + this.state.customerId).then(res => {
      if (res.status) {
        this.setState({reminds: res.data})
      }
    });
  }
  removeRemind = (id) => {
    deleteData('nexttrackremind/' + id)
  }
  addRemind = (val) => {
    postData('nexttrackremind', {
      CustomerId: this.state.customerId,
      NextTrackTime: val,
      SalesId: JSON.parse(window.sessionStorage.getItem('user')).Id
    }).then(res => {
      if (res.status) {
        this.getRemindDate()
      }
    })
  }
  submitTrack = (val) => {
    postData('customertrack', {
      CustomId: this.state.customerId,
      Description: val
    }).then(res => {
      this.getCustomerTrack()
    })
  }
  showNext = (id) => {
    this.setState({customerId: id, customer: {}})
    this.getCustomerInfo()
    // this.getSelectedTags()
    this.getCustomerTrack()
    // this.getRemindDate()
  }

  // 获取已选择的拜访时间
  getDateFromSub(date) {
    // console.log(`this is date from sub @/erp{date}`)
    this.setState({remindDateStr: date && date.format('YYYY-MM-DD')})
  }

  // 获取跟进记录文本
  getTrack(description) {
    // console.log(`this is description from sub @/erp{description}`)
    this.setState({trackDescription: description})
  }

  componentWillMount() {
    this.getCustomerInfo()
    // this.getSelectedTags()
    this.getCustomerTrack()
    // this.getRemindDate()
    this.getCustomerLogs()
  }

  render() {
    const {tagSelected, customer, customerLogs} = this.state
    const {type} = this.props
    return (
      <div>
        <div className="ant-modal-header" style={{margin: "-12px -12px 12px"}}>
          <div className="ant-modal-title"
               id="rcDialogTitle1">{(this.state.customer && this.state.customer.CompanyName) || <Spin/>}</div>
        </div>
        <Row>

          <Col span={12}> {this.state.customer.Id ?
            <CrmCustomer data={this.state.customer} wrappedComponentRef={cusform => {
              this.cusform = cusform
            }} readOnly={this.props.readOnly}/> : <Spin/>}
            {type !== 'pub' &&
            <Tags
              tags={this.props.tags}
              selected={this.state.tagSelected}
              addTag={this.addTag}
            />}
          </Col>
          <Col span={12}>
            <CustomerTrack ref='CustomerTrack'
                           tags={tagSelected}
                           deleteTag={this.deleteTag}
                           data={this.state.customertrack}
                           emitTrack={this.getTrack}
                           readOnly={this.props.readOnly}/>
            {(!this.props.readOnly) && <div>
              <RemindDate ref='RemindDate'
                          data={this.state.reminds}
                          emitDate={this.getDateFromSub}
                          onRemove={this.removeRemind}
                          onAdd={this.addRemind}
                          reservationDate={customer.ReservationDate ? customer.ReservationDate : ''}/>
            </div>}
            <Tabs defaultActiveKey="1" type='card' className='tabs-record'>
              <Tabs.TabPane tab="销售记录" key="1">
                <List
                  className="track-list"
                  bordered
                  dataSource={this.state.customertrack}
                  renderItem={item => (
                    <List.Item key={item.Id}>
                      <List.Item.Meta
                        title={`@/erp{item.UserName}  @/erp{item.TrackDate.replace('T', ' ')}`}
                        description={<div>{item.Tags &&
                        item.Tags !== '' &&
                        item.Tags.split(',').map((subItem, subIndex) => <MyTag
                          key={subIndex} value={subItem}/>
                        )}&nbsp;&nbsp;{item.Description}</div>}/>
                    </List.Item>)}
                ></List>
              </Tabs.TabPane>
              <Tabs.TabPane tab="系统记录" key="2">
                <List
                  bordered
                  className="track-list"
                  dataSource={customerLogs}
                  renderItem={item => (
                    <List.Item key={item.Id}>
                      <List.Item.Meta
                        title={`系统  @/erp{fDateT(item.CreateTime)}`}
                        description={item.Content}/>
                    </List.Item>)}
                ></List>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>)
  }
}
export default Main;
