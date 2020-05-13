import React, { useEffect, useState } from 'react'
import RecordRTC from 'recordrtc';
import Draggable from 'react-draggable';
import { useHistory } from 'react-router-dom';

var recorder, video, dragCircle, myCamera;

function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (camera) {
        callback(camera);
    }).catch(function (error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}

var start = () => {
    document.querySelector(".new_vid_btn").style.display = 'none';
    document.querySelector(".config_wrapper").style.display = 'block';

    captureCamera(function (camera) {
        myCamera = camera;
        video.muted = true;
        video.volume = 0;
        video.srcObject = camera;

        recorder = RecordRTC(camera, {
            type: 'video'
        });

        recorder.startRecording();
    });
}

function getConfig() {
    var mode = document.getElementsByName("mode_options")[0].value;
    var isAudioEnabled = document.getElementsByName("isAudioEnabled")[0].value;
    var camSource = document.getElementsByName("video_options")[0].value;
    var micSource = document.getElementsByName("mic_options")[0].value;
    var camPosition = dragCircle.getBoundingClientRect();
    console.log('Selected Configuration: ');
    console.log({ mode, isAudioEnabled, camSource, micSource, camPositionTop: camPosition.top, camPositionLeft: camPosition.left });
    clearConfig();
}

function clearConfig() {
    recorder.stopRecording(function () {
        myCamera.getTracks().forEach(function (track) {
            track.stop();
        });
    });
    document.querySelector(".new_vid_btn").style.display = 'block';
    document.querySelector(".config_wrapper").style.display = 'none';
}

export default function Home() {
    const [cameras, setCameras] = useState([]);
    const [mics, setMics] = useState([]);

    let history = useHistory();

    useEffect(() => {
        video = document.querySelector('video');
        dragCircle = document.querySelector('.dragCircle');
        function getConnectedDevices(type, callback) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const filtered = devices.filter(device => device.kind === type);
                    callback(filtered);
                });
        }
        getConnectedDevices('videoinput', cameras => setCameras(cameras));
        getConnectedDevices('audioinput', mics => setMics(mics));
    }, []);

    return (
        <div>
            <button className="new_vid_btn" onClick={start}>New Video</button>

            <div className="config_wrapper" style={{ display: 'none' }}>
                <label>Recording Mode</label><br />
                <select name="mode_options">
                    <option>Screen + Cam</option>
                    <option>Screen Only</option>
                    <option>Cam Only</option>
                </select><br /><br />
                <label>Microphone Audio</label><br />
                <select name="isAudioEnabled">
                    <option>Yes</option>
                    <option>No</option>
                </select>
                <br /><br />
                <label>Camera Source</label><br />
                <select name="video_options">
                    {
                        cameras.length > 0 ?
                            cameras.map((camera, idx) => <option key={idx}>{camera.label}</option>) :
                            <option>No Cameras Found!</option>
                    }
                </select><br /><br />
                <label>Microphone Source</label><br />
                <select name="mic_options">
                    {
                        mics.length > 0 ?
                            mics.map((mic, idx) => <option key={idx}>{mic.label}</option>) :
                            <option>No Microphones Found!</option>
                    }
                </select><br />

                <br />
                <button onClick={() => { getConfig(); history.push("/recorder"); }}>Start Recording</button>
                <button onClick={clearConfig}>Cancel</button>

                <Draggable bounds="body">
                    <div className="dragCircle" style={{
                        position: 'absolute',
                        top: 400, left: 10,
                        width: '300px',
                        backgroundColor: '#000',
                        overflow: 'hidden',
                        height: '300px',
                        borderRadius: '50%',
                        cursor: 'move',
                        margin: 10
                    }}>
                        <video autoPlay playsInline style={{ width: '100%', height: '100%', transform: `scale(1.35) rotateY(180deg)` }}></video>
                    </div>
                </Draggable>

            </div>
        </div>
    )
}
