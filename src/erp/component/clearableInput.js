import React from 'react'
import { Input, Icon } from 'antd';

class CInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: props.value || '',
    };
  }
  emitEmpty = () => {
    this.input.focus();
    this.setState({ val: '' });
    this.props.onChange('');
  }
  onChange = (e) => {
    this.setState({ val: e.target.value });
    this.props.onChange(e.target.value);
  }
  render() {
    const { val } = this.state;
    const suffix = val ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    const {prefix, placeholder ,type, size} = this.props;
    return (
      <Input
        prefix={prefix}
        placeholder={placeholder}
        type={type}
        size={size}
        suffix={suffix}
        value={val}
        onChange={this.onChange}
        ref={node => this.input = node}
      />
    );
  }
}

export default CInput