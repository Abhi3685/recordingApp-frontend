import React from 'react'
import { useParams } from 'react-router-dom'

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

export default function Player() {
    let { videoId } = useParams();
    console.log(formatTime(874));

    return (
        <div className="flex bg-gray-500 h-screen items-center">
            <video className="rounded shadow-lg mx-auto" width="75%" poster={"https://res.cloudinary.com/dhhtvk50h/video/upload/" + videoId + ".jpg"} src={"https://res.cloudinary.com/dhhtvk50h/video/upload/" + videoId + ".mp4"} controls></video>
        </div>
    )
}
