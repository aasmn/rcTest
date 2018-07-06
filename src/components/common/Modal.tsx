import { Modal } from 'antd'
import React, { ReactNode } from 'react'
import { render } from 'react-dom'
interface MyOption {
  confirm?: () => any
  cancel?: () => any
  title?: string | ReactNode
  zIndex?: number
  mask?: boolean
  width?: number
  onOk?: () => void
  onCancel?: () => void
  okText?: string
  cancelText?: string
  maskClosable?: boolean
  content?: JSX.Element
  footer?: string | ReactNode
}
class CustomModal implements MyOption {
  private static firstLoad: boolean = false
  public visible: boolean = true
  public zIndex = 1000
  public el = document.createElement('div')
  public onOk: () => void
  public onCancel: () => void
  public mask = true
  public width = 520
  public okText = '确定'
  public cancelText = '取消'
  public maskClosable = true
  public title: string | ReactNode = undefined
  public content = <div>暂无</div>
  public footer: string | ReactNode = undefined
  constructor (option: MyOption) {
    document.body.appendChild(this.el)
    this.visible = true
    this.onOk = option.onOk || null
    this.onCancel = option.onCancel || null
    this.title = option.title === undefined ? '系统提醒' : option.title
    this.zIndex = option.zIndex || this.zIndex
    this.mask = option.mask !== undefined ? option.mask : !CustomModal.firstLoad
    this.width = option.width || this.width
    this.okText = option.okText || this.okText
    this.cancelText = option.cancelText || this.cancelText
    this.maskClosable = option.maskClosable !== undefined ? option.maskClosable : this.maskClosable
    this.content = option.content || this.content
    this.footer = option.footer
    if (CustomModal.firstLoad === false) {
      CustomModal.firstLoad = true
    }
    this.render()
  }
  public hide () {
    this.visible = false
    this.render()
    setTimeout(() => {
      render(<div></div>, this.el)
      document.body.removeChild(this.el)
    }, 1000)
  }
  public render () {
    render(
      <Modal
        okText={this.okText}
        cancelText={this.cancelText}
        maskClosable={this.maskClosable}
        mask={this.mask}
        width={this.width}
        title={this.title}
        visible={this.visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        zIndex={this.zIndex}
        footer={this.footer}
      >
        <div>{this.content}</div>
      </Modal>,
      this.el
    )
  }
}
export default {
  show (option: MyOption) {
    option = option || {}
    const modal = new CustomModal(option)
    return modal
  }
}
