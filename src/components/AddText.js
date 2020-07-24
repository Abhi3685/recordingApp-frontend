import React, { useState, useEffect, useRef } from 'react'
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { useLocation, useHistory } from 'react-router-dom';
import Axios from 'axios';
import {
    Player,
    BigPlayButton,
    LoadingSpinner,
    ControlBar
} from 'video-react';

import Navbar from './Navbar';
import DesignElement4 from '../assets/images/DesignElement4.png';
import alarmClock from '../assets/images/alarmClock.png';
import { formatTime, round, hhmmss } from '../utils';
import { addTextBtnClasses, addTextTimeInputClasses, addTextSubtitleInputClasses } from '../utils/classes';

function saveChanges(arr, filename) {
    var fileTxt = "WEBVTT";
    arr.forEach(block => {
        fileTxt += "\n\n" + block.start + " --> " + block.end + "\n" + block.subtitle;
    });
    Axios.post("http://localhost:8000/subtitle", {
        text: fileTxt,
        file: filename
    }).then(res => {
        console.log(res);
    }).catch(err => {
        alert("Error: Unhandled Exception Occured!");
        console.log(err);
    });
}

function AddText() {
    const { state } = useLocation();
    const history = useHistory();
    const willMount = useRef(true);

    if (willMount.current) {
        if (!state) history.goBack();
        willMount.current = false;
    }

    const min = (0 + state.duration * 0.3);
    const max = (state.duration - state.duration * 0.3);
    const [value, setValue] = useState({ min: round(min, 1), max: round(max, 1) });
    const [textsArr, setTextsArr] = useState([]);
    const [playerKey, setPlayerKey] = useState(new Date().getTime());
    const subtitleRef = useRef(null);

    useEffect(() => {
        const url = "http://localhost:8000/" + state.publicId + ".vtt", tmpArr = [];
        Axios.get(url).then(res => {
            if (res.data.indexOf('\n') < 0) return;
            var data = res.data.substring(res.data.indexOf("\n\n") + 2);
            data.split("\n\n").forEach(function (item) {
                var parts = item.split("\n");
                tmpArr.push({
                    start: parts[0].split(" --> ")[0],
                    end: parts[0].split(" --> ")[1],
                    subtitle: parts[1]
                });
            });
            setTextsArr(tmpArr);
            var subWrapperRef = document.querySelector(".subtitlesWrapper");
            subWrapperRef.scrollTop = subWrapperRef.scrollHeight;
        });
    }, [state.publicId]);

    const addText = (filename) => {
        var text = subtitleRef.current.value;
        var startTime = document.getElementById("startTime").getAttribute("data-sec");
        var endTime = document.getElementById("endTime").getAttribute("data-sec");

        var startSec = (startTime + "").split(".")[0];
        var startMilliSec = (startTime + "").split(".")[1] ? (startTime + "").split(".")[1] + "00" : "000";
        var endSec = (endTime + "").split(".")[0];
        var endMilliSec = (endTime + "").split(".")[1] ? (endTime + "").split(".")[1] + "00" : "000";

        var newArr = [...textsArr];
        newArr.push({
            start: hhmmss(startSec) + "." + startMilliSec,
            end: hhmmss(endSec) + "." + endMilliSec,
            subtitle: text
        });

        saveChanges(newArr, filename);
        setTextsArr(newArr);
        setPlayerKey(new Date().getSeconds());
        setTimeout(() => {
            var subWrapperRef = document.querySelector(".subtitlesWrapper");
            subWrapperRef.scrollTop = subWrapperRef.scrollHeight;
        }, 100);
        subtitleRef.current.value = '';
    }

    const removeBlock = (idxToDelete, filename) => {
        var newArr = textsArr.filter((text, idx) => idxToDelete !== idx);
        saveChanges(newArr, filename);
        setTextsArr(newArr);
        setPlayerKey(new Date().getSeconds());
    }

    return (
        <React.Fragment>
            <div className="fixed inset-0" style={{ backgroundColor: "#5A67D9", overflow: 'auto' }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 p-3 w-32" />
                <img src={DesignElement4} alt="" className="absolute right-0 p-3 w-32" style={{ top: 75 }} />

                <div className="bg-white relative flex flex-col mt-5 mx-auto rounded px-5 py-4" style={{ width: '97%', marginBottom: 15 }}>

                    <div className="addTextUpperWrapper flex items-center mb-5 rounded-lg">
                        <div className="flex-1">
                            <div className="addTextPlayerWrapper w-8/12 mx-auto">
                                <Player key={playerKey} crossOrigin="anonymous">
                                    <source src={state.url} />
                                    <track
                                        label="English" kind="subtitles" srcLang="en"
                                        src={"http://localhost:8000/" + state.publicId + ".vtt"}
                                        default
                                    />

                                    <BigPlayButton position="center" />
                                    <LoadingSpinner />
                                    <ControlBar autoHide={false} />
                                </Player>
                            </div>
                        </div>
                        <div className="text-center subtitleContainer font-montserratSemiBold mr-16 flex flex-col items-center" style={{ width: '35%' }}>
                            <h1 className="text-xl mb-3">Video Subtitles</h1>
                            {
                                textsArr.length > 0 ?
                                    <div style={{ height: 300 }} className="overflow-y-auto subtitlesWrapper sm:pr-16">
                                        {
                                            textsArr.map((textBlock, idx) =>
                                                <div key={idx} className="flex w-full my-3">
                                                    <div className="mr-5 text-left" style={{ width: 280 }}>
                                                        <img src={alarmClock} alt="" className="hidden sm:inline-block mr-3" /> {textBlock.start}<br />
                                                        <img src={alarmClock} alt="" className="hidden sm:inline-block mr-3" /> {textBlock.end}
                                                    </div>
                                                    <div className="relative w-full px-3 py-1 rounded-lg" style={{ backgroundColor: "rgba(90, 103, 217, 0.2)" }}>
                                                        <p className="text-left text-sm font-montserratRegular subtitleWrapper w-full">{textBlock.subtitle}</p>
                                                        <i
                                                            onClick={() => removeBlock(idx, state.publicId + ".vtt")}
                                                            className="fa fa-trash absolute cursor-pointer text-red-600"
                                                            style={{ top: 15, right: 10 }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    : <div className="flex flex-col -mt-10 text-gray-500 items-center justify-center h-full w-full" style={{ height: 300 }}>
                                        <i className="fa fa-comment-alt mb-3 fa-3x" />
                                        <p>No Subtitles Found!</p>
                                    </div>
                            }
                        </div>
                    </div>

                    <div className="px-5 py-3 rounded-lg" style={{ backgroundColor: "rgba(90, 103, 217, 0.2)" }}>
                        <div className="flex items-center justify-between font-montserratBold">
                            <p>Enter Text: </p>
                            <div className="hidden items-center md:flex">
                                <p className="mr-3">Text Duration: </p>
                                <input
                                    id="startTime"
                                    data-sec={value.min}
                                    className={addTextTimeInputClasses}
                                    value={formatTime(value.min)} readOnly
                                />
                                <span className="mx-3">to</span>
                                <input
                                    id="endTime"
                                    data-sec={value.max}
                                    className={addTextTimeInputClasses}
                                    value={formatTime(value.max)} readOnly
                                />
                            </div>
                        </div>
                        <input
                            ref={subtitleRef}
                            id="textToAdd"
                            placeholder="Subtitle Text Here ...."
                            className={addTextSubtitleInputClasses}
                        />
                        <div className="flex addTextControls items-center mt-1">
                            <div className="flex-1 sliderWrapper px-5 pt-10 pb-5 border-4 border-dashed" style={{ borderColor: "rgba(90, 103, 217, 0.2)" }}>
                                <InputRange
                                    maxValue={round(state.duration, 2)}
                                    minValue={0}
                                    formatLabel={value => formatTime(value)}
                                    step={.1}
                                    value={value}
                                    onChange={value => {
                                        if (value.min < 0) value.min = 0;
                                        if (value.max > state.duration) value.max = state.duration;
                                        var min = round(value.min, 2);
                                        var max = round(value.max, 2);
                                        setValue({ min, max });
                                    }}
                                />
                            </div>
                            <div className="flex addTextBtnWrapper flex-col ml-10 w-56">
                                <button onClick={() => addText(state.publicId + ".vtt")} className={addTextBtnClasses + " mb-2"}>Add Subtitle</button>
                                <button onClick={() => history.goBack()} className={addTextBtnClasses}>Return to Dashboard</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}

export default AddText;
