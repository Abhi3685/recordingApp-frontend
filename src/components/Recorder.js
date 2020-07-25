import React, { useEffect, useState, useCallback } from 'react'
import RecordRTC, { getSeekableBlob } from 'recordrtc';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import firebase from "firebase/app";
import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';

import { db } from '../firebase';
import Navbar from './Navbar';
import DesignElement4 from '../assets/images/DesignElement4.png';
import DesignElement3 from '../assets/images/DesignElement3.png';
import { recordingWrapperClasses, recorderBtnClasses, recorderBtnClasses2 } from '../utils/classes';

const addStreamStopListener = (stream, callback) => {
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

const keepStreamActive = (stream) => {
    var video = document.createElement('video');
    video.muted = true;
    video.srcObject = stream;
    video.style.display = 'none';
    (document.body || document.documentElement).appendChild(video);
}

const invokeGetDisplayMedia = (success, error) => {
    if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(success).catch(error);
    } else {
        navigator.getDisplayMedia({ video: true }).then(success).catch(error);
    }
}


let recorder, streams, blob, myScreen, myAudio;

function uploadToCloudinary(history) {
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
                url: videoUrl.substr(0, videoUrl.length - 3) + 'mkv',
                thumb: videoUrl.substr(0, videoUrl.length - 3) + 'jpg',
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

    const stopCallback = useCallback((action = 'stop') => {
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

            if (action === 'cancel') history.push("/dashboard");

            getSeekableBlob(recorder.getBlob(), function (seekableBlob) {
                blob = seekableBlob;
                setUrl(URL.createObjectURL(seekableBlob));
                setIsRecording(2);
            });
        });
    }, [config, history])

    const captureScreen = useCallback((callback) => {
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
            history.replace('/dashboard');
        });
    }, [history, stopCallback])

    useEffect(() => {
        if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
            var error = 'Your browser does NOT supports getDisplayMedia API.';
            alert(error);
            return;
        }

        if (config.mode === "Screen + Cam") {
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
                    setIsRecording(1);
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
                    setIsRecording(1);
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
                setIsRecording(1);
                recorder.startRecording();
            });
        }
    }, [pos, config, captureScreen]);

    return (
        <React.Fragment>
            <div style={{ background: 'rgba(0,0,0,0.7)' }} className={recordingWrapperClasses + (isRecording !== 1 ? " invisible" : "")}>
                <div className="flex items-center">
                    <img alt="" src={"https://media0.giphy.com/media/d96R9rpZMG2kAOUhSz/source.gif"} className="w-40" />
                    <p className="text-4xl text-white font-montserratSemiBold">Recording</p>
                </div>

                <div className="flex">
                    <button onClick={stopCallback} className={recorderBtnClasses + " bg-yellow-500 hover:bg-yellow-600"}>
                        Stop Recording
                    </button>
                    <button
                        onClick={() => stopCallback('cancel')}
                        className={recorderBtnClasses + " bg-red-500 hover:bg-red-600"}
                    >Cancel Recording</button>
                </div>
            </div>

            <div
                className={"absolute previewWrapper inset-0" + (isRecording !== 2 && " invisible")}
                style={{ backgroundColor: "#5A67D9" }}
            >
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 w-32 p-3 ml-8" />
                <img src={DesignElement4} alt="" className="absolute right-0 w-32 p-3 mr-8" style={{ top: 75 }} />
                <div className="relative w-2/3 p-5 mx-auto mt-5 bg-white rounded">
                    <img src={DesignElement3} alt="" className="absolute top-0 w-32 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="absolute bottom-0 w-32 transform -rotate-90" style={{ left: -20 }} />

                    <div className="w-9/12 mx-auto mt-5 mb-8 rounded-lg">
                        <Player src={url} playsInline autoPlay>
                            <BigPlayButton position="center" />
                            <LoadingSpinner />
                            <ControlBar autoHide={false} />
                        </Player>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className={recorderBtnClasses2 + " mr-8 bg-green-600 hover:bg-green-500"}
                            onClick={() => uploadToCloudinary(history)}
                        >Save to cloud</button>
                        <button
                            className={recorderBtnClasses2 + " bg-red-600 hover:bg-red-500"}
                            onClick={() => history.push("/dashboard")}
                        >Destroy recording</button>
                    </div>
                    <p className="invisible pt-5 text-lg text-center upload_msg font-montserratSemiBold">
                        Uploading ... Please Wait ....
                    </p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Recorder;
