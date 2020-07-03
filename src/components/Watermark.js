import React, { useState, useRef } from 'react'
import Axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { db } from '../firebase';
import Navbar from './Navbar';
import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';

import DesignElement4 from '../assets/images/DesignElement4.png';
import DesignElement3 from '../assets/images/DesignElement3.png';
import Cloud_Upload_Icon from '../assets/images/Cloud_Upload_Icon.png';

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
                setVidUrl(newURL);
                setIsOpen(true);
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
            <div className="fixed left-0 right-0 bottom-0 top-0" style={{ backgroundColor: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 p-3 w-32" />
                <img src={DesignElement4} alt="" className="absolute right-0 p-3 w-32" style={{ top: 75 }} />
                <div className={"bg-white relative w-2/3 mt-10 mx-auto rounded p-5" + (modalIsOpen ? " hidden" : " block")}>
                    <img src={DesignElement3} alt="" className="w-32 absolute top-0 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="w-32 absolute bottom-0 transform -rotate-90" style={{ left: -20 }} />

                    <i onClick={() => history.goBack()} className="fa fa-arrow-left cursor-pointer text-gray-600 text-xl" />
                    <p className="text-center font-montserratSemiBold mt-5 text-lg">Upload logo (png format) to add as watermark</p>
                    <label className="w-5/12 transition duration-500 ease-in-out mt-12 mx-auto flex flex-col items-center pt-4 pb-3 bg-white text-indigo-600 rounded-lg border-dashed border-4 cursor-pointer" style={{ borderColor: "rgba(90, 103, 217, 0.2)" }}>
                        <img src={Cloud_Upload_Icon} className="w-48" alt="" />
                        <span className="mt-2 font-montserratSemiBold text-base tracking-wide" style={{ color: "rgba(90, 103, 217, 0.5)" }}>Select a file</span>
                        <input onChange={onChangeHandler} type='file' id="logo" className="hidden" />
                    </label>
                    <p className="text-center mt-5" style={{ color: "rgba(90, 103, 217, 0.5)" }}>{filename}</p>
                    <button onClick={apply} className="block w-64 mx-auto py-2 text-white bg-green-700 rounded hover:bg-green-600 focus:outline-none mt-16 mb-10">Preview Video</button>
                </div>
                <div className={"bg-white relative w-2/3 mt-10 mx-auto rounded p-5" + (modalIsOpen ? " block" : " hidden")}>
                    <img src={DesignElement3} alt="" className="w-32 absolute top-0 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="w-32 absolute bottom-0 transform -rotate-90" style={{ left: -20 }} />

                    <i onClick={() => setIsOpen(false)} className="fa fa-arrow-left cursor-pointer text-gray-600 text-xl" />
                    <div className="w-2/3 mx-auto mt-5">
                        <Player src={vidUrl}>
                            <BigPlayButton position="center" />
                            <LoadingSpinner />
                            <ControlBar autoHide={false} />
                        </Player>
                    </div>
                    <button onClick={() => saveChanges(location.state.index)} className="block w-64 mx-auto py-2 text-white bg-green-700 rounded hover:bg-green-600 focus:outline-none mt-10 mb-10">Apply & Save Changes</button>
                </div>
            </div>
        </>
    )
}
