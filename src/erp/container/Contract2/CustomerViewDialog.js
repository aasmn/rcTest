import React from 'react'
import { Tabs} from 'antd'
import { getListData } from '@/erp/api'
import CompanyInfo from '@/erp/container/Contract/CompanyInfo'
import ViewCustomer from '@/erp/container/Contract/ViewCustomer'

import _ from 'lodash'

import Dialog from '@/erp/container/Dialog'
import ChangeWarning from '@/erp/container/Contract/ChangeWarning'


// const TabPane = Tabs.TabPane;

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            companyInfo: {},
            activeKey: "1"
        }

        this.getCompanyInfo = this.getCompanyInfo.bind(this);
        this.getCompanyInfo();
    }
    getCompanyInfo() {
        getListData('customerdetail/' + this.props.data.CustomerId).then(res => {
            res.data = _.extend(res.data, this.props.row);
            this.setState({
                companyInfo: res.data
            })
        })
    }


    render() {
        return (
            <div style={this.props.style} className="company-dialog">
                <CompanyInfo data={this.state.companyInfo} type="signed" onAction={this.onAction} />
                <ViewCustomer data={this.state.companyInfo} />
            </div>
        );
    }
}

export default Main
