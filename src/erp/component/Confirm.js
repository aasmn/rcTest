import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input  } from 'antd';

class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      confirmLoading: false
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  handleOk(e) {
    this.props.handleOk && this.props.handleOk();
    this.onClose();
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
      <Modal title= "确认"
          width={this.props.width || 520}
          visible={this.state.visible}
          onOk={(e)=>{this.handleOk(e)}}
          confirmLoading={ this.state.confirmLoading}
          onCancel={(e)=>{this.handleCancel(e)}}
          okText= {this.props.okText || "确定"} 
          cancelText= {this.props.cancelText || "取消"} 
          maskClosable={false}>
        {this.props.message}
      </Modal>:null
    );
  }
}

function createConfirm(options,container){
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
    var d = <Confirm {...options}/>;
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
export default createConfirm;
