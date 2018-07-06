import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input  } from 'antd';

class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      confirmLoading: false
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onChange(e){
    this.setState({value: e.target.value})
  }
  handleOk(e) {
    this.setState({ confirmLoading: true })
    const handleOk = this.props.handleOk || this.props.content.handleOk || (() => e || true);
    var result = handleOk(this.state.value);
    if (result && result.constructor === Promise) {
      result.then(this.onClose, () => {
        this.setState({ confirmLoading: false })
      });
    } else if (result) {
      this.onClose(result);
    } else {
      this.setState({ confirmLoading: false })  
    }
  }
  handleCancel(e) {
    this.props.handleCancel && this.props.handleCancel(e);
    this.onCancel();
  }
  onClose(result){
    this.setState({visible: false});
    this.props.onClose(result)
  }
  onCancel(){
    this.setState({visible: false});
    this.props.onCancel()
  }
  render() {
    return (
      this.state.visible?
      <Modal title={this.props.title}
          width={this.props.width || 520}
          visible={this.state.visible}
          onOk={(e)=>{this.handleOk(e)}}
          confirmLoading={ this.state.confirmLoading}
          onCancel={(e)=>{this.handleCancel(e)}}
          okText= "确定"
          cancelText = "取消"
          maskClosable={false}>
        <Input defaultValue = {this.props.value} onChange={this.onChange}/>
      </Modal>:null
    );
  }
}

function createPrompt(options,container){
  const div = document.createElement('div');
  var dialog = new Promise(function(resolve, reject) {
    options.onClose = function(arg){
      resolve(arg);
      div.remove();
    };
    options.onCancel = function(arg){
      div.remove();
      reject(arg);
    }
    var d = <Prompt {...options}/>;
    ReactDOM.render(d, div);
    container = container || document.body
    container.appendChild(div);
  });

  return {
    result: dialog,
    close (arg){
      options.onClose(arg)
    },
    cancel(arg){
      options.onCancel(arg)
    }
  };
}
export default createPrompt;
