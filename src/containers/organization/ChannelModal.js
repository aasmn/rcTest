import React from 'react'
import { Row, Col, Form, Input, Select, Cascader } from 'antd'
import { agentApi, userApi } from '@/utils/api'
import _ from 'lodash'
import FileUploader from '@/components/common/FileUploader'
import { notification } from 'pilipa'
import Modal from '@/components/common/Modal'
import allArea from 'chinese-region-util'
const FormItem = Form.Item
const Option = Select.Option
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      areaData: [],
      // cAreaData: [],
      idcardurl: '',
      accountingurl: '',
      licenseurl: ''
    }
    this.fetchAreaList = this.fetchAreaList.bind(this)
    // this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.setStateChange = this.setStateChange.bind(this)
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
    this.setState({
      areaData: data
    })
  }
  fileUploaded1 (path) {
    console.log(path, 'path')
    this.setState({ idcardurl: path[0] })
  }
  fileUploaded2 (path) {
    console.log(path, 'path')
    this.setState({ accountingurl: path[0] })
  }
  fileUploaded3 (path) {
    console.log(path, 'path')
    this.setState({ licenseurl: path[0] })
  }
  handleSubmit (e, cb) {
    if (e) {
      e.preventDefault()
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('所有输入域字段', values)
        values.provcode = values.pcode[0]
        let proviceData = _.find(this.state.areaData, {code: values.provcode})
        values.provname = proviceData.name
        values.citycode = values.pcode[1]
        values.cityname = _.find(proviceData.children, {code: values.citycode}).name
        values.idcardurl = this.state.idcardurl
        values.accountingurl = this.state.accountingurl
        values.licenseurl = this.state.licenseurl
        delete values.pcode
        console.log('处理完字段', values)
        if (this.props.data && this.props.data.id) {
          agentApi.put(this.props.data.id, values).then(res => {
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
          agentApi.post(values).then(res => {
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
    if (props.data && props.data.id) {
      props.data.pcode = [props.data.provcode, props.data.citycode]
      this.state.idcardurl = props.data.idcardurl
      this.state.accountingurl = props.data.accountingurl
      this.state.licenseurl = props.data.licenseurl
    }
    const { areaData } = this.state
    // console.log(areaData, 'areaData')
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
              label="代理商："
            >
              {getFieldDecorator('channelname', {
                rules: [{
                  required: true, message: '请输入代理商!'
                }],
                initialValue: props.data.channelname
              })(
                <Input placeholder="请输入" disabled={props.readOnly || this.props.data.id}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="负责人："
            >
              {getFieldDecorator('person', {
                rules: [{
                  required: true, message: '请输入负责人!'
                }],
                initialValue: props.data.person
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="省份城市："
            >
              {getFieldDecorator('pcode', {
                rules: [{
                  required: true, message: '请选择省份城市!'
                }],
                initialValue: props.data.pcode
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
              props.data.id &&
              <FormItem
                {...formItemLayout}
                label="手机："
              >
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: true, message: '请输入手机号!'
                  }],
                  initialValue: props.data.mobile
                })(
                  <Input placeholder="请输入" disabled={true}/>
                )}
              </FormItem>
            }
            {
              !props.data.id &&
              <FormItem
                {...formItemLayout}
                label="手机："
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
              label="邮箱："
            >
              {getFieldDecorator('email', {
                rules: [{
                  required: true, message: '请输入邮箱!'
                }],
                initialValue: props.data.email
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="开户行："
            >
              {getFieldDecorator('accountbank', {
                initialValue: props.data.accountbank
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="开户行支行："
            >
              {getFieldDecorator('branch', {
                initialValue: props.data.branch
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="开户名："
            >
              {getFieldDecorator('accountname', {
                initialValue: props.data.accountname
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="法人："
            >
              {getFieldDecorator('legalperson', {
                initialValue: props.data.legalperson
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="银行账号："
            >
              {getFieldDecorator('bankaccount', {
                initialValue: props.data.bankaccount
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="保证金："
            >
              {getFieldDecorator('margin', {
                rules: [{
                  required: true, message: '请输入保证金!'
                }],
                initialValue: props.data.margin
              })(
                <Input placeholder="请输入" disabled={props.readOnly}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="身份证"
            >
              {getFieldDecorator('idcardurl', {
                initialValue: props.data.idcardurl
              })(
                <FileUploader path={this.state.idcardurl} uploaded={this.fileUploaded1.bind(this)} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="代帐资质"
            >
              {getFieldDecorator('accountingurl', {
                initialValue: props.data.accountingurl
              })(
                <FileUploader path={this.state.accountingurl} uploaded={this.fileUploaded2.bind(this)} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="营业执照"
            >
              {getFieldDecorator('licenseurl', {
                initialValue: props.data.licenseurl
              })(
                <FileUploader path={this.state.licenseurl} uploaded={this.fileUploaded3.bind(this)} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
export default Form.create()(Main)
