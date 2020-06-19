import React, { useEffect, useState } from 'react'
import RecordRTC from 'recordrtc';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { db } from '../firebase';
import firebase from "firebase/app";

function invokeGetDisplayMedia(success, error) {
    if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(success).catch(error);
    } else {
        navigator.getDisplayMedia({ video: true }).then(success).catch(error);
    }
}

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

function keepStreamActive(stream) {
    var video = document.createElement('video');
    video.muted = true;
    video.srcObject = stream;
    video.style.display = 'none';
    (document.body || document.documentElement).appendChild(video);
}

function stopCallback() {
    recorder.stopRecording(function () {
        if (mainConfig.mode === "Screen + Cam" && mainConfig.audio === 1) {
            streams.forEach(function (stream) {
                stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            });
        } else if (mainConfig.mode === "Screen Only" && mainConfig.audio === 1) {
            [myScreen, myAudio].forEach(function (stream) {
                stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            });
        } else if (mainConfig.mode === "Screen + Cam" && mainConfig.audio === 0) {
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

        blob = recorder.getBlob();
        document.querySelector('video').srcObject = null;
        document.querySelector('video').src = URL.createObjectURL(blob);
        document.querySelector('video').muted = false;
        document.querySelector('.previewWrapper').style.display = 'block';
    });
};

var recorder, streams, blob, myScreen, mainConfig, myAudio;

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

function uploadToCloudinary(history) {
    var msg_element = document.querySelector(".upload_msg");
    msg_element.style.display = 'block';
    var file = new File([blob], "demo.mp4");
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
                publicId: res.data.public_id,
                views: 0
            };
            db.collection('users').doc(localStorage.getItem("UUID")).update({
                videos: firebase.firestore.FieldValue.arrayUnion(video_Obj)
            });
            setTimeout(() => { history.push('/'); }, 2500);
        })
        .catch(err => msg_element.innerHTML = JSON.stringify(err));
}

function Recorder() {
    let location = useLocation();
    let history = useHistory();
    const [pos] = useState({ top: location.state.top, left: location.state.left });
    const [config] = useState({ mode: location.state.mode, audio: location.state.isAudioEnabled });

    useEffect(() => {
        if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
            var error = 'Your browser does NOT supports getDisplayMedia API.';
            alert(error);
            document.querySelector('video').style.display = 'none';
            return;
        }
        start(pos, config);
        mainConfig = config;
    }, [pos, config]);

    return (
        <>
            <button style={{ position: "absolute", top: 10, right: 10 }} className="bg-indigo-600 text-white px-8 py-2 rounded" onClick={() => stopCallback(config)}>Stop Recording</button>

            <div style={{ display: 'none', width: '50%' }} className="previewWrapper mx-auto mt-20">
                <video className="w-full shadow-lg" controls></video>
                <button className="bg-indigo-600 text-white px-8 py-2 rounded mt-3" onClick={() => uploadToCloudinary(history)}>Upload</button>
                <p style={{ display: 'none' }} className="upload_msg">Uploading ... Please Wait ....</p>
            </div>
        </>
    )
}

export default Recorder;