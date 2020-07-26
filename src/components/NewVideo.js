import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Draggable from 'react-draggable';
import RecordRTC from 'recordrtc';
import { newVideoSelectClasses, newVideoBtnClasses } from '../utils/classes';

function NewVideo({ visible, hide }) {
  const history = useHistory();
  const [hasHardware, setHasHardware] = useState(true);
  const [recorder, setRecorder] = useState(null);
  const [myCamera, setMyCamera] = useState(null);
  const videoRef = useRef(null);
  const [mode, setMode] = useState(1);
  const audioSelectRef = useRef(null);

  const captureCamera = (callback) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (camera) {
      callback(camera);
    }).catch(function (error) {
      setHasHardware(false);
      console.error(error);
    });
  }

  const start = useCallback(() => {
    captureCamera(function (camera) {
      setMyCamera(camera);
      let video = videoRef.current;
      video.muted = true;
      video.volume = 0;
      video.srcObject = camera;

      let recorder = RecordRTC(camera, {
        type: 'video',
        disableLogs: true
      });
      setRecorder(recorder);
      recorder.startRecording();
    });
  }, []);

  function handleModeChange(e) {
    if (e.target.value === 'Screen Only') {
      setMode(2);
      clearConfig();
    } else {
      setMode(1);
      audioSelectRef.current.value = 'Yes';
      start();
    }
  }

  function getConfig() {
    var isAudioEnabled = audioSelectRef.current.value === "Yes" ? 1 : 0;
    var { top, left } = document.querySelector(".dragCircle").getBoundingClientRect();
    history.push('/recorder', {
      mode, isAudioEnabled, top, left
    });
    clearConfig();
  }

  const clearConfig = useCallback(() => {
    if (recorder) {
      recorder.stopRecording(() => {
        myCamera.getTracks().forEach((track) => track.stop())
      });
    }
  }, [myCamera, recorder]);

  useEffect(() => {
    if (visible) start();
  }, [visible, start]);

  return (
    visible && <React.Fragment>
      {
        hasHardware ?
          <div className="absolute inset-0 flex items-center justify-center config_wrapper" style={{ background: "rgba(0,0,0,0.4)" }}>

            <div className="w-6/12 px-5 py-6 bg-gray-200 rounded shadow-md lg:w-3/12">
              <label>Recording Mode</label><br />
              <div className="relative mb-5">
                <select onChange={handleModeChange} className={newVideoSelectClasses} name="mode_options">
                  <option>Screen + Cam</option>
                  <option>Screen Only</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <label>Microphone Audio</label><br />
              <div className="relative mb-5">
                <select
                  ref={audioSelectRef}
                  disabled={mode === 1}
                  className={newVideoSelectClasses + (mode === 1 && " opacity-50")}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <br />
              <button className={newVideoBtnClasses + " mb-2 bg-indigo-600"} onClick={getConfig}>Start Recording</button>
              <button className={newVideoBtnClasses + " mb-3 bg-red-600"} onClick={() => { clearConfig(); hide(); }}>Cancel</button>

            </div>

            <Draggable bounds=".config_wrapper">
              <div className={"dragCircle" + (mode === 2 ? " hidden" : "")} style={{
                width: '280px',
                background: '#000000',
                cursor: 'move',
                position: 'absolute',
                bottom: 0, left: 0,
                height: '280px',
                borderRadius: '50%',
                margin: 10,
                overflow: 'hidden'
              }}>
                <video
                  id="camera_preview"
                  ref={videoRef}
                  autoPlay
                  style={{ width: '100%', height: '100%', transform: `scale(1.35) rotateY(180deg)` }}
                />
              </div>
            </Draggable>
          </div> :
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-300" style={{ opacity: 0.95 }}>
            <div className="flex items-center px-5">
              <i className="invisible text-6xl text-red-600 fa md:visible fa-close" />
              <p className="mx-8 text-2xl text-red-600">Unable to capture your camera or microphone.</p>
              <i className="invisible text-6xl text-red-600 fa fa-close md:visible" />
            </div>
            <button className="w-32 px-8 py-2 mt-8 mb-3 text-white bg-red-600 rounded shadow-md" onClick={hide}>Ok</button>
          </div>
      }
    </React.Fragment>
  )
}

export default NewVideo;
