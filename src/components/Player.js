import React from 'react'
import ReactPlayer from 'react-player'

export default function Player() {
    return (
        <div>
            <ReactPlayer url='http://localhost:8000/video' playing controls />
        </div>
    )
}
