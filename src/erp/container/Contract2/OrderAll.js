import React, { Component } from 'react'
import { Spin } from 'antd'
import { getListData } from '@/erp/api'
import ContractDetail from '@/erp/component/ContractDetail'
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
        this.onSearch = this.onSearch.bind(this);
    }
    onSearch() {
        getListData('orderAndOrderItems/' + this.props.companyId ).then(res => {
            if (res.status) {
                this.setState({
                    data: res.data,
                });
            }
        }, err => {
            this.setState({
                loading: false
            });
        })
    }
    componentWillMount() {
        this.onSearch();
    }

    render() {
        if(!this.state.data) return <Spin/>

        return (
            <div>
                {this.state.data.map(item=>{
                    return <ContractDetail key={item.OrderId} data={item}/>
                })}
            </div>
        )
    }
}

export default Main
