import React, { useEffect, useState } from 'react'
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
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    }).then(cb);
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
        console.log('Time Duration: ' + (Date.now() - startTime) / 1000);
        blob = recorder.getBlob();
        document.querySelector('video').srcObject = null;
        document.querySelector('video').src = URL.createObjectURL(blob);
        document.querySelector('video').muted = false;

        [myScreen, myCamera].forEach(function (stream) {
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
        });
    });
};

var recorder, myScreen, myCamera, startTime, blob, thumbnailCaptured = false;

function start(pos) {
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
            camera.top = pos.top + 100;
            camera.left = pos.left > 20 ? pos.left - 10 : pos.left;

            recorder = RecordRTC([screen, camera], {
                type: 'video',
                mimeType: 'video/webm',
                timeSlice: 5000,
                // ondataavailable: function (blob) {
                //     if (!thumbnailCaptured) {
                //         var url = URL.createObjectURL(blob);
                //         var video = document.createElement('video');
                //         var timeupdate = function () {
                //             if (snapImage()) {
                //                 video.removeEventListener('timeupdate', timeupdate);
                //                 video.pause();
                //                 thumbnailCaptured = true;
                //             }
                //         };
                //         video.addEventListener('loadeddata', function () {
                //             if (snapImage()) {
                //                 video.removeEventListener('timeupdate', timeupdate);
                //                 thumbnailCaptured = true;
                //             }
                //         });
                //         var snapImage = function () {
                //             var canvas = document.createElement('canvas');
                //             canvas.width = video.videoWidth;
                //             canvas.height = video.videoHeight;
                //             canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                //             var image = canvas.toDataURL();

                //             axios.post("http://localhost:8000/upload", { data: image, name: '1-' + startTime + '.png' }).then(res => {
                //                 console.log(res);
                //             });

                //             var success = image.length > 100000;
                //             if (success) {
                //                 URL.revokeObjectURL(url);
                //             }
                //             return success;
                //         };
                //         video.addEventListener('timeupdate', timeupdate);
                //         video.preload = 'metadata';
                //         video.src = url;
                //         video.muted = true;
                //         video.playsInline = true;
                //         video.play();
                //     }

                //     var reader = new FileReader();
                //     reader.readAsDataURL(blob);
                //     reader.onloadend = function () {
                //         var base64data = reader.result;
                //         axios.post("http://localhost:8000/upload", { data: base64data, name: '1-' + startTime + '.mp4' }).then(res => {
                //             console.log(res);
                //         });
                //     }
                // }
            });

            recorder.startRecording();
            startTime = Date.now();
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

function uploadToCloudinary() {
    var file = new File([blob], "demo.mp4");
    var formData = new FormData();
    formData.append("upload_preset", "fjssudg9");
    formData.append("file", file);
    axios.post('https://api.cloudinary.com/v1_1/dhhtvk50h/upload', formData)
        .then(data => console.log(data))
        .catch(err => console.log(err));
}

export default function Recorder() {
    useEffect(() => {
        if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
            var error = 'Your browser does NOT supports getDisplayMedia API.';
            alert(error);
            document.querySelector('video').style.display = 'none';
        }
    }, []);

    const [pos, setPos] = useState({ top: 10, left: 1226 });

    return (
        <div>
            <h1>Video & Screen Recording Demo</h1>

            <div>
                <button onClick={() => start(pos)}>Start Recording</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button onClick={stopCallback}>Stop Recording</button>
            </div>

            <br />
            <video controls width="500" height="350"></video>

            <br />
            <div id="thumbWrapper"></div>

            <br />
            <button onClick={uploadToCloudinary}>Upload</button>
        </div>
    )
}
