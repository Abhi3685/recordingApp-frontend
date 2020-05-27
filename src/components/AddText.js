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

function readFile(url) {
    Axios.get(url).then(res => {
        const objDiv = document.getElementById('webvtt_wrapper');
        var data = res.data.substring(res.data.indexOf("\n\n") + 2);
        data.split("\n\n").map(function (item) {
            console.log("Here!");
            var parts = item.split("\n");
            var texthtml = `
                <div class="flex w-full border-b-2 border-gray-500">
                    <div class="flex items-center">
                        <div class="flex flex-col p-4">
                            <span class="text-md">`+ parts[1] + `</span>
                            <span class="text-md">`+ parts[2] + `</span>
                        </div>
                    </div>
                    <div class="flex flex-1 flex-grow w-full items-center justify-end">
                        <div class="flex items-center mr-2">
                            <a class="text-lg uppercase font-semibold text-red-400 hover:text-red-600 cursor-pointer">Delete <i class="fa fa-trash ml-1"></i></a>
                        </div>
                    </div>
                </div>`;
            objDiv.innerHTML += texthtml;
        });
        objDiv.scrollTop = objDiv.scrollHeight;
    });
}

function addText() {
    var text = document.getElementById("textToAdd").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;

    console.log(text + " " + startTime + " " + endTime);

    document.getElementById("textToAdd").value = '';
}

export default function AddText() {
    const location = useLocation();
    // const history = useHistory();
    const min = (0 + location.state.duration * 0.3);
    const max = (location.state.duration - location.state.duration * 0.3);
    const [value, setValue] = useState({ min: round(min, 1), max: round(max, 1) });

    useEffect(() => {
        readFile("https://gist.githubusercontent.com/Abhi3685/55d553af64f30f6507823d016109d2b9/raw/e84252cf204ef24f2a795cb6b160d1a9c3ba5294/test.vtt");
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
                            { kind: 'subtitles', src: 'https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt', srcLang: 'en', default: true }
                        ]
                    }
                }}
            />

            <div style={{ position: 'absolute', right: 150, top: 20, width: '500px', height: '630px' }} className="bg-gray-400 rounded">
                <h2 className="text-center text-3xl font-bold tracking-wide my-5">Text List</h2>
                <div id="webvtt_wrapper" style={{ height: '500px', width: '450px', overflow: 'auto' }} className="bg-gray-200 mx-auto rounded p-5"></div>
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
                <button onClick={addText} className="bg-indigo-600 text-white px-8 py-2 rounded w-64 ml-40">Add Text</button>
            </div>
        </>
    )
}
