import React, { Component } from 'react'
import { Button } from 'antd'

class MainChild extends Component {
  constructor(props) {
    super(props)
  }
  modify(item) {
    console.log(this.props, 'item')
    this.props.onModify && this.props.onModify(item)
  }
  deleteItem(id) {
    console.log(this.props, 'id')
    this.props.onDelete && this.props.onDelete(id)
  }
  render() {
    const item = this.props.item
    const styleCom = {borderBottom: '1px solid #fff', height: '40px', lineHeight: '40px'}
    const frStyle = {paddingLeft: '50px'}
    console.log(item, 'item')
    return (
      <div key={item.Id} style={styleCom}>
        <span>Id: {item.Id} </span>
        <i className={item.Icon}></i>
        {(item.isShow) && <span>- Key: {item.FunctionKey}</span>}
        <span>{item.FunctionName}- 排序：{item.Rank}</span>
        <span style={frStyle}>
          <Button style={{marginRight: '20px'}} size="small" onClick={this.modify.bind(this, item)}>修改</Button>
          <Button size="small" onClick={this.deleteItem.bind(this, item.Id)}>删除</Button>
        </span>
      </div>
    )
  }
}

class Main extends Component {
  constructor(props) {
    super(props);
  }

  modify(item) {
    console.log(this.props, 'Main')
    this.props.onModify && this.props.onModify(item)
  }

  deleteItem(id) {
    this.props.onDelete && this.props.onDelete(id)
  }

  render() {
    console.log(this.props, 'props')
    const styleCom = {borderBottom: '1px solid #fff', height: '40px', lineHeight: '40px'}
    const frStyle = {paddingLeft: '50px'}
    const clearStyle = {listStyle: 'none'}
    const titleStyle = {height: '50px', lineHeight: '50px', background: '#303f4a', fontSize: '20px', padding: '0 10px', marginTop: '10px', color: '#fff'}
    return (
      <div>
        <div style={titleStyle}>{this.props.title}</div>
        <ul style={clearStyle}>
          {this.props.data.map((item1v1, lv1Index) => {
            return (
              <li key={item1v1.Id}>
                <MainChild item={item1v1} stye={styleCom} isShow={false} onModify={this.modify.bind(this)} onDelete={this.deleteItem.bind(this)}/>
                <ul style={clearStyle}>
                  {item1v1.Children.map((item1v2, lv2Index) => {
                    return (
                      <li key={item1v2.Id}>
                        <MainChild item={item1v2} stye={styleCom} isShow={true} onModify={this.modify.bind(this)} onDelete={this.deleteItem.bind(this)}/>
                        <ul style={clearStyle}>
                          {item1v2.Children.map((item1v3, lv3Index) => {
                            return (
                              <div key={item1v3.Id} style={styleCom}>
                                <span>{item1v3.Id} - {item1v3.FunctionName} - {item1v3.FunctionKey}</span>
                                <span style={frStyle}>
                                  <Button style={{marginRight: '20px'}} size="small" onClick={this.modify.bind(this, item1v3)}>修改</Button>
                                  <Button style={{marginRight: '20px'}} size="small" onClick={this.deleteItem.bind(this, item1v3.Id)}>删除</Button>
                                </span>
                              </div>
                            )
                          })}
                        </ul>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Main
