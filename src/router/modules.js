import React from 'react'
import Bundle from '@/components/common/Bundle'
import * as loadFile from './load-file'
const modules = {}
for (var key in loadFile) {
  if (key) {
    ((k) => {
      let Component = (props) => {
        return (
          <Bundle load={loadFile[k]}>
            {(Component) => <Component {...props}/>}
          </Bundle>
        )
      }
      modules[k.replace('load', '')] = Component
    })(key)
  }
}
export default modules
