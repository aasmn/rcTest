import React from 'react'
import { Modal, Icon } from 'antd'
class FeedBack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '感谢您的反馈！',
            visible: false
        };
    }
    render() {
        const style = {
            'display': 'block',
            'margin': '24px 0 36px',
            'fontSize': '14px',
            'color': 'red',
            'textIndent': '28px'
        }
        return (<div className="feedback ant-menu">
            <a href="javascript:;" onClick={e => { this.setState({ visible: true }) }}><Icon type="question-circle-o" />问题反馈</a>
            <Modal title={this.state.title}
                width={520}
                visible={this.state.visible}
                footer={false}
                onCancel={e => { this.setState({ visible: false }) }}
                maskClosable={true}>
                <span style={style}>本产品相关问题，欢迎发送至我们的邮箱（<a href="mailto:product@/erpi-counting.cn"> product@/erpi-counting.cn</a>），我们会尽快给您回复!</span>
            </Modal>
        </div>)
    }
}
export default FeedBack;
