import React, { useEffect, useState } from 'react'
import RecordRTC, { getSeekableBlob } from 'recordrtc';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { db } from '../firebase';
import firebase from "firebase/app";
import Navbar from './Navbar';
import DesignElement4 from '../assets/images/DesignElement4.png';
import DesignElement3 from '../assets/images/DesignElement3.png';
import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';

let recorder, streams, blob, myScreen, myAudio;

function uploadToCloudinary(history, setIsUploading) {
    var msg_element = document.querySelector(".upload_msg");
    msg_element.classList.remove("invisible");
    var file = new File([blob], "recording.mp4");
    var formData = new FormData();
    formData.append("upload_preset", "fjssudg9");
    formData.append("file", file);
    axios.post('https://api.cloudinary.com/v1_1/dhhtvk50h/upload', formData)
        .then(res => {
            msg_element.innerHTML = "Video Uploaded. Redirecting to Dashboard.";
            var videoUrl = res.data.secure_url;
            var parts = videoUrl.split("/");
            parts.splice(-2, 1);
            videoUrl = parts.join("/");
            var video_Obj = {
                name: 'Recording-' + Date.now(),
                duration: res.data.duration,
                createdAt: res.data.created_at,
                url: videoUrl.substr(0, videoUrl.length - 3) + 'mp4',
                thumb: res.data.secure_url.substr(0, res.data.secure_url.length - 3) + 'jpg',
                publicId: res.data.public_id
            };
            db.collection('users').doc(localStorage.getItem("UUID")).update({
                videos: firebase.firestore.FieldValue.arrayUnion(video_Obj)
            });
            setTimeout(() => { history.push('/dashboard'); }, 2500);
        })
        .catch(err => msg_element.innerHTML = JSON.stringify(err));
}

