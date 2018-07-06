/**
 * Created by wanchao on 2018/5/14.
 */
import React from 'react';
import ColumnItem from '@/erp/container/videos/ColumnItem.js';
import { getListData } from '@/erp/api'

class Videos extends React.Component {
    constructor(props) {
        super(props);
        this.getVideosList = this.getVideosList.bind(this);
    }

    state = {
        columns: []
    };

    // 获取视频列表
    async getVideosList () {
        const { status, data } = await getListData('column/videos?limit=4&origin=erp');

        if(status && Array.isArray(data)) {
            this.setState({
                columns: data
            });
        }
    }

    componentDidMount () {
        this.getVideosList();
    }

    render () {
        const { columns } = this.state;

        return (
            <div className="finance-column">
                {
                    columns.map(column => <ColumnItem key={column._id} column={column}/>)
                }
            </div>
        )
    }
}

export default Videos;