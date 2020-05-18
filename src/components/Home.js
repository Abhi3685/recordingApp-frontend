import React, { useEffect } from 'react'
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
    var camPosition = dragCircle.getBoundingClientRect();
    console.log('Selected Configuration: ');
    console.log({ mode, isAudioEnabled, camPositionTop: camPosition.top, camPositionLeft: camPosition.left });
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
    let history = useHistory();

    useEffect(() => {
        video = document.querySelector('video');
        dragCircle = document.querySelector('.dragCircle');
    }, []);

    return (
        <div>
            <button className="new_vid_btn" onClick={start}>New Video</button>
            <br />
            <br />

            {
                localStorage.getItem("UUID") == null ? <div>
                    <button onClick={() => history.push('signin')} className="bg-indigo-600 text-white px-8 py-2 rounded ml-5">Sign In</button>
                    <button onClick={() => history.push('signup')} className="bg-indigo-600 text-white px-8 py-2 rounded mx-10">Sign Up</button>
                </div> :
                    <button onClick={() => { localStorage.removeItem("UUID"); window.location.reload(); }} className="bg-indigo-600 text-white px-8 py-2 rounded mx-10">Logout</button>
            }


            <div className="config_wrapper" style={{ display: 'none' }}>
                <label>Recording Mode</label><br />
                <select name="mode_options">
                    <option>Screen + Cam</option>
                    <option>Screen Only</option>
                </select><br /><br />
                <label>Microphone Audio</label><br />
                <select name="isAudioEnabled">
                    <option>Yes</option>
                    <option>No</option>
                </select>
                <br /><br />

                <button onClick={() => { getConfig(); }}>Start Recording</button>
                <button onClick={clearConfig}>Cancel</button>

                <Draggable bounds="body">
                    <div className="dragCircle" style={{
                        position: 'absolute',
                        top: 400, left: 0,
                        width: '300px',
                        backgroundColor: '#000',
                        overflow: 'hidden',
                        height: '300px',
                        borderRadius: '50%',
                        cursor: 'move',
                        margin: 10
                    }}>
                        <video style={{ width: '100%', height: '100%', transform: `scale(1.35) rotateY(180deg)` }}></video>
                    </div>
                </Draggable>

            </div>
        </div>
    )
}
