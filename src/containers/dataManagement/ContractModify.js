import React from 'react'
import ContractInfo from '@/containers/dataManagement/ContractForm'
import PayInfo from '@/containers/dataManagement/PayInfo'
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: null
    }
  }
  render () {
    return (
      <div>
        <ContractInfo />
        <div style={{marginTop: '20px'}}>
          <PayInfo />
        </div>
      </div>
    )
  }
}
export default Main
