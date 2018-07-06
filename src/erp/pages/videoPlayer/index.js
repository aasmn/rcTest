/**
 * Created by wanchao on 2018/5/14.
 */
import React from 'react';
import moment from 'moment';
import { Button, Icon } from 'antd';
import VideoPlayer from '@/erp/container/videos/VideoPlayer.js';
import { getListData } from '@/erp/api'

class Videos extends React.Component {
    constructor(props) {
        super(props);
        this.getVideoDetail = this.getVideoDetail.bind(this);
        this.back = this.back.bind(this);
    }

    state = {
        video: null,
        next: []
    };

    // 获取视频详情
    async getVideoDetail () {
        const { match: { params: { id } } } = this.props;
        const { status, data } = await getListData(`videos/@/erp{id}`);

        if(status && data) {
            const { video, next } = data;
            this.setState({
                video,
                next
            });
        }
    }

    back () {
        this.props.history.go(-1)
    }

    componentDidMount () {
        this.getVideoDetail();
    }

    render () {
        const { video, next } = this.state;

        return video ? (
            <div className="video-detail">
                <div className="video-container">
                    {
                        video.src ? <VideoPlayer video={video} next={next}/> : null
                    }
                </div>
                <div className="video-info">
                    <h3 className="btn-back">
                        <span>{video.name}</span>
                        <Button type="primary" size="small" onClick={this.back}>
                            <Icon type="left" />返回
                        </Button>
                    </h3>
                    <p>
                        【{video.column.name}】
                    </p>
                    <h3>
                        课程概述
                    </h3>
                    <p>
                        {video.desc}
                    </p>
                    <p>
                        上传时间：{ moment(video.updated).local().format('YYYY-MM-DD HH:mm:ss') }
                    </p>
                </div>
            </div>
        ) : null;
    }
}

export default Videos;
