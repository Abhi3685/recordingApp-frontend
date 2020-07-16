import React, { useState, useRef } from 'react'
import Axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { db } from '../firebase';
import Navbar from './Navbar';
import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';

import DesignElement4 from '../assets/images/DesignElement4.png';
import DesignElement3 from '../assets/images/DesignElement3.png';
import Cloud_Upload_Icon from '../assets/images/Cloud_Upload_Icon.png';
import loader from '../assets/images/loader.gif';

export default function Watermark() {
    const location = useLocation();
    const history = useHistory();
    const willMount = useRef(true);

    if (willMount.current) {
        if (!location.state) history.goBack();
        willMount.current = false;
    }

    const [modalIsOpen, setIsOpen] = useState(false);
    const [filename, setFilename] = useState("");
    const [vidUrl, setVidUrl] = useState(location.state.url);
    const [loading, setLoading] = useState(false);

    function onChangeHandler() {
        var file = document.getElementById("logo").files[0];
        if (!file) return;
        if (file.type !== 'image/png') {
            return alert('File Extension Not Accepted! Please Upload PNG File Only.');
        }
        setFilename(file.name);
    }

    function apply() {
        if (!document.getElementById("logo").files[0]) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("upload_preset", "fjssudg9");
        formData.append('file', document.getElementById("logo").files[0]);
        Axios.post('https://api.cloudinary.com/v1_1/dhhtvk50h/upload', formData)
            .then(res => {
                var pid = res.data.public_id;
                var idx = vidUrl.lastIndexOf("/");
                var part1 = vidUrl.substr(0, idx + 1);
                var parts = part1.split("/");
                if (parts[parts.length - 2] !== "upload") {
                    parts.pop();
                    parts.pop();
                    parts.push("");
                    part1 = parts.join("/");
                }
                var part2 = vidUrl.substr(idx);
                var newURL = part1 + "l_" + pid + ",w_150,o_80,g_south_east,x_10,y_50" + part2;
                newURL = newURL.substr(0, newURL.length - 3) + "mkv";
                setVidUrl(newURL);
                setIsOpen(true);
                setLoading(false);
            })
            .catch(err => alert(err));
    }

    function saveChanges(index) {
        db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
            var userVids = doc.data().videos;
            userVids[index].url = vidUrl;

            db.collection('users').doc(localStorage.getItem("UUID")).set({
                fullname: doc.data().fullname,
                videos: userVids,
                pages: doc.data().pages
            }).then(() => {
                history.push('/dashboard');
            });
        }).catch(err => {
            alert("Error: Unhandled Exception Occured!");
            console.log(err);
        });
    }

    return (
        <>
            {loading && <div className="absolute z-50 flex items-center justify-center w-full h-full bg-white" style={{ opacity: 0.98 }}>
                <img src={loader} alt="" className="w-full md:w-8/12" />
            </div>}

            <div className="fixed top-0 bottom-0 left-0 right-0 overflow-y-auto" style={{ backgroundColor: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 w-32 p-3" />
                <img src={DesignElement4} alt="" className="absolute right-0 w-32 p-3" style={{ top: 75 }} />
                <div className={"flex flex-col items-center justify-center bg-white relative w-11/12 lg:w-2/3 mt-10 mb-8 mx-auto rounded p-5" + (modalIsOpen ? " hidden" : " block")} style={{ height: "calc(100% - 150px)" }}>
                    <img src={DesignElement3} alt="" className="absolute top-0 w-32 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="absolute bottom-0 w-32 transform -rotate-90" style={{ left: -20 }} />

                    <i onClick={() => history.goBack()} className="absolute top-0 left-0 p-5 text-xl text-gray-600 cursor-pointer fa fa-arrow-left" />
                    <p className="mb-10 text-lg text-center font-montserratSemiBold">Upload logo (png format) to add as watermark</p>
                    <label className="flex flex-col items-center w-full pt-4 pb-3 text-indigo-600 transition duration-500 ease-in-out bg-white border-4 border-dashed rounded-lg cursor-pointer sm:w-2/3 lg:w-5/12" style={{ borderColor: "rgba(90, 103, 217, 0.2)" }}>
                        <img src={Cloud_Upload_Icon} className="w-48" alt="" />
                        <span className="mt-2 text-base tracking-wide font-montserratSemiBold" style={{ color: "rgba(90, 103, 217, 0.5)" }}>Select a file</span>
                        <input onChange={onChangeHandler} type='file' id="logo" className="hidden" />
                    </label>
                    <p className="mt-5 mb-10" style={{ color: "rgba(90, 103, 217, 0.5)" }}>{filename}</p>
                    <button onClick={apply} className="block w-56 py-2 text-white bg-green-700 rounded hover:bg-green-600 focus:outline-none">Preview Video</button>
                </div>
                <div className={"bg-white relative flex flex-col items-center justify-center w-11/12 lg:w-2/3 mt-10 mb-8 mx-auto rounded p-5" + (modalIsOpen ? " block" : " hidden")} style={{ height: "calc(100% - 150px)" }}>
                    <img src={DesignElement3} alt="" className="absolute top-0 w-32 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="absolute bottom-0 w-32 transform -rotate-90" style={{ left: -20 }} />

                    <i onClick={() => setIsOpen(false)} className="absolute top-0 left-0 p-5 text-xl text-gray-600 cursor-pointer fa fa-arrow-left" />
                    <div className="w-full">
                        <div className="w-full mx-auto mb-5 lg:w-2/3">
                            <Player src={vidUrl}>
                                <BigPlayButton position="center" />
                                <LoadingSpinner />
                            </Player>
                        </div>
                        <button onClick={() => saveChanges(location.state.index)} className="block w-64 py-2 mx-auto text-white bg-green-700 rounded hover:bg-green-600 focus:outline-none">Apply & Save Changes</button>
                    </div>
                </div>
            </div>
        </>
    )
}
