import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom';
import Draggable from 'react-draggable';
import RecordRTC from 'recordrtc';

export default function NewVideo({ visible, hide }) {
  const history = useHistory();
  let recorder, myCamera;

  function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (camera) {
      callback(camera);
    }).catch(function (error) {
      alert('Unable to capture your camera. Please check console logs.');
      console.error(error);
    });
  }

  var start = () => {
    captureCamera(function (camera) {
      myCamera = camera;
      let video = document.querySelector("#camera_preview");
      video.muted = true;
      video.volume = 0;
      video.srcObject = camera;

      recorder = RecordRTC(camera, {
        type: 'video',
        disableLogs: true
      });

      recorder.startRecording();
    });
  }

  function handleModeChange(e) {
    if (e.target.value === 'Screen Only') {
      document.querySelector(".dragCircle").style.display = 'none';
      clearConfig();
    } else {
      start();
      document.querySelector(".dragCircle").style.display = 'block';
    }
  }

  function getConfig() {
    var mode = document.getElementsByName("mode_options")[0].value;
    var isAudioEnabled = document.getElementsByName("isAudioEnabled")[0].value === "Yes" ? 1 : 0;
    var camPosition = document.querySelector(".dragCircle").getBoundingClientRect();
    var top = camPosition.top;
    var left = camPosition.left;
    history.push('/recorder', {
      mode, isAudioEnabled, top, left
    });
    clearConfig();
  }

  function clearConfig() {
    if (recorder) {
      recorder.stopRecording(function () {
        myCamera.getTracks().forEach(function (track) {
          track.stop();
        });
      });
    }
  }

  useMemo(() => {
    if (visible) start();
  }, [visible]);

  return (
    visible && <>
      <div className="flex items-center justify-center config_wrapper absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }}>

        <div className="px-5 py-6 bg-gray-200 rounded shadow-md w-3/12" style={{}}>
          <label>Recording Mode</label><br />
          <div className="relative mb-5">
            <select onChange={handleModeChange} className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline" name="mode_options">
              <option>Screen + Cam</option>
              <option>Screen Only</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
              <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
          <label>Microphone Audio</label><br />
          <div className="relative mb-5">
            <select className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline" name="isAudioEnabled">
              <option>Yes</option>
              <option>No</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
              <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          <br /><br />
          <button className="block w-full px-8 py-2 mb-2 text-white bg-indigo-600 rounded shadow-md" onClick={() => { getConfig(); }}>Start Recording</button>
          <button className="block w-full px-8 py-2 mb-3 text-white bg-red-600 rounded shadow-md" onClick={() => { clearConfig(); hide(); }}>Cancel</button>

        </div>

        <Draggable bounds=".config_wrapper">
          <div className="dragCircle" style={{
            position: 'absolute',
            bottom: 0, left: 0,
            width: '280px',
            backgroundColor: '#000',
            overflow: 'hidden',
            height: '280px',
            borderRadius: '50%',
            cursor: 'move',
            margin: 10
          }}>
            <video id="camera_preview" autoPlay style={{ width: '100%', height: '100%', transform: `scale(1.35) rotateY(180deg)` }}></video>
          </div>
        </Draggable>
      </div>
    </>
  )
}
