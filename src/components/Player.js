import React from 'react'
import { useParams } from 'react-router-dom'
import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';

export default function CustomPlayer() {
    let { videoId } = useParams();

    return (
        <div className="flex bg-gray-500 h-screen items-center">
            <div className="w-4/6 mx-auto rounded shadow-lg">
                <Player
                    poster={"https://res.cloudinary.com/dhhtvk50h/video/upload/" + videoId + ".jpg"}
                    src={"https://res.cloudinary.com/dhhtvk50h/video/upload/" + videoId + ".mp4"}
                >
                    <BigPlayButton position="center" />
                    <LoadingSpinner />
                    <ControlBar autoHide={false} />
                </Player>
            </div>
        </div>
    )
}
