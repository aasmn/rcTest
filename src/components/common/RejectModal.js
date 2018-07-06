import React from 'react'
import { Row, Col, Form, Input } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
class Main extends React.Component {
  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
    return (
      <Form>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label={this.props.label}
            >
              {getFieldDecorator('reason', {
                rules: [{
                  required: true, message: '请输入原因!'
                }],
                initialValue: ''
              })(
                <TextArea row={3}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
export default Form.create()(Main)
