/**
 * Created by wanchao on 2018/5/14.
 */
import React from 'react';
import {
    Pagination,
    Button,
    Icon
} from 'antd';
import VideoItem from '@/erp/container/videos/VideoItem.js';
import { getListData } from '@/erp/api'

const limit = 12;

class Column extends React.Component {
    constructor(props) {
        super(props);
        this.getVideosList = this.getVideosList.bind(this);
        this.back = this.back.bind(this);
    }

    state = {
        videos: [],
        total: 0,
        column: '',
        defaultCurrent: 1
    };

    // 获取视频列表
    async getVideosList (page = 1) {
        const { match: { params: { id } } } = this.props;
        const offset = (page - 1) * limit;
        const { status, data } = await getListData(`column/videos/@/erp{id}?limit=@/erp{limit}&offset=@/erp{offset}`);

        if(status) {
            const { list, column, total } = data;

            this.setState({
                videos: list,
                column,
                total,
                defaultCurrent: page
            });
        }
    }

    back () {
        this.props.history.go(-1)
    }

    componentDidMount () {
        this.getVideosList();
    }

    render () {
        const { column, videos, total, defaultCurrent } = this.state;

        return (
            <div className="finance-column">
                <div className="column-item">
                    <h2>
                        {column}
                        <Button type="primary" size="small" className="btn-back" onClick={this.back}>
                            <Icon type="left" />返回
                        </Button>
                    </h2>
                    <div className="video-list">
                        {
                            videos.map(video => <VideoItem key={video._id} video={video}/>)
                        }
                    </div>
                </div>
                <div className="paginator">
                    <Pagination total={total} pageSize={limit} onChange={this.getVideosList} current={defaultCurrent}/>
                </div>
            </div>
        )
    }
}

export default Column;