import React from 'react'
import { Row, Col, Form, Input, Select, Cascader } from 'antd'
import { directApi, userApi } from '@/utils/api'
import _ from 'lodash'
import { notification } from 'pilipa'
import Modal from '@/components/common/Modal'
import allArea from 'chinese-region-util'
const FormItem = Form.Item
const Option = Select.Option
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      areaData: []
      // cAreaData: []
    }
    this.fetchAreaList = this.fetchAreaList.bind(this)
    // this.handleChange = this.handleChange.bind(this)
  }
  componentWillMount () {
    this.fetchAreaList()
  }
  fetchAreaList () {
    let data = allArea.findAll()
    data.map(d => {
      d.children && d.children.map(t => {
        delete t.children
      })
    })
    console.log(data, 'data')
    this.setState({
      areaData: data
    })
  }
  // handleChange (value) {
  //   const selectProviceData = _.find(this.state.areaData, {code: value} || {})
  //   this.setState({
  //     cAreaData: selectProviceData.children || []
  //   })
  // }
  handleSubmit (e, cb) {
    if (e) {
      e.preventDefault()
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('所有输入域字段', values)
        values.pcode = values.provcode[0]
        values.ccode = values.provcode[1]
        let proviceData = _.find(this.state.areaData, {code: values.pcode})
        values.provname = proviceData.name
        values.cityname = _.find(proviceData.children, {code: values.ccode}).name
        values.id = this.props.id
        delete values.provcode
        console.log('处理完字段', values)
        console.log(this.props.data, this.props.id, 'this.props.data.id')
        if (this.props.id) {
          directApi.put(values).then(res => {
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
          directApi.post(values).then(res => {
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
    const validatePhoneRepeat = (rule, value, cttb) => {
      if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
        cttb('手机号码格式不正确')
        return
      }
      if (value !== (this.props.user || {}).mobile) {
        userApi.getUaaUser(value).then(res => {
          if (res.status && res.data) {
            const modal = Modal.show({
              content: '此手机号在系统中已存在，如果继续添加将会覆盖他人信息！',
              title: '用户重复提示',
              mask: true,
              onOk: () => {
                // this.repeatMobile(res.data)
                modal.hide()
              },
              onCancel: () => {
                modal.hide()
              }
            })
          }
        })
      }
      cttb()
    }
    const props = this.props
    console.log(this.props, 'props')
    if (props.id) {
      props.data.provcode = [props.data.pcode, props.data.ccode]
    }
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
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="公司名称："
            >
              {getFieldDecorator('cname', {
                rules: [{
                  required: true, message: '请输入公司名称!'
                }],
                initialValue: props.data.cname
              })(
                <Input placeholder="请输入" disabled={props.readOnly || props.id}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="省份城市："
            >
              {getFieldDecorator('provcode', {
                rules: [{
                  required: true, message: '请选择省份城市!'
                }],
                initialValue: props.data.provcode
              })(
                <Cascader
                  filedNames={{ label: 'name', value: 'code', children: 'children' }}
                  options={areaData}
                  placeholder="请选择"
                  disabled={props.readOnly}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="地址："
            >
              {getFieldDecorator('address', {
                rules: [{
                  required: true, message: '请输入地址!'
                }],
                initialValue: props.data.address
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            {
              (props.id) &&
              <FormItem
                {...formItemLayout}
                label="管理员手机号："
              >
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: true, message: '请输入手机号!'
                  }],
                  initialValue: props.data.mobile
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
            }
            {
              !props.id &&
              <FormItem
                {...formItemLayout}
                label="管理员手机号："
              >
                {getFieldDecorator('mobile', {
                  rules: [{
                    validator: validatePhoneRepeat
                  }],
                  initialValue: props.data.mobile
                })(
                  <Input placeholder="请输入" disabled={props.readOnly}/>
                )}
              </FormItem>
            }
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="管理员姓名："
            >
              {getFieldDecorator('aname', {
                rules: [{
                  required: true, message: '请输入管理员姓名!'
                }],
                initialValue: props.data.aname
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
export default Form.create()(Main)
