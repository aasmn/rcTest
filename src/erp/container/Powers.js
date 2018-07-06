import React, { Component } from 'react'
import { Card, Checkbox, Spin, Row, Col } from 'antd';
import { getListData } from '@/erp/api'
import Immutable from 'immutable';


class Power extends Component {
  constructor(props) {
    super(props);
    this.state = {
      functions: Immutable.fromJS([])
    };
    console.log('Power:',this.props)
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    const functions = this.state.functions.toJSON()
    let arr = [];
    functions.forEach(function (lv1) {
      if (lv1.checked) {
        arr.push(lv1.FunctionId);
        lv1.Children.forEach(function (lv2) {
          if (lv2.checked) {
            arr.push(lv2.FunctionId);
            lv2.Children.forEach(function (lv3) {
              if (lv3.checked) {
                  arr.push(lv3.FunctionId);
              }
            })
          }
        })
      }
    })
    console.log(arr.join(','))
    this.props.onChange(arr.join(','));
  }
  componentWillMount() {
    getListData('functionlist').then(res=>{
      const user = JSON.parse(window.sessionStorage.getItem('user'))
      let funs = res.data.filter(function(f){
        return f.FunctionCenter === user.IsCenter;
      });
      if(this.props.value){
        const checked = this.props.value.split(',')
        funs.forEach(lv1=>{
          if(checked.indexOf(''+lv1.FunctionId)>-1) lv1.checked = true;
          lv1.Children.forEach(lv2=>{
            if(checked.indexOf(''+lv2.FunctionId)>-1) lv2.checked = true;
            lv2.Children.forEach(lv3=>{
              if(checked.indexOf(''+lv3.FunctionId)>-1) lv3.checked = true;
            })
          })
        })
      }
      this.setState({
        functions: Immutable.fromJS(funs)
      })
    })
  }
  handleLv1Click(fun, index, el) {
    const checked = !fun.get('checked');
    const funs = this.state.functions.update(index,item=>{
      return item.update('checked',val=>checked).update('Children',children=>{
        return children.map(lv2=>{
          return lv2.update('checked', val=>checked).update('Children', lv3Items=>{
            return lv3Items.map(lv3=>lv3.update('checked',val=>checked))
          })
        })
      })
    })
    this.setState({functions: funs},this.handleChange)
  }
  handleLv2Click(fun, index, index2, el) {
    const checked = !fun.get('checked');
    const funs = this.state.functions.update(index,item=>{
      return item.update('checked',val=>checked || val).update('Children',children=>{
        return children.update(index2, item2=>{
          return item2.update('checked', val=>checked).update('Children', lv3Items=>{
            return lv3Items.map(lv3=>lv3.update('checked',val=>checked))
          })
        })
      })
    })
    this.setState({functions: funs},this.handleChange)
    
  }
  handleLv3Click(fun, index, index2, index3, el) {
    const checked = !fun.get('checked');
    const funs = this.state.functions.update(index,item=>{
      return item.update('checked',val=>checked || val).update('Children',children=>{
        return children.update(index2, item2=>{
          return item2.update('checked', val=>checked || val).update('Children', lv3Items=>{
            return lv3Items.update(index3, item3=> item3.update('checked',val=>checked))
          })
        })
      })
    })
    this.setState({functions: funs},this.handleChange)
  }
  render() {
    if(this.state.functions.size<1) return <Spin/>
    const s1 = {
      lineHeight: '35px',
      padding: '0 12px',
      background: "#1890ff"
    };
    const s2 = {
      lineHeight: '35px',
      padding: '0 24px',
      borderBottom: "1px solid #ccc"
    };
   
    return (
      <Card bordered={true} style={{padding:'0' }}>
        <div style={{margin: '-24px'}}>
          {this.state.functions.map((fun, lv1Index)=>{
            return(
              <div  key={fun.get('Id')}>
                <div style={s1}><Checkbox checked={fun.get('checked')} onClick={e=>{this.handleLv1Click(fun,lv1Index)}}>{fun.get('FunctionName')}</Checkbox></div>
                {fun.get('Children').map((fun2,lv2Index)=>{
                  return (
                    <Row style={s2} key={fun2.get('Id')}>
                      <Col span="6">
                        <Checkbox checked={fun2.get('checked')} onClick={e=>{this.handleLv2Click(fun2,lv1Index,lv2Index)}} >{fun2.get('FunctionName')}</Checkbox>
                      </Col>
                      <Col span="18">
                        {fun2.get('Children').map((fun3,lv3Index)=>{
                          return <Checkbox key={fun3.get('Id')} onClick={e=>{this.handleLv3Click(fun3,lv1Index,lv2Index,lv3Index)}} style={{marginLeft:'8px'}} checked={fun3.get('checked')}>{fun3.get('FunctionName')}</Checkbox>
                        })}
                      </Col>
                    </Row>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Card>
    );
  }
}

export default Power;
