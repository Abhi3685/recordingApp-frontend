import React, { useState, useEffect, useRef } from 'react'
import InputRange from 'react-input-range';
import ReactPlayer from 'react-player'
import 'react-input-range/lib/css/index.css';
import { useLocation, useHistory } from 'react-router-dom';
import Axios from 'axios';
import Navbar from './Navbar';

import DesignElement4 from '../assets/images/DesignElement4.png';
import alarmClock from '../assets/images/alarmClock.png';
import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';
import { formatTime } from '../utils';

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function readFile(url, setTextsArr) {
    var tmpArr = [];
    Axios.get(url).then(res => {
        if (res.data.indexOf('\n') < 0) return;
        var data = res.data.substring(res.data.indexOf("\n\n") + 2);
        data.split("\n\n").forEach(function (item) {
            var parts = item.split("\n");
            tmpArr.push({
                duration: parts[0],
                subtitle: parts[1]
            });
        });
        setTextsArr(tmpArr);
    });
}

function pad(num) {
    return ("0" + num).slice(-2);
}
function hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function removeBlock(idxToDelete, textsArr, setTextsArr, filename, setPlayerKey) {
    var newArr = textsArr.filter((text, idx) => idxToDelete !== idx);
    saveChanges(newArr, filename);
    setTextsArr(newArr);
    setPlayerKey(new Date().getSeconds());
}

