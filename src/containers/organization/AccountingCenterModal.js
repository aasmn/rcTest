import React from 'react'
import { Row, Col, Form, Input, Cascader, TreeSelect } from 'antd'
import { accountingCenterApi } from '@/utils/api'
import _ from 'lodash'
import { notification } from 'pilipa'
import area from '@/data/area-json'
import allArea from 'chinese-region-util'
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      areaData: [],
      selected: [], // 默认选中的省市
      selectedAllArea: [], // 存放最终选择完传给后端的数据
      alreadySelectArea: []
    }
    this.fetchAreaList = this.fetchAreaList.bind(this)
    this.handleOnchange = this.handleOnchange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentWillMount () {
    this.handleModifyData()
    this.fetchAreaList()
    this.getcodeUse()
  }
  getcodeUse () {
    // this.setState({
    //   alreadySelectArea: [{
    //     name: '山西省',
    //     code: '140000'
    //   }, {
    //     name: '太原市',
    //     code: '140100'
    //   }]
    // })
    accountingCenterApi.codeuse().then(res => {
      if (res.status) {
        this.setState({
          alreadySelectArea: res.data
        })
      }
    })
  }
  handleModifyData () {
    console.log(this.props.data, 'propsdata')
    const data = this.props.data
    let selectedAry = []
    // console.log(this.state.selected)
    for (var i in data.range) {
      selectedAry.push(data.range[i].code)
    }
    console.log(selectedAry, 'selectedAry')
    this.setState({
      selected: selectedAry
    })
  }
  fetchAreaList () {
    this.setState({
      areaData: this.formatData(allArea.findAll())
    })
  }
  formatData (data) {
    if (!data || !Array.isArray(data)) {
      return []
    }
    // 此处需要将已经被选择过的地区disabled设置为true，不允许再选
    let result = []
    data.forEach(pro => {
      const {code, name, children} = pro
      let province = {
        key: code,
        value: code,
        label: name,
        children: []
      }
      if (children && children.length) {
        children.forEach(child => {
          const {code, name} = child
          province.children.push({
            key: code,
            value: code,
            label: name,
            children: [],
            disabled: false
          })
        })
        result.push(province)
      }
    })
    console.log(result)
    return result
  }
  handleOnchange (value, selectedOptions) {
    // console.log(value, selectedOptions, 'change')
    // let code = value[value.length - 1]
    // console.log(code, 'code')
    // accountingCenterApi.iscodeuse(code).then(res => {
    //   if (res.status) {
    //     if (res.data.status) {
    //       notification.warning({
    //         message: '该地区是其他核算机构管辖范围，不容许选择！'
    //       })
    //     }
    //   }
    // })
    let ary = []
    for (let i in value) {
      ary.push({
        name: selectedOptions[i],
        code: value[i]
      })
    }
    this.setState({
      selectedAllArea: ary
    })
    console.log(ary, 'ary')
  }
  handleSubmit (e, cb) {
    if (e) {
      e.preventDefault()
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('所有输入域字段', values)
        values.range = this.state.selectedAllArea
        if (this.props.data && this.props.data.id) {
          accountingCenterApi.put(this.props.data.id, values).then(res => {
            if (res.status) {
              notification.success({
                message: '修改成功'
              })
              if (cb) {
                cb()
              }
            }
          })
        } else {
          accountingCenterApi.post(values).then(res => {
            if (res.status) {
              notification.success({
                message: '新增成功'
              })
              if (cb) {
                cb()
              }
            }
          })
        }
      }
    })
  }
  render () {
    const props = this.props
    const { areaData } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Row>
          <Col span={24}>
            <FormItem
              {...formItemLayout}
              label="机构名称："
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入机构名称!'
                }],
                initialValue: props.data.name
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="核算地区范围："
            >
              {getFieldDecorator('range', {
                initialValue: this.state.selected
              })(
                <TreeSelect
                  showSearch
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择地区"
                  allowClear
                  multiple
                  treeDefaultExpandAll={false}
                  treeData={areaData}
                  onChange={this.handleOnchange}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
export default Form.create()(Main)
