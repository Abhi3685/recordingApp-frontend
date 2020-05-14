import React, { useEffect } from 'react'
import RecordRTC from 'recordrtc';
import axios from 'axios';

function invokeGetDisplayMedia(success, error) {
    var displaymediastreamconstraints = {
        video: {
            displaySurface: 'monitor', // monitor, window, application, browser
            logicalSurface: true,
            cursor: 'always' // never, always, motion
        }
    };

    // above constraints are NOT supported YET
    // that's why overridnig them
    displaymediastreamconstraints = {
        video: true
    };

    if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
    else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
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

function captureCamera(cb) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(cb);
}

function keepStreamActive(stream) {
    var video = document.createElement('video');
    video.muted = true;
    video.srcObject = stream;
    video.style.display = 'none';
    (document.body || document.documentElement).appendChild(video);
}

var stopCallback = () => {
    recorder.stopRecording(function () {
        console.log('End time: ' + Date.now());
        var blob = recorder.getBlob();
        document.querySelector('video').srcObject = null;
        document.querySelector('video').src = URL.createObjectURL(blob);
        document.querySelector('video').muted = false;
        document.querySelector('video').style.display = 'block';

        [myScreen, myCamera].forEach(function (stream) {
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
        });
    });
};

var recorder, myScreen, myCamera;

function start() {
    captureScreen(function (screen) {
        myScreen = screen;
        keepStreamActive(screen);
        captureCamera(function (camera) {
            myCamera = camera;
            keepStreamActive(camera);

            screen.width = window.screen.width;
            screen.height = window.screen.height;
            screen.fullcanvas = true;

            camera.width = 310;
            camera.height = 300;
            camera.top = screen.height - camera.height - 50;
            camera.left = screen.width - camera.width - 50;

            recorder = RecordRTC([screen, camera], {
                type: 'video',
                mimeType: 'video/mp4',
                timeSlice: 5000,
                ondataavailable: function (blob) {
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        var base64data = reader.result;
                        axios.post("http://localhost:8000/upload", { data: base64data }).then(res => {
                            console.log(res);
                        });
                    }
                }
            });

            recorder.startRecording();
            console.log('Start time: ' + Date.now());
        });
    });
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

export default function Recorder() {
    useEffect(() => {
        if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
            var error = 'Your browser does NOT supports getDisplayMedia API.';
            document.querySelector('h1').innerHTML = error;
            document.querySelector('video').style.display = 'none';
        }
    });

    return (
        <div>
            <h1>Video & Screen Recording Demo</h1>

            <div>
                <button onClick={start}>Start Recording</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button onClick={stopCallback}>Stop Recording</button>
            </div>

            <br /><br />
            <video controls width="500" height="350"></video>
        </div>
    )
}