function Recorder() {
    let location = useLocation();
    let history = useHistory();
    const [pos] = useState({ top: location.state.top, left: location.state.left });
    const [config] = useState({ mode: location.state.mode, audio: location.state.isAudioEnabled });
    const [isRecording, setIsRecording] = useState(0);
    const [url, setUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
            var error = 'Your browser does NOT supports getDisplayMedia API.';
            alert(error);
            document.querySelector('video').style.display = 'none';
            return;
        }
        start(pos, config);
    }, [pos, config]);

    function captureScreen(callback) {
        invokeGetDisplayMedia(function (screen) {
            addStreamStopListener(screen, function () {
                if (stopCallback) {
                    stopCallback();
                }
            });
            callback(screen);
        }, function (error) {
            console.error(error);
            alert('Unable to capture your screen. Please check console logs.\n' + error);
        });
    }

    function stopCallback() {
        recorder.stopRecording(function () {
            if (config.mode === "Screen + Cam" && config.audio === 1) {
                streams.forEach(function (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                });
            } else if (config.mode === "Screen Only" && config.audio === 1) {
                [myScreen, myAudio].forEach(function (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                });
            } else if (config.mode === "Screen + Cam" && config.audio === 0) {
                streams.forEach(function (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                });
            } else {
                myScreen.getTracks().forEach(function (track) {
                    track.stop();
                });
            }

            getSeekableBlob(recorder.getBlob(), function (seekableBlob) {
                blob = seekableBlob;
                setUrl(URL.createObjectURL(seekableBlob));
                setIsRecording(2);
            });
        });
    }

    function invokeGetDisplayMedia(success, error) {
        if (navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia({ video: true }).then(success).catch(error);
        } else {
            navigator.getDisplayMedia({ video: true }).then(success).catch(error);
        }
    }

    function keepStreamActive(stream) {
        var video = document.createElement('video');
        video.muted = true;
        video.srcObject = stream;
        video.style.display = 'none';
        (document.body || document.documentElement).appendChild(video);
    }

    function start(pos, config) {
        if (config.mode === "Screen + Cam" && config.audio === 1) {
            captureScreen(function (screen) {
                keepStreamActive(screen);
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(camera => {
                    keepStreamActive(camera);

                    screen.width = window.screen.width;
                    screen.height = window.screen.height;
                    screen.fullcanvas = true;
                    streams = [screen, camera];

                    camera.width = 310;
                    camera.height = 300;
                    camera.top = pos.top + 100;
                    camera.left = pos.left > 20 ? pos.left - 10 : pos.left;

                    recorder = RecordRTC(streams, {
                        type: 'video',
                        mimeType: 'video/webm',
                        disableLogs: true,
                        canvas: {
                            width: 320,
                            height: 240
                        }
                    });

                    recorder.startRecording();
                });
            });
        } else if (config.mode === "Screen + Cam" && config.audio === 0) {
            captureScreen(function (screen) {
                keepStreamActive(screen);
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(camera => {
                    keepStreamActive(camera);

                    screen.width = window.screen.width;
                    screen.height = window.screen.height;
                    screen.fullcanvas = true;
                    streams = [screen, camera];

                    camera.width = 310;
                    camera.height = 300;
                    camera.top = pos.top + 100;
                    camera.left = pos.left > 20 ? pos.left - 10 : pos.left;

                    recorder = RecordRTC(streams, {
                        type: 'video',
                        mimeType: 'video/webm',
                        disableLogs: true,
                        canvas: {
                            width: 320,
                            height: 240
                        }
                    });

                    recorder.startRecording();
                });
            });
        } else if (config.mode === "Screen Only" && config.audio === 1) {
            captureScreen(function (screen) {
                keepStreamActive(screen);
                navigator.mediaDevices.getUserMedia({ audio: true }).then(function (mic) {
                    screen.addTrack(mic.getTracks()[0]);

                    myScreen = screen;
                    myAudio = mic;

                    recorder = RecordRTC(screen, {
                        type: 'video',
                        mimeType: 'video/webm',
                        disableLogs: true,
                        canvas: {
                            width: 320,
                            height: 240
                        }
                    });
                    recorder.startRecording();
                });
            });
        } else { // Screen Only with No Audio
            captureScreen(function (screen) {
                myScreen = screen;
                keepStreamActive(screen);

                screen.width = window.screen.width;
                screen.height = window.screen.height;
                screen.fullcanvas = true;

                recorder = RecordRTC(screen, {
                    type: 'video',
                    mimeType: 'video/webm',
                    disableLogs: true,
                    canvas: {
                        width: 320,
                        height: 240
                    }
                });

                recorder.startRecording();
            });
        }
        setIsRecording(1);
    }

    function addStreamStopListener(stream, callback) {
        stream.addEventListener('ended', function () {
            callback();
            callback = function () { };
        }, false);
        stream.addEventListener('inactive', function () {
            callback();
            callback = function () { };
        }, false);
        stream.getTracks().forEach(function (track) {
            track.addEventListener('ended', function () {
                callback();
                callback = function () { };
            }, false);
            track.addEventListener('inactive', function () {
                callback();
                callback = function () { };
            }, false);
        });
    }

    return (
        <>
            <div style={{ background: 'rgba(0,0,0,0.7)' }} className={"absolute recordingWrapper inset-0 flex flex-col items-center justify-center" + (isRecording !== 1 ? " invisible" : "")}>
                <div className="flex items-center">
                    <img src={"https://media0.giphy.com/media/d96R9rpZMG2kAOUhSz/source.gif"} className="w-40" />
                    <p className="text-white text-4xl font-montserratSemiBold">Recording</p>
                </div>

                <div className="flex">
                    <button onClick={stopCallback} className="transition duration-300 ease-in focus:outline-none hover:bg-yellow-600 w-64 bg-yellow-500 px-5 py-3 rounded-lg font-montserratSemiBold ml-16">Stop Recording</button>
                    <button onClick={() => history.push("/dashboard")} className="transition duration-300 ease-in focus:outline-none hover:bg-red-600 w-64 bg-red-500 px-5 py-3 rounded-lg font-montserratSemiBold ml-16">Cancel Recording</button>
                </div>
            </div>

            <div className={"absolute previewWrapper inset-0" + (isRecording !== 2 ? " invisible" : "")} style={{ backgroundColor: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 ml-8 p-3 w-32" />
                <img src={DesignElement4} alt="" className="absolute right-0 p-3 w-32 mr-8" style={{ top: 75 }} />
                <div className="bg-white relative w-2/3 mt-5 mx-auto rounded p-5">
                    <img src={DesignElement3} alt="" className="w-32 absolute top-0 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="w-32 absolute bottom-0 transform -rotate-90" style={{ left: -20 }} />

                    <div className="w-9/12 mx-auto mt-5 mb-8 rounded-lg">
                        <Player
                            src={url}
                            playsInline
                            autoPlay
                        >
                            <BigPlayButton position="center" />
                            <LoadingSpinner />
                            <ControlBar autoHide={false} />
                        </Player>
                    </div>
                    <div className="flex justify-center">
                        <button className="transition duration-200 ease-in focus:outline-none hover:bg-green-500 bg-green-600 shadow-md text-white px-8 py-2 rounded w-56 mr-8" onClick={() => uploadToCloudinary(history, setIsUploading)}>Save to cloud</button>
                        <button className="transition duration-200 ease-in focus:outline-none hover:bg-red-500 bg-red-600 shadow-md text-white px-8 py-2 rounded w-56" onClick={() => history.push("/dashboard")}>Destroy recording</button>
                    </div>
                    <p className="upload_msg invisible font-montserratSemiBold text-lg pt-5 text-center">Uploading ... Please Wait ....</p>
                </div>
            </div>
        </>
    )
}

export default Recorder;