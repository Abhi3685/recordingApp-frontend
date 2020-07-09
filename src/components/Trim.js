import React, { useState, useEffect, useRef } from 'react'
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { useLocation, useHistory } from 'react-router-dom';
import Axios from 'axios';
import { db } from '../firebase';
import Navbar from './Navbar';
import DesignElement4 from '../assets/images/DesignElement4.png';

import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';

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
            min: Math.round(location.state.duration * 0.4, 2),
            max: Math.round(location.state.duration - (location.state.duration * 0.4), 2)
        });

        var duration = Math.round(location.state.duration);
        var increment = duration / 10;
        var curr = 0.1;
        video.currentTime = curr;

        video.onseeked = () => {
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            var img = document.querySelector(".thumb-" + (++thumbCount));
            img.src = canvas.toDataURL();
            curr += increment;
            if (curr <= duration) video.currentTime = curr;
            else document.querySelector(".loader").style.display = 'none';
        }
        document.querySelector(".loader").style.display = 'none';
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
            <div className="fixed left-0 overflow-y-auto right-0 bottom-0 top-0" style={{ backgroundColor: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 p-3 w-32" />
                <img src={DesignElement4} alt="" className="absolute right-0 p-3 w-32" style={{ top: 75 }} />

                <div className="bg-white editorWrapper relative mt-5 mx-auto rounded px-5 pb-8 flex flex-col" style={{ width: '96%' }}>
                    <div className="flex flex-1 editorTopWrapper items-center py-5 mt-5 rounded-lg" style={{ backgroundColor: "rgba(90, 103, 217, 0.2)" }}>
                        <div className="flex-1">
                            <div className="w-9/12 trimPlayerWrapper mx-auto">
                                <Player src={location.state.url}>
                                    <BigPlayButton position="center" />
                                    <LoadingSpinner />
                                    <ControlBar autoHide={false} />
                                </Player>
                            </div>
                        </div>
                        <div className="text-center trimControls font-montserratSemiBold mr-16 my-16 flex flex-col items-center justify-between" style={{ width: '30%' }}>
                            <div className="trimControlsUpper">
                                <p className="text-lg trim-text mb-4">Cut from, sec: </p>
                                <div className="mb-10 trim-inputs">
                                    <input id="startTime" className="bg-transparent rounded trim-start-input border border-indigo-600 w-32 px-4 py-2" value={value.min} readOnly />
                                    <span className="text-lg trim-input-separator mx-2 sm:mx-5">to</span>
                                    <input id="endTime" className="bg-transparent rounded trim-end-input border border-indigo-600 w-32 px-4 py-2" value={value.max} readOnly />
                                </div>
                            </div>
                            <div className="trimButtonsWrapper">
                                <button onClick={() => apply(location.state.url, round(location.state.duration, 2), location.state.index)} className="trimApplyBtn bg-indigo-600 text-white py-2 mb-3 rounded w-64">Apply Changes</button>
                                <button onClick={() => history.goBack()} className="trimBackBtn bg-indigo-600 text-white py-2 rounded w-64">Return to Dashboard</button>
                            </div>
                        </div>
                    </div>

                    <div className="timeline_wrapper relative mt-5" style={{}}>
                        <div style={{ height: 120 }} className="timeline_thumb_Wrapper">
                            <img alt="" className="inline-block thumb-1 rounded-l-lg" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-2" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-3" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-4" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-5" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-6" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-7" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-8" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-9" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-10 rounded-r-lg" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        </div>
                        <div style={{ position: 'absolute', top: 52, left: 40, right: 40 }} className="timeline_range_wrapper">
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
