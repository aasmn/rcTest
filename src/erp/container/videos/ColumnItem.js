/**
 * Created by wanchao on 2018/5/14.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Link
} from 'react-router-dom';
import {
    Icon
} from 'antd';
import VideoItem from './VideoItem';

class Video extends React.Component {

    static propTypes = {
        column: PropTypes.object.isRequired
    };

    render () {
        const { column } = this.props;

        const { _id, name, videos } = column;

        return (
            <div className="column-item">
                <div key={_id}>
                    <h2>
                        { name }
                        <Link className="more" to={`/main/column/@/erp{_id}`}>
                            <Icon type="double-right" />
                        </Link>
                    </h2>
                    <div className="video-list">
                        {
                            videos.map((video, i) => (<VideoItem key={i} video={video} />))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Video;