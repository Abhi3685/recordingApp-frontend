import React, { useState, useEffect } from 'react'
import InputRange from 'react-input-range';
import ReactPlayer from 'react-player'
import 'react-input-range/lib/css/index.css';
import { useLocation, useHistory } from 'react-router-dom';
import Axios from 'axios';
import { db } from '../firebase';

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function readFile(url, setTextsArr) {
    var tmpArr = [];
    Axios.get(url).then(res => {
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

function removeBlock(idxToDelete, textsArr, setTextsArr) {
    var newArr = textsArr.filter((text, idx) => idxToDelete !== idx);
    setTextsArr(newArr);
}

function addText(textsArr, setTextsArr) {
    var text = document.getElementById("textToAdd").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;

    var startSec = (startTime + "").split(".")[0];
    var startMilliSec = (startTime + "").split(".")[1] + "00";
    var endSec = (endTime + "").split(".")[0];
    var endMilliSec = (endTime + "").split(".")[1] + "00";
    var subtitleDuration = hhmmss(startSec) + "." + startMilliSec + " --> " + hhmmss(endSec) + "." + endMilliSec;

    var newArr = [...textsArr];
    newArr.push({
        duration: subtitleDuration,
        subtitle: text
    });
    setTextsArr(newArr);
    document.getElementById("textToAdd").value = '';
}

export default function AddText() {
    const location = useLocation();
    // const history = useHistory();
    const min = (0 + location.state.duration * 0.3);
    const max = (location.state.duration - location.state.duration * 0.3);
    const [value, setValue] = useState({ min: round(min, 1), max: round(max, 1) });
    const [textsArr, setTextsArr] = useState([]);

    useEffect(() => {
        readFile("https://res.cloudinary.com/dhhtvk50h/raw/upload/v1590589732/test_ai1gvs.vtt", setTextsArr);
    }, []);

    return (
        <>
            <ReactPlayer
                controls
                className="mt-5 ml-10"
                width="720px"
                height="400px"
                url={location.state.url}
                config={{
                    attributes: {
                        crossOrigin: 'true'
                    },
                    file: {
                        tracks: [
                            { kind: 'subtitles', src: 'https://gist.githubusercontent.com/Abhi3685/55d553af64f30f6507823d016109d2b9/raw/137f89b5a0a041b0f9986986adcd7f60f45dcdbc/test.vtt', srcLang: 'en', default: true }
                        ]
                    }
                }}
            />

            <div style={{ position: 'absolute', right: 150, top: 20, width: '500px', height: '630px' }} className="bg-gray-400 rounded">
                <h2 className="text-center text-3xl font-bold tracking-wide my-5">Text List</h2>
                <div id="webvtt_wrapper" style={{ height: '500px', width: '450px', overflow: 'auto' }} className="bg-gray-200 mx-auto rounded px-5 pb-5">
                    {
                        textsArr.map((textBlock, idx) => {
                            return (
                                <div key={idx} className="flex w-full border-b-2 border-gray-500">
                                    <div className="flex items-center">
                                        <div className="flex flex-col p-4">
                                            <span className="text-md">{textBlock.duration}</span>
                                            <span className="text-md">{textBlock.subtitle}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-grow w-full items-center justify-end">
                                        <div className="flex items-center mr-2">
                                            <button onClick={() => removeBlock(idx, textsArr, setTextsArr)} className="text-lg uppercase font-semibold text-red-400 hover:text-red-600 cursor-pointer focus:outline-none"><i className="fa fa-trash ml-1"></i></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <div style={{ width: '720px' }} className="mt-5 mx-10">
                <label className="block text-gray-800 mb-2">Enter Text: </label>
                <input type="text" id="textToAdd" className="mb-5 focus:outline-none focus:border-indigo-600 w-full border-2 border-gray-400 rounded py-2 px-3 text-gray-700 mb-2" />

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
                <button onClick={() => addText(textsArr, setTextsArr)} className="bg-indigo-600 text-white px-8 py-2 rounded w-64 ml-40">Add Text</button>
            </div>
        </>
    )
}
