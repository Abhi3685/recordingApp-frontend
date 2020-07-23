import React, { useState, useEffect, useRef } from 'react'
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { useLocation, useHistory } from 'react-router-dom';
import Axios from 'axios';
import ReactPlayer from 'react-player';

import { db } from '../firebase';
import Navbar from './Navbar';
import DesignElement4 from '../assets/images/DesignElement4.png';
import loader from '../assets/images/loader.gif';
import processingGIF from '../assets/images/processing.gif';

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export default function Trim() {
    const location = useLocation();
    const history = useHistory();
    const [value, setValue] = useState({ min: 0, max: 0 });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

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
            else setLoading(false);
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

        setProcessing(true);
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
                    var videoUrl = res.data.secure_url;
                    var parts = videoUrl.split("/");
                    parts.splice(-2, 1);
                    videoUrl = parts.join("/");

                    var userVids = doc.data().videos;
                    userVids[index].duration = res.data.duration;
                    userVids[index].publicId = res.data.public_id;
                    userVids[index].url = videoUrl;
                    userVids[index].thumb = videoUrl.substr(0, videoUrl.length - 3) + 'jpg';

                    db.collection('users').doc(localStorage.getItem("UUID")).set({
                        fullname: doc.data().fullname,
                        videos: userVids,
                        pages: doc.data().pages
                    }).then(() => {
                        history.push('/dashboard');
                    });
                });
            } else {
                setProcessing(false);
                alert('Error: Unhandled Exception Occured!');
                console.log(res);
            }
        }).catch(err => {
            setProcessing(false);
            alert("Unknown Error Occured! Check log for details.");
            console.log(err);
        });
    }

    return (
        <>
            {loading && <div className="absolute z-50 flex items-center justify-center w-full h-full bg-white" style={{ opacity: 0.98 }}>
                <img src={loader} alt="" className="w-full md:w-8/12" />
            </div>}

            {processing && <div className="absolute z-50 flex flex-col items-center justify-center w-full h-full bg-white" style={{ opacity: 0.98 }}>
                <div className="flex items-center">
                    <p className="text-5xl text-gray-600 font-montserratRegular">Processing video</p>
                    <img src={processingGIF} alt="" className="w-40" />
                </div>
                <p className="font-montserratRegular text-lg"><b>Note:</b> It may take a couple of minutes.</p>
            </div>}

            <div className="fixed top-0 bottom-0 left-0 right-0 overflow-y-auto" style={{ backgroundColor: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 w-32 p-3" />
                <img src={DesignElement4} alt="" className="absolute right-0 w-32 p-3" style={{ top: 75 }} />

                <div className="relative flex flex-col px-5 pb-8 mx-auto mt-5 bg-white rounded editorWrapper" style={{ width: '96%' }}>
                    <div className="flex items-center flex-1 py-5 mt-5 rounded-lg editorTopWrapper" style={{ backgroundColor: "rgba(90, 103, 217, 0.2)" }}>
                        <div className="flex-1">
                            <div className="w-9/12 mx-auto trimPlayerWrapper">
                                <ReactPlayer
                                    url={location.state.url}
                                    controls
                                    width='100%'
                                    height='100%'
                                    onProgress={onProgress}
                                    onSeek={onSeek}
                                >
                                </ReactPlayer>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-between my-16 mr-16 text-center trimControls font-montserratSemiBold" style={{ width: '30%' }}>
                            <div className="trimControlsUpper">
                                <p className="mb-4 text-lg trim-text">Cut from, sec: </p>
                                <div className="mb-10 trim-inputs">
                                    <input id="startTime" className="w-32 px-4 py-2 bg-transparent border border-indigo-600 rounded trim-start-input" value={value.min} readOnly />
                                    <span className="mx-2 text-lg trim-input-separator sm:mx-5">to</span>
                                    <input id="endTime" className="w-32 px-4 py-2 bg-transparent border border-indigo-600 rounded trim-end-input" value={value.max} readOnly />
                                </div>
                            </div>
                            <div className="trimButtonsWrapper">
                                <button onClick={() => apply(location.state.url, round(location.state.duration, 2), location.state.index)} className="w-64 py-2 mb-3 text-sm text-white bg-indigo-600 rounded trimApplyBtn">Apply Changes</button>
                                <button onClick={() => history.goBack()} className="w-64 py-2 text-sm text-white bg-indigo-600 rounded trimBackBtn">Return to Dashboard</button>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-5 timeline_wrapper" style={{}}>
                        <div style={{ height: 120 }} className="timeline_thumb_Wrapper">
                            <img alt="" className="inline-block rounded-l-lg thumb-1" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-2" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-3" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-4" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-5" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-6" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-7" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-8" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block thumb-9" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                            <img alt="" className="inline-block rounded-r-lg thumb-10" style={{ width: '10%', height: '100%' }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" />
                        </div>
                        <div style={{ position: 'absolute', top: 52, width: '100%' }} className="timeline_range_wrapper">
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
        </>
    )
}
