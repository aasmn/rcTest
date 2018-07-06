/**
 * Created by wanchao on 2018/5/14.
 */
import  React from 'react';
import PropTypes from 'prop-types';
import {
    Link
} from 'react-router-dom';
import {
    Icon
} from 'antd';

/*
 *  将服务器地址改为cdn地址
 * */
function cdnReplace (url) {
    if(!url){
        return '';
    }

    const CDN_MAP = ['https://pilipa-ml.oss-cn-beijing.aliyuncs.com', 'https://pilipa-assets.oss-cn-beijing.aliyuncs.com'];
    const REPLACE_CDN_MAP = ['https://ml-img.pilipa.cn', 'https://assets.pilipa.cn'];

    for (let [index,cdn] of CDN_MAP.entries()) {
        if(url.includes(cdn)){
            url = url.replace(new RegExp(cdn, 'g'), REPLACE_CDN_MAP[index]);
            return url;
        }
    }

    return url;
}

class Video extends React.Component {
    static propTypes = {
        video: PropTypes.object.isRequired
    };

    render () {
        if(!this.props.video){
            return null;
        }

        const { name , cover, _id } = this.props.video;
        const cdnCover = cdnReplace(cover);

        return (
            <div className="video-item">
                <Link to={`/main/video/@/erp{_id}`}>
                    <h3 title={name}>{name}</h3>
                    <Icon className="i-play" type="play-circle-o" />
                    <img src={cdnCover} alt="video img"/>
                </Link>
            </div>
        )
    }
}

export default Video;