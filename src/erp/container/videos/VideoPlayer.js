/**
 * Created by mochao on 2018/5/15.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Link
} from 'react-router-dom';
import {
    Button,
    Icon
} from 'antd';
import {
    Player,
    LoadingSpinner,
    BigPlayButton
} from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css";

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.videoStateChange = this.videoStateChange.bind(this);
        this.replay = this.replay.bind(this);
        this.next = this.next.bind(this);
    }

    state = {
        player: {}
    };

    static propTypes = {
        video: PropTypes.object.isRequired
    };

    videoStateChange (state, prevState) {
        // copy player state to this component's state
        this.setState({
            player: state
        });
    }

    replay () {
        this.refs.player.seek(0);
        this.refs.player.play();
    }

    next () {
        window.location.reload(true);
    }

    componentDidMount() {
        this.refs.player.subscribeToStateChange(this.videoStateChange);
    }

    render () {
        const { video, next } = this.props;
        const { player } = this.state;

        return (
            <div className="player">
                <Player
                    ref="player"
                    src={video.src}
                >
                    <BigPlayButton position="center"/>
                    <LoadingSpinner />
                </Player>

                {
                    player.ended ? (
                        <div className="video-next">
                            {
                                next === null ? null : (
                                    <div className="next">
                                        <p>下一节视频: { next.name }</p>
                                        <Link to={`/main/video/@/erp{next._id}`} onClick={this.next}>
                                            <Button type="primary">下一节</Button>
                                        </Link>
                                    </div>
                                )
                            }
                            <p onClick={this.replay}>
                                <Icon type="reload" /> 重新播放
                            </p>
                        </div>
                    ) : null
                }
            </div>
        )
    }
}

export default VideoPlayer;