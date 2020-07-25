import React, { useState, useEffect, useRef, useMemo } from 'react'
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { useLocation, useHistory } from 'react-router-dom';
import Axios from 'axios';
import ReactPlayer from 'react-player';

import { db } from '../firebase';
import Navbar from './Navbar';
import DesignElement4 from '../assets/images/DesignElement4.png';
import Loader from './Loader';
import processingGIF from '../assets/images/processing.gif';
import { round, API_URL } from '../utils';
import {
    processingWrapperClasses,
    trimApplyBtnClasses,
    trimBackBtnClasses,
    trimControlsClasses,
    trimInputClasses
} from '../utils/classes';

function Trim() {
    const { state } = useLocation();
    const history = useHistory();

    const willMount = useRef(true);
    if (willMount.current) {
        if (!state) history.goBack();
        willMount.current = false;
    }

    const [value, setValue] = useState({ min: 0, max: 0 });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const canvasRef = useRef(null);
    const hiddenPlayerRef = useRef(null);
    const loaderGif = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif";
    const playerConfig = useMemo(() => {
        return {
            file: {
                attributes: {
                    crossOrigin: 'true'
                },
                tracks: [
                    { kind: 'subtitles', src: API_URL + "/" + state.publicId + ".vtt", srcLang: 'en', default: true }
                ]
            }
        }
    }, [state.publicId])

    useEffect(() => {
        const canvas = canvasRef.current, video = hiddenPlayerRef.current;
        var thumbCount = 0;

        setValue({
            min: Math.round(state.duration * 0.4, 2),
            max: Math.round(state.duration - (state.duration * 0.4), 2)
        });

        var duration = Math.round(state.duration);
        var increment = duration / 10, curr = 0.1;
        video.currentTime = curr;

        video.onseeked = () => {
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            var img = document.querySelector(".thumb-" + (++thumbCount));
            img.src = canvas.toDataURL();
            curr += increment;
            if (curr <= duration) video.currentTime = curr;
            else setLoading(false);
        }
    }, [state.duration]);

    const onProgress = () => {
        var video = document.querySelector('video');
        const { min, max } = value;
        if (video.currentTime > min && video.currentTime < max) {
            video.currentTime = max;
        }
    }

    const onSeek = (seconds) => {
        var video = document.querySelector('video');
        const { min, max } = value;
        if (seconds > min && seconds < max) {
            video.currentTime = max;
        }
    }

    const apply = (url, duration, index) => {
        const { min, max } = value;

        if (min === 0 && max === duration) {
            alert("Warning: Can't Trim Full Video.");
            return;
        }

        setProcessing(true);
        Axios.post(API_URL + '/trim', {
            userId: localStorage.getItem("UUID"),
            lowerLimit: min,
            upperLimit: max,
            duration,
            url,
            pid: state.publicId
        }).then(res => {
            if (res.data.code && res.data.code === "Success") {
                db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
                    var videoUrl = res.data.secure_url;
                    var parts = videoUrl.split("/");
                    parts.splice(-2, 1);
                    videoUrl = parts.join("/");

                    var userVids = doc.data().videos;
                    userVids[index].duration = res.data.duration;
                    userVids[index].publicId = res.data.public_id;
                    userVids[index].url = videoUrl;
                    userVids[index].thumb = videoUrl.substr(0, videoUrl.length - 3) + 'jpg';

                    db.collection('users').doc(localStorage.getItem("UUID")).set({
                        fullname: doc.data().fullname,
                        videos: userVids,
                        pages: doc.data().pages
                    }).then(() => {
                        history.push('/dashboard');
                    });
                });
            } else {
                setProcessing(false);
                alert('Error: Unhandled Exception Occured!');
                console.log(res);
            }
        }).catch(err => {
            setProcessing(false);
            alert("Unknown Error Occured! Check log for details.");
            console.log(err);
        });
    }

    return (
        <React.Fragment>
            <Loader loading={loading} />

            {processing && <div className={processingWrapperClasses} style={{ opacity: 0.98 }}>
                <div className="flex items-center">
                    <p className="text-5xl text-gray-600 font-montserratRegular">Processing video</p>
                    <img src={processingGIF} alt="" className="w-40" />
                </div>
                <p className="text-lg font-montserratRegular"><b>Note:</b> It may take a couple of minutes.</p>
            </div>}

            <div className="fixed top-0 bottom-0 left-0 right-0 overflow-y-auto" style={{ backgroundColor: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 w-32 p-3" />
                <img src={DesignElement4} alt="" className="absolute right-0 w-32 p-3" style={{ top: 75 }} />

                <div className="relative flex flex-col px-5 pb-8 mx-auto mt-5 bg-white rounded editorWrapper" style={{ width: '96%' }}>
                    <div className="flex items-center flex-1 py-5 mt-5 rounded-lg editorTopWrapper" style={{ backgroundColor: "rgba(90, 103, 217, 0.2)" }}>
                        <div className="flex-1">
                            <div className="w-9/12 mx-auto trimPlayerWrapper">
                                <ReactPlayer
                                    url={state.url} controls
                                    width='100%' height='100%'
                                    onProgress={onProgress} onSeek={onSeek}
                                    config={playerConfig}
                                >
                                </ReactPlayer>
                            </div>
                        </div>
                        <div className={trimControlsClasses} style={{ width: '30%' }}>
                            <div className="trimControlsUpper">
                                <p className="mb-4 text-lg trim-text">Cut from, sec: </p>
                                <div className="mb-10 trim-inputs">
                                    <input id="startTime" className={trimInputClasses + " trim-start-input"} value={value.min} readOnly />
                                    <span className="mx-2 text-lg trim-input-separator sm:mx-5">to</span>
                                    <input id="endTime" className={trimInputClasses + "trim-end-input"} value={value.max} readOnly />
                                </div>
                            </div>
                            <div className="trimButtonsWrapper">
                                <button onClick={() => apply(state.url, round(state.duration, 2), state.index)} className={trimApplyBtnClasses}>Apply Changes</button>
                                <button onClick={() => history.goBack()} className={trimBackBtnClasses}>Return to Dashboard</button>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-5 timeline_wrapper">
                        <div style={{ height: 120 }} className="timeline_thumb_Wrapper">
                            <img alt="" className="inline-block rounded-l-lg thumb-1" src={loaderGif} />
                            <img alt="" className="inline-block thumb-2" src={loaderGif} />
                            <img alt="" className="inline-block thumb-3" src={loaderGif} />
                            <img alt="" className="inline-block thumb-4" src={loaderGif} />
                            <img alt="" className="inline-block thumb-5" src={loaderGif} />
                            <img alt="" className="inline-block thumb-6" src={loaderGif} />
                            <img alt="" className="inline-block thumb-7" src={loaderGif} />
                            <img alt="" className="inline-block thumb-8" src={loaderGif} />
                            <img alt="" className="inline-block thumb-9" src={loaderGif} />
                            <img alt="" className="inline-block rounded-r-lg thumb-10" src={loaderGif} />
                        </div>
                        <div style={{ position: 'absolute', top: 52, width: '100%' }} className="timeline_range_wrapper">
                            <InputRange
                                maxValue={round(state.duration, 2)}
                                minValue={0}
                                formatLabel={value => ``}
                                step={.01}
                                value={value}
                                onChange={value => {
                                    if (value.min < 0) value.min = 0;
                                    if (value.max > state.duration) value.max = state.duration;
                                    var min = round(value.min, 2);
                                    var max = round(value.max, 2);
                                    setValue({ min, max });
                                }} />
                        </div>
                    </div>

                </div>
            </div>

            <video ref={hiddenPlayerRef} crossOrigin="anonymous" hidden src={state.url}></video>
            <canvas ref={canvasRef} hidden width="720" height="480"></canvas>
        </React.Fragment>
    )
}

export default Trim;
