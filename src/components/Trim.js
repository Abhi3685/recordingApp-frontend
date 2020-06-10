import React, { useState, useEffect, useRef } from 'react'
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
    const [value, setValue] = useState({ min: 0, max: 0 });

    const willMount = useRef(true);

    if (willMount.current) {
        if (!location.state) history.goBack();
        willMount.current = false;
    }

    useEffect(() => {
        const canvas = document.querySelector("canvas");
        const video = document.getElementById("hiddenPlayer");
        var thumbCount = 0;

        setValue({
            min: Math.round(location.state.duration * 0.3, 2),
            max: Math.round(location.state.duration - (location.state.duration * 0.3), 2)
        });

        var duration = Math.round(location.state.duration);
        var increment = duration / 10;
        var curr = 0.1;
        video.currentTime = curr;

        video.onseeked = () => {
            // console.log(video.currentTime);
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            var img = document.querySelector(".thumb-" + (++thumbCount));
            img.src = canvas.toDataURL();
            curr += increment;
            if (curr <= duration) video.currentTime = curr;
            else document.querySelector(".loader").style.display = 'none';
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

        if (min == 0 && max == duration) {
            alert("Warning: Can't Trim Full Video.");
            return;
        }

        document.querySelector(".loader").style.display = 'block';
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
                    userVids[index].duration = res.data.duration;
                    userVids[index].publicId = res.data.public_id;
                    userVids[index].url = res.data.secure_url.substr(0, res.data.secure_url.length - 3) + 'mp4';
                    userVids[index].thumb = res.data.secure_url.substr(0, res.data.secure_url.length - 3) + 'jpg';

                    db.collection('users').doc(localStorage.getItem("UUID")).set({
                        fullname: doc.data().fullname,
                        videos: userVids,
                        pages: doc.data().pages
                    }).then(() => {
                        history.push('/');
                    });
                });
            } else {
                alert('Error: Unhandled Exception Occured!');
                console.log(res);
            }
        }).catch(err => {
            document.querySelector(".loader").style.display = 'none';
            alert("Unknown Error Occured! Check log for details.");
            console.log(err);
        });
    }

    return (
        <>
            <div className="flex flex-col h-screen justify-end">
                <div style={{ width: '1530px', minWidth: '1530px' }} className="upperWrapper flex-1 bg-gray-300">
                    <div className="playerWrapper flex items-center h-full" style={{ width: '70%', float: 'left' }}>
                        <ReactPlayer
                            controls
                            className="mx-auto"
                            progressInterval={0.01}
                            onProgress={onProgress}
                            onSeek={onSeek}
                            width="720px"
                            height="400px"
                            url={location.state.url}
                        />
                    </div>
                    <div className="bg-gray-800 h-full flex items-center" style={{ width: '30%', float: 'left' }}>
                        <div className="text-gray-400 text-center">
                            <p className="mb-5 text-lg">Cut from, sec: </p>
                            <input id="startTime" className="bg-transparent rounded border border-gray-200 w-32 px-4 py-2" value={value.min} readOnly />
                            <span className="text-lg mx-5">to</span>
                            <input id="endTime" className="bg-transparent rounded border border-gray-200 w-32 px-4 py-2" value={value.max} readOnly />

                            <button onClick={() => apply(location.state.url, round(location.state.duration, 2), location.state.index)} className="my-10 bg-indigo-600 text-white py-2 rounded w-48">Apply Changes</button>
                        </div>
                    </div>
                </div>
                <div style={{ width: '1530px', minWidth: '1530px' }} className="lowerWrapper flex items-center h-40 bg-gray-500">
                    <div className="timeline_wrapper relative">
                        <div style={{ width: '1400px', minWidth: '1400px', marginLeft: 65 }} className="timeline_thumb_Wrapper">
                            <img alt="Thumbnail" className="inline-block thumb-1" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-2" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-3" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-4" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-5" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-6" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-7" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-8" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-9" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="Thumbnail" className="inline-block thumb-10" style={{ width: '140px', height: '100px' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        </div>
                        <div style={{ position: 'absolute', top: 32, left: 65, right: 0 }} className="timeline_range_wrapper">
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
                </div>
            </div>
            <video crossOrigin="anonymous" id="hiddenPlayer" hidden src={location.state.url}></video>
            <canvas hidden width="720" height="480"></canvas>
            <div className="loader absolute inset-0 bg-red-100 z-50">
                <div className="flex flex-col text-3xl h-screen items-center justify-center text-center">
                    <p className="tracking-widest">Processing ...</p>
                    <p className="tracking-widest">Please Wait :)</p>
                </div>
            </div>
        </>
    )
}
