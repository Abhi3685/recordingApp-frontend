import React from 'react'
import ReactPlayer from 'react-player'

function formatTime(secs) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")
}

export default class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            current: 0,
            duration: 5
        };

        this.startInterval = this.startInterval.bind(this);
    }

    startInterval() {
        var interval = setInterval(() => {
            this.setState({
                current: this.state.current + 1,
                duration: this.state.duration
            });
            if (this.state.current === this.state.duration) clearInterval(interval);
        }, 1000);
    }

    render() {
        return (
            <>
                <div onContextMenu={(e) => e.preventDefault()}>
                    <ReactPlayer url='http://localhost:8000/video'
                        playing={true}
                        onEnded={() => alert('Video Ended!')}
                        onStart={this.startInterval} />
                </div>
                <span>{formatTime(this.state.current)} / {formatTime(this.state.duration)}</span>
            </>
        )
    }
}
