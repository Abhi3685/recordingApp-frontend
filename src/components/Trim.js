import React, { useState, useEffect } from 'react'
import InputRange from 'react-input-range';
import ReactPlayer from 'react-player'
import 'react-input-range/lib/css/index.css';
import './custom.css';
import { useLocation, useHistory } from 'react-router-dom';
import Axios from 'axios';
import { db } from '../firebase';

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export default function Trim() {
    const location = useLocation();
    const history = useHistory();
    const min = (0 + location.state.duration * 0.3);
    const max = (location.state.duration - location.state.duration * 0.3);
    const [value, setValue] = useState({ min: Math.round(min, 2), max: Math.round(max, 2) });

    useEffect(() => {
        const canvas = document.querySelector("canvas");
        const video = document.getElementById("hiddenPlayer");
        var thumbCount = 0;

        var duration = Math.round(location.state.duration);
        var increment = duration / 10;
        var curr = increment;
        video.currentTime = curr;

        video.onseeked = () => {
            console.log(video.currentTime);
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            var img = document.querySelector(".thumb-" + (++thumbCount));
            img.src = canvas.toDataURL();
            curr += increment;
            if (curr <= duration) video.currentTime = curr;
        }
    }, [location.state.duration]);

    function onProgress() {
        var vid = document.querySelector("video");
        var min = document.getElementById("startTime").value;
        var max = document.getElementById("endTime").value;
        if (vid.currentTime > min && vid.currentTime < max) {
            vid.currentTime = max;
        }
    }

    function onSeek(seconds) {
        var vid = document.querySelector("video");
        var min = document.getElementById("startTime").value;
        var max = document.getElementById("endTime").value;
        if (seconds > min && seconds < max) {
            vid.currentTime = max;
        }
    }

    function apply(url, duration, index) {
        var min = document.getElementById("startTime").value;
        var max = document.getElementById("endTime").value;
        var statusRef = document.getElementById("status_msg");
        statusRef.style.display = 'block';
        Axios.post('http://localhost:8000/trim', {
            userId: localStorage.getItem("UUID"),
            lowerLimit: min,
            upperLimit: max,
            duration,
            url,
            pid: location.state.publicId
        }).then(res => {
            if (res.data.code && res.data.code === "Success") {
                db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
                    var userVids = doc.data().videos;
                    var name = doc.data().name;
                    userVids[index].duration = res.data.duration;
                    userVids[index].url = res.data.secure_url.substr(0, res.data.secure_url.length - 3) + 'mp4';
                    userVids[index].thumb = res.data.secure_url.substr(0, res.data.secure_url.length - 3) + 'jpg';

                    db.collection('users').doc(localStorage.getItem("UUID")).set({
                        name,
                        videos: userVids
                    }).then(() => {
                        setTimeout(() => { history.push('/'); }, 2500);
                        statusRef.innerHTML = 'Processing Status: Trimmed Successfully! Redirecting to dashboard!';
                    });
                });
            } else {
                alert('Error: Unhandled Exception Occured!');
                console.log(res);
            }
        });
    }

    return (
        <>
            <ReactPlayer
                controls
                className="mt-5 ml-10"
                progressInterval={0.01}
                onProgress={onProgress}
                onSeek={onSeek}
                width="720px"
                height="400px"
                url={location.state.url}
            />

            <video crossOrigin="anonymous" id="hiddenPlayer" hidden src={location.state.url}></video>
            <canvas hidden width="720" height="480"></canvas>

            <div className="mt-10 mx-10">
                <h2 className="mb-2 text-lg">Select the duration to trim (remove) from recorded clip</h2>

                <div className="timeline_wrapper relative">
                    <div className="timeline_thumb_Wrapper">
                        <img alt="Thumbnail" className="inline-block thumb-1" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-2" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-3" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-4" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-5" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-6" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-7" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-8" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-9" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        <img alt="Thumbnail" className="inline-block thumb-10" style={{ width: '100px', height: '75px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                    </div>
                    <div className="timeline_range_wrapper" style={{ width: '1000px', position: 'absolute', top: 32 }}>
                        <InputRange
                            maxValue={round(location.state.duration, 2)}
                            minValue={0}
                            formatLabel={value => ``}
                            step={.01}
                            value={value}
                            onChange={value => {
                                if (value.min < 0) value.min = 0;
                                if (value.max > location.state.duration) value.max = location.state.duration;
                                var min = round(value.min, 2);
                                var max = round(value.max, 2);
                                setValue({ min, max });
                            }} />
                    </div>
                </div>

                <div className="mt-3">
                    <p className="mb-2">Cut duration: </p>
                    <input id="startTime" className="rounded bg-gray-300 w-32 px-5 py-2" value={value.min} readOnly />
                    <span className="ml-2 mr-2">to</span>
                    <input id="endTime" className="rounded bg-gray-300 w-32 px-5 py-2" value={value.max} readOnly />
                    <button onClick={() => apply(location.state.url, location.state.duration, location.state.index)} className="bg-indigo-600 text-white px-8 py-2 rounded w-64 ml-40">Apply Changes</button>

                    <p id="status_msg" style={{ display: 'none' }} className="mt-10 text-xl text-yellow-700 ml-20">Processing Status: Please wait ... We are processing your video.</p>
                </div>
            </div>
        </>
    )
}
