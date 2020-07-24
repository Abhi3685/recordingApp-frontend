import React, { useState, useRef, useCallback } from 'react'
import Axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { Player, BigPlayButton, LoadingSpinner } from 'video-react';

import { db } from '../firebase';
import Navbar from './Navbar';
import Loader from './Loader';
import DesignElement4 from '../assets/images/DesignElement4.png';
import DesignElement3 from '../assets/images/DesignElement3.png';
import Cloud_Upload_Icon from '../assets/images/Cloud_Upload_Icon.png';
import {
    watermarkContainerClasses,
    watermarkUploadLabelClasses,
    leftIconClasses,
    watermarkBtnClasses
} from '../utils/classes';

function Watermark() {
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
    const logoRef = useRef(null);

    const onChangeHandler = useCallback(() => {
        var file = logoRef.current.files[0];
        if (!file) return;
        if (file.type !== 'image/png') {
            return alert('File Extension Not Accepted! Please Upload PNG File Only.');
        }
        setFilename(file.name);
    }, []);

    const apply = useCallback(() => {
        if (!logoRef.current.files[0]) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("upload_preset", "fjssudg9");
        formData.append('file', logoRef.current.files[0]);
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
            }).catch(err => alert(err));
    }, [vidUrl]);

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
        <React.Fragment>
            <Loader loading={loading} />

            <div className="fixed top-0 bottom-0 left-0 right-0 overflow-y-auto" style={{ backgroundColor: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 w-32 p-3" />
                <img src={DesignElement4} alt="" className="absolute right-0 w-32 p-3" style={{ top: 75 }} />
                <div className={watermarkContainerClasses + (modalIsOpen ? " hidden" : " block")} style={{ height: "calc(100% - 150px)" }}>
                    <img src={DesignElement3} alt="" className="absolute top-0 w-32 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="absolute bottom-0 w-32 transform -rotate-90" style={{ left: -20 }} />

                    <i onClick={() => history.goBack()} className={leftIconClasses} />
                    <p className="mb-10 text-lg text-center font-montserratSemiBold">Upload logo (png format) to add as watermark</p>
                    <label className={watermarkUploadLabelClasses} style={{ borderColor: "rgba(90, 103, 217, 0.2)" }}>
                        <img src={Cloud_Upload_Icon} className="w-48" alt="" />
                        <span
                            className="mt-2 text-base tracking-wide font-montserratSemiBold"
                            style={{ color: "rgba(90, 103, 217, 0.5)" }}
                        >Select a file</span>
                        <input ref={logoRef} onChange={onChangeHandler} type='file' id="logo" className="hidden" />
                    </label>
                    <p className="mt-5 mb-10" style={{ color: "rgba(90, 103, 217, 0.5)" }}>{filename}</p>
                    <button onClick={apply} className={watermarkBtnClasses + " w-56"}>Preview Video</button>
                </div>
                <div className={watermarkContainerClasses + (modalIsOpen ? " block" : " hidden")} style={{ height: "calc(100% - 150px)" }}>
                    <img src={DesignElement3} alt="" className="absolute top-0 w-32 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="absolute bottom-0 w-32 transform -rotate-90" style={{ left: -20 }} />

                    <i onClick={() => setIsOpen(false)}
                        className="absolute top-0 left-0 p-5 text-xl text-gray-600 cursor-pointer fa fa-arrow-left"
                    />
                    <div className="w-full">
                        <div className="w-full mx-auto mb-5 lg:w-2/3">
                            <Player src={vidUrl}>
                                <BigPlayButton position="center" />
                                <LoadingSpinner />
                            </Player>
                        </div>
                        <button
                            onClick={() => saveChanges(location.state.index)}
                            className={watermarkBtnClasses + " w-64 mx-auto"}
                        >Apply & Save Changes</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Watermark;
