import { Button, Col, Form, Icon, Input, Select, Row, DatePicker, Radio, Cascader } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import styles from '@/stylus/search'
import { fetchVisitSelectCode } from '@/utils/api'
import allArea from 'chinese-region-util'
const FormItem = Form.Item
const Option = Select.Option
class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expandForm: false,
      communicationResultsSelect: [],
      areaData: []
    }
    this.nodes = []
  }
  componentWillMount () {
    if (this.props.showArea) {
      this.fetchAreaList()
    }
    if (this.props.fetchCommunicationResults) {
      this.fetchCommunicationResults()
    }
  }
  fetchAreaList () {
    let data = allArea.findAll()
    data.map(d => {
      d.children && d.children.map(t => {
        delete t.children
      })
    })
    // console.log(data, 'resdata')
    this.setState({
      areaData: data
    })
  }
  fetchCommunicationResults () {
    let params = {
      type: 'comresults'
    }
    fetchVisitSelectCode(params).then(res => {
      if (res.status) {
        this.setState({
          communicationResultsSelect: res.data
        })
      }
    })
  }
  handleSearch (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.onSearch) {
          const res = this.handleSearchRes(values.filed)
          this.props.onSearch(res)
        }
      }
    })
  }
  handeladdNew (e) {
    e.preventDefault()
    this.props.addNew()
  }
  handeleExport (e) {
    e.preventDefault()
    this.props.export()
  }
  // handleFormReset () {
  //   this.props.form.resetFields()
  // }
  toggleForm () {
    const { paramKeys } = this.props
    this.setState({
      expandForm: !this.state.expandForm
    })
  }
  handleSearchRes (values) {
    const { paramKeys } = this.props
    const res = []
    // console.log(values)
    paramKeys.map((item) => {
      // console.log(values[item], item)
      res.push(values[item])
    })
    // console.log(res, 'res')
    return res
  }
  getParamNodes () {
    const { getFieldDecorator } = this.props.form
    const { paramKeys } = this.props
    const { expandForm, areaData } = this.state
    const Rows = [
      <FormItem label="">
        {getFieldDecorator('filed[0]')(<Input placeholder="搜索" />)}
      </FormItem>,
      <FormItem label="公司名称">
        {getFieldDecorator('filed[1]')(<Input placeholder="公司名称" />)}
      </FormItem>,
      <FormItem label="联系方式">
        {getFieldDecorator('filed[2]')(<Input placeholder="联系方式" />)}
      </FormItem>,
      <FormItem label="联系人">
        {getFieldDecorator('filed[3]')(<Input placeholder="联系人" />)}
      </FormItem>,
      <FormItem label="沟通结果">
        {getFieldDecorator('filed[4]')(
          <Select placeholder="请选择" style={{width: 150}}>
            {
              this.state.communicationResultsSelect.map(d => {
                return (
                  <Option key={d.code}>{d.value}</Option>
                )
              })
            }
          </Select>
        )}
      </FormItem>,
      <FormItem label="联系时间">
        {getFieldDecorator('filed[5]')(
          <DatePicker />
        )}
      </FormItem>,
      <FormItem label="直营/代理商">
        {getFieldDecorator('filed[6]')(<Input placeholder="直营/代理商" />)}
      </FormItem>,
      <FormItem label="商户类型">
        {getFieldDecorator('filed[7]', { initialValue: this.props.type || '2' })(
          <Radio.Group placeholder="请选择" style={{ width: '100%' }}>
            <Radio value="2">代理商</Radio>
            <Radio value="1">直营</Radio>
          </Radio.Group>
        )}
      </FormItem>,
      <FormItem label="服务截止时间">
        {getFieldDecorator('filed[8]')(
          <DatePicker placeholder="请选择开始时间"/>
        )}
      </FormItem>,
      <FormItem label="客户地区">
        {getFieldDecorator('filed[9]')(
          <Cascader
            filedNames={{ label: 'name', value: 'code', children: 'children' }}
            options={areaData}
            placeholder="请选择"
          />
        )}
      </FormItem>,
      <FormItem label="">
        {getFieldDecorator('filed[10]')(
          <DatePicker placeholder="请选择结束时间"/>
        )}
      </FormItem>,
      <FormItem label="直营">
        {getFieldDecorator('filed[11]')(<Input/>)}
      </FormItem>,
      <FormItem label="代理商">
        {getFieldDecorator('filed[12]')(<Input/>)}
      </FormItem>,
      <FormItem label="区域">
        {getFieldDecorator('filed[13]')(
          <Cascader
            filedNames={{ label: 'name', value: 'code', children: 'children' }}
            options={areaData}
            placeholder="请选择"
          />
        )}
      </FormItem>,
      <FormItem label="状态">
        {getFieldDecorator('filed[14]')(
          <Select style={{width: 100}} placeholder="请选择">
            <Option key='0'>全部</Option>
            <Option key='1'>正常</Option>
            <Option key='2'>未审核</Option>
            <Option key='3'>拒审</Option>
            <Option key='4'>解约</Option>
            <Option key='5'>解约中</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem label="机构名称"> {getFieldDecorator('filed[15]')(<Input placeholder='请输入'/>)}
      </FormItem>,
      <FormItem label="创建时间">
        {getFieldDecorator('filed[16]')(
          <DatePicker/>
        )}
      </FormItem>,
      <FormItem label="名称">
        {getFieldDecorator('filed[17]')(<Input/>)}
      </FormItem>,
      <FormItem label="说明">
        {getFieldDecorator('filed[18]')(<Input/>)}
      </FormItem>,
      <FormItem label="">
        {getFieldDecorator('filed[19]')(<Input placeholder='搜索姓名'/>)}
      </FormItem>,
      <FormItem label="">
        {getFieldDecorator('filed[20]')(<Input placeholder='搜索手机号'/>)}
      </FormItem>
    ]
    this.nodes = []
    paramKeys.map((item, index) => {
      this.nodes.push(
        <Col key={`search-param-${index}`} md={8} sm={24}>
          {Rows[item]}
        </Col>
      )
    })
    return !expandForm ? this.nodes.slice(0, 3) : this.nodes
  }
  render () {
    return (
      <Form onSubmit={this.handleSearch.bind(this)} layout="inline">
        <Row>
          {this.getParamNodes()}
          <Col md={24} sm={24} className={styles['submit-buttons']}>
            <FormItem>
              <span>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                {this.props.isAddUser && <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handeladdNew.bind(this)}>
                  {this.props.title}
                </Button>}
                {
                  this.props.isExport &&
                  <span>
                    <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handeleExport.bind(this)}>
                      {this.props.title}
                    </Button>
                    <a id='normalDownload' href=' ' download='download' style={{display: 'none'}}></a>
                  </span>
                }
                {
                  this.nodes.length > 3 && (
                    !this.state.expandForm ? (
                      <a style={{ marginLeft: 8 }} onClick={this.toggleForm.bind(this)}>
                        展开 <Icon type="down" />
                      </a>
                    ) : (
                      <a style={{ marginLeft: 8 }} onClick={this.toggleForm.bind(this)}>
                        收起 <Icon type="up" />
                      </a>
                    )
                  )
                }
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
Search.propTypes = {
  paramKeys: PropTypes.array.isRequired,
  onSearch: PropTypes.func,
  isAddUser: PropTypes.bool,
  title: PropTypes.string
}
export default Form.create()(Search)