function saveChanges(arr, filename) {
    var fileTxt = "WEBVTT";
    arr.forEach(block => {
        fileTxt += "\n\n" + block.duration + "\n" + block.subtitle;
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

function addText(textsArr, setTextsArr, filename, setPlayerKey) {
    var text = document.getElementById("textToAdd").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;

    var startSec = (startTime + "").split(".")[0];
    var startMilliSec = (startTime + "").split(".")[1] ? (startTime + "").split(".")[1] + "00" : "000";
    var endSec = (endTime + "").split(".")[0];
    var endMilliSec = (endTime + "").split(".")[1] ? (endTime + "").split(".")[1] + "00" : "000";
    var subtitleDuration = hhmmss(startSec) + "." + startMilliSec + " --> " + hhmmss(endSec) + "." + endMilliSec;

    var newArr = [...textsArr];
    newArr.push({
        duration: subtitleDuration,
        subtitle: text
    });

    saveChanges(newArr, filename);
    setTextsArr(newArr);
    setPlayerKey(new Date().getSeconds());
    document.getElementById("textToAdd").value = '';
}

export default function AddText() {
    const location = useLocation();
    const history = useHistory();
    const willMount = useRef(true);

    if (willMount.current) {
        if (!location.state) history.goBack();
        willMount.current = false;
    }
    const min = (0 + location.state.duration * 0.3);
    const max = (location.state.duration - location.state.duration * 0.3);
    const [value, setValue] = useState({ min: round(min, 1), max: round(max, 1) });
    const [textsArr, setTextsArr] = useState([]);
    const [playerKey, setPlayerKey] = useState(new Date().getTime());

    useEffect(() => {
        readFile("http://localhost:8000/" + location.state.publicId + ".vtt", setTextsArr);
    }, [location.state.publicId]);

    return (
        <>
            <div className="fixed left-0 right-0 bottom-0 top-0" style={{ backgroundColor: "#5A67D9", overflow: 'auto' }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 p-3 w-32" />
                <img src={DesignElement4} alt="" className="absolute right-0 p-3 w-32" style={{ top: 75 }} />

                <div className="bg-white relative flex flex-col mt-5 mx-auto rounded px-5 py-4" style={{ width: '97%', marginBottom: 15 }}>

                    <div className="addTextUpperWrapper flex items-center mb-5 rounded-lg">
                        <div className="flex-1">
                            <div className="addTextPlayerWrapper w-8/12 mx-auto">
                                <Player src={location.state.url}>
                                    <BigPlayButton position="center" />
                                    <LoadingSpinner />
                                    <ControlBar autoHide={false} />
                                </Player>
                            </div>
                        </div>
                        <div className="text-center subtitleContainer font-montserratSemiBold mr-16 flex flex-col items-center" style={{ width: '35%' }}>
                            <h1 className="text-xl mb-3">Video Subtitles</h1>
                            <div style={{ height: 300 }} className="overflow-y-auto subtitlesWrapper sm:pr-10">
                                {
                                    Array(6).fill(0).map(i =>
                                        <div className="flex w-full mb-5">
                                            <div className="mr-5 w-64">
                                                <img src={alarmClock} alt="" className="hidden sm:inline-block mr-3" /> 00:00:02,000<br />
                                                <img src={alarmClock} alt="" className="hidden sm:inline-block mr-3" /> 00:00:05,000
                                        </div>
                                            <div className="relative w-full px-3 py-1 rounded-lg" style={{ backgroundColor: "rgba(90, 103, 217, 0.2)" }}>
                                                <p className="text-left text-sm font-montserratRegular subtitleWrapper" style={{ maxWidth: 220, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pretty Long Subtitle Coming here that you might want to not see and understand.</p>
                                                <i className="fa fa-trash absolute text-red-600" style={{ top: 15, right: 10 }} />
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-3 rounded-lg" style={{ backgroundColor: "rgba(90, 103, 217, 0.2)" }}>
                        <div className="flex items-center justify-between font-montserratBold">
                            <p>Enter Text: </p>
                            <div className="hidden items-center md:flex">
                                <p className="mr-3">Text Duration: </p>
                                <input type="text" className="w-40 px-4 py-1 border border-gray-600 rounded-lg focus:outline-none opacity-50" />
                                <span className="mx-3">to</span>
                                <input type="text" className="w-40 px-4 py-1 border border-gray-600 rounded-lg focus:outline-none opacity-50" />
                            </div>
                        </div>
                        <input type="text" className="w-full my-3 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none" />
                        <div className="flex addTextControls items-center mt-1">
                            <div className="flex-1 sliderWrapper px-5 pt-10 pb-5 border-4 border-dashed" style={{ borderColor: "rgba(90, 103, 217, 0.2)" }}>
                                <InputRange
                                    maxValue={round(location.state.duration, 2)}
                                    minValue={0}
                                    formatLabel={value => formatTime(value)}
                                    step={.1}
                                    value={value}
                                    onChange={value => {
                                        if (value.min < 0) value.min = 0;
                                        if (value.max > location.state.duration) value.max = location.state.duration;
                                        var min = round(value.min, 2);
                                        var max = round(value.max, 2);
                                        setValue({ min, max });
                                    }} />
                            </div>
                            <div className="flex addTextBtnWrapper flex-col ml-10 w-56">
                                <button className="bg-indigo-600 text-white py-2 rounded w-full mb-2">Add Subtitle</button>
                                <button className="bg-indigo-600 text-white py-2 rounded w-full">Return to Dashboard</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* <div style={{ width: '1530px', minWidth: '1530px' }} className="flex mainWrapper h-screen">
                <div className="leftPart flex flex-col flex-1 bg-gray-800">
                    <div className="playerWrapper flex flex-1 items-center justify-center">
                        <ReactPlayer
                            controls
                            height="360px"
                            key={playerKey}
                            url={location.state.url}
                            config={{
                                attributes: {
                                    crossOrigin: 'true'
                                },
                                file: {
                                    tracks: [
                                        { kind: 'subtitles', src: "http://localhost:8000/" + location.state.publicId + ".vtt", srcLang: 'en', default: true }
                                    ]
                                }
                            }}
                        />
                    </div>
                    <div className="controlsWrapper bg-gray-500 h-64 p-5">
                        <label className="block mb-2">Enter Text: </label>
                        <input type="text" id="textToAdd" className="focus:outline-none focus:border-indigo-600 w-full border-2 border-gray-400 rounded py-2 px-3 text-gray-700 mb-2" />
                        <InputRange
                            maxValue={round(location.state.duration, 2)}
                            minValue={0}
                            formatLabel={value => ``}
                            step={.1}
                            value={value}
                            onChange={value => {
                                if (value.min < 0) value.min = 0;
                                if (value.max > location.state.duration) value.max = location.state.duration;
                                var min = round(value.min, 2);
                                var max = round(value.max, 2);
                                setValue({ min, max });
                            }} />

                        <p className="mb-2 mt-5">Text duration: </p>
                        <input id="startTime" className="rounded bg-gray-300 w-32 px-5 py-2" value={value.min} readOnly />
                        <span className="ml-4 mr-4">to</span>
                        <input id="endTime" className="rounded bg-gray-300 w-32 px-5 py-2" value={value.max} readOnly />
                        <button onClick={() => addText(textsArr, setTextsArr, location.state.publicId + ".vtt", setPlayerKey)} className="bg-indigo-600 text-white px-8 py-2 rounded w-64 ml-40">Add Text</button>
                    </div>
                </div>
                <div className="rightPart items-center flex-1">
                    <div className="bg-gray-400 flex h-screen justify-center items-center">
                        <div>
                            <h2 className="text-center text-3xl mb-2 font-bold tracking-wide">Subtitle List</h2>
                            <div id="webvtt_wrapper" style={{ height: '550px', width: '450px', overflow: 'auto' }} className="bg-gray-200 mx-auto rounded px-5 pb-5">
                                {
                                    textsArr.map((textBlock, idx) => {
                                        return (
                                            <div key={idx} className="flex w-full border-b-2 border-gray-500">
                                                <div className="flex">
                                                    <div className="flex flex-col py-4 pr-4 pl-2">
                                                        <span className="text-md">{textBlock.duration}</span>
                                                        <span className="text-md">{textBlock.subtitle}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 flex-grow w-full justify-end">
                                                    <div className="flex mr-2">
                                                        <button onClick={() => removeBlock(idx, textsArr, setTextsArr, location.state.publicId + ".vtt", setPlayerKey)} className="text-lg uppercase font-semibold text-red-400 hover:text-red-600 cursor-pointer focus:outline-none"><i className="fa fa-trash ml-1"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}
