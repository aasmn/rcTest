import React from 'react';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';


class Main extends React.Component{
  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }

  render() {
    const src = this.props.src;
    const additional =  this.props.additional || '?x-oss-process=image/resize,m_lfit,h_75,w_100'
    return (
        <div style={{display:'inline-block'}}>
            <img src={src + additional} alt="" onClick={() => { this.setState({ visible: true }); }} style={{cursor: "pointer"}}/>
            <Viewer
            visible={this.state.visible}
            onClose={() => { this.setState({ visible: false }); } }
            images={[{src: src, alt: '查看图片'}]}
            onMaskClick={() => { this.setState({ visible: false }); } }
            />
        </div>
    );
  }
}

export default Main;
