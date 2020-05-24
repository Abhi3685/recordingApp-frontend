import React, { useState, useEffect } from 'react'
// import VideoPlayer from 'react-video-js-player';
import InputRange from 'react-input-range';

import 'react-input-range/lib/css/index.css';

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export default function Test() {
    var state = {
        video: {
            src: "https://res.cloudinary.com/dhhtvk50h/video/upload/demo_itvxc9.mp4",
            poster: "https://res.cloudinary.com/dhhtvk50h/video/upload/demo_itvxc9.jpg"
        }
    }
    const [value, setValue] = useState({ min: 0, max: 10 });
    var flag = false;

    function ontimeupdate() {
        var vid = document.querySelector("video");
        if (vid.currentTime >= value.min && !flag) {
            flag = true;
            vid.currentTime = value.max;
        }
    }

    return (
        <div>
            <video
                className="mt-10 ml-10"
                controls={true}
                src={state.video.src}
                poster={state.video.poster}
                width="720"
                height="420"
                onTimeUpdate={ontimeupdate}
            />

            <div className="mt-10 mx-10">
                <InputRange
                    maxValue={10}
                    minValue={0}
                    formatLabel={value => ``}
                    step={.01}
                    value={value}
                    onChange={value => {
                        var min = round(value.min, 2);
                        var max = round(value.max, 2);
                        setValue({ min, max });
                    }} />

                Start Time <span className="ml-20"> &nbsp;End Time</span><br />
                <input className="rounded bg-gray-300 w-32 px-5 py-2" value={value.min} readOnly />
                <input className="rounded bg-gray-300 w-32 px-5 py-2 ml-8" value={value.max} readOnly />
            </div>
        </div>
    )
}
