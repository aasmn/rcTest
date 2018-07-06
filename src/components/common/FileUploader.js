import { Button } from 'antd'
import classNames from 'classnames'
import { notification } from 'pilipa'
import React from 'react'
import PropTypes from 'prop-types'
import fileUploader from '@/utils/fileUploader'
import styles from '@/stylus/file.uploader'
class FileUploader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      path: props.path
    }
  }
  componentDidMount () {
    if (this.state.path) {
      this.imageToView()
    }
  }
  imageToView () {
    const $image = $(this.refs.image)
    $image.viewer({
      show: function () {
        const that = this
        $('.viewer-canvas').on('click', function (e) {
          if (e.target.tagName.toUpperCase() !== 'IMG') {
            $(that).viewer('hide')
          }
        })
      }
    })
  }
  upload () {
    const $el = $('<input type="file">')
    $('body').append($el)
    $el.trigger('click')
    $el.change((event) => {
      const file = event.target.files[0]
      if (!/image\/(\w)*/.test(file.type)) {
        notification.warning({
          message: '格式不符!'
        })
        return
      }
      fileUploader(file).then(res => {
        const path = res.data.path
        this.setState({
          path
        })
        this.imageToView()
        if (this.props.uploaded) {
          this.props.uploaded([path])
        }
      })
      $el.remove()
    })
  }
  render () {
    return (
      <div className={styles.uploader}>
        { this.state.path && <img src={this.state.path} ref='image' /> }
        <Button size="small" onClick={this.upload.bind(this)}>上传图片</Button>
      </div>
    )
  }
}
FileUploader.propTypes = {
  path: PropTypes.string,
  uploaded: PropTypes.func
}
export default FileUploader
