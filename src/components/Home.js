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

function getConfig(history) {
    var mode = document.getElementsByName("mode_options")[0].value;
    var isAudioEnabled = document.getElementsByName("isAudioEnabled")[0].value;
    var camPosition = dragCircle.getBoundingClientRect();
    var top = camPosition.top;
    var left = camPosition.left;
    history.push('/recorder', {
        mode, isAudioEnabled, top, left
    });
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

function Home() {
    let history = useHistory();

    useEffect(() => {
        video = document.querySelector('video');
        dragCircle = document.querySelector('.dragCircle');
    }, []);

    return (
        <div className="w-screen h-screen">
            {
                localStorage.getItem("UUID") == null ?
                    <>
                        <button onClick={() => history.push('signin')} className="bg-indigo-600 text-white px-8 py-2 rounded mr-4">Sign In</button>
                        <button onClick={() => history.push('signup')} className="bg-indigo-600 text-white px-8 py-2 rounded">Sign Up</button>
                    </> :
                    <>
                        <button className="new_vid_btn bg-indigo-600 text-white px-8 py-2 rounded mt-2 ml-2" onClick={start}>New Video</button>
                        <button style={{ position: 'absolute', top: 10, right: 10 }} onClick={() => { localStorage.removeItem("UUID"); window.location.reload(); }} className="bg-indigo-600 text-white px-8 py-2 rounded">Logout</button>
                    </>
            }

            <div className="config_wrapper rounded bg-gray-200 shadow-md max-w-xs px-3 py-5" style={{ display: 'none' }}>
                <label>Recording Mode</label><br />
                <div className="inline-block relative w-full mb-5">
                    <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" name="mode_options">
                        <option>Screen + Cam</option>
                        <option>Screen Only</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
                <label>Microphone Audio</label><br />
                <div className="inline-block relative w-full mb-10">
                    <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" name="isAudioEnabled">
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                <button className="bg-indigo-600 text-white px-8 py-2 rounded mr-2" onClick={() => { getConfig(history); }}>Start Recording</button>
                <button className="bg-indigo-600 text-white px-8 py-2 rounded" onClick={clearConfig}>Cancel</button>

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
                        <video autoPlay style={{ width: '100%', height: '100%', transform: `scale(1.35) rotateY(180deg)` }}></video>
                    </div>
                </Draggable>

            </div>
        </div>
    )
}

export default Home;