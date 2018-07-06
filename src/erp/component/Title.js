import React from 'react'
import style from '@/erp/config/style'
import _ from 'lodash'

const Title = function(props){
  const s = _.extend({
    background: style.bgColorPrimary,
    color: '#fff',
    lineHeight: '32px',
    fontSize:'14px',
    padding: '0 12px',
    cursor: 'pointer',
    overflow: 'hidden'
  }, props.style)
  return (<div style={s} onClick={props.onClick}><span style={{ ...s, float: 'left' }}>{props.preon}</span> {props.title} <span style={{...s,float:'right'}}>{props.addon}</span></div>)
}

export default Title;
