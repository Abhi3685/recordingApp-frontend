import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { db } from '../firebase';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';

function onChangeHandler() {
    var file = document.getElementById("logo").files[0];
    if (file.type !== 'image/png') {
        return alert('File Extension Not Accepted! Please Upload PNG File Only.');
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function (e) {
        document.querySelector('img').src = reader.result;
        document.querySelector('#preview_wrapper').style.display = 'block';
    }
}

function apply(url, setIsOpen, setVidUrl) {
    const formData = new FormData();
    formData.append("upload_preset", "fjssudg9");
    formData.append('file', document.getElementById("logo").files[0]);
    Axios.post('https://api.cloudinary.com/v1_1/dhhtvk50h/upload', formData)
        .then(res => {
            var pid = res.data.public_id;
            var idx = url.lastIndexOf("/");
            var part1 = url.substr(0, idx);
            var idx2 = part1.lastIndexOf("/");
            part1 = part1.substr(0, idx2 + 1);
            var part2 = url.substr(idx);
            var newURL = part1 + "l_" + pid + ",w_120,o_80,g_south_east,x_10,y_50" + part2;
            console.log(newURL);

            setVidUrl(newURL);
            setIsOpen(true);
        })
        .catch(err => alert(err));
}

function saveChanges(url, index, history) {
    db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
        var userVids = doc.data().videos;
        userVids[index].url = url;

        db.collection('users').doc(localStorage.getItem("UUID")).set({
            fullname: doc.data().fullname,
            videos: userVids,
            pages: doc.data().pages
        }).then(() => {
            history.push('/');
        });
    }).catch(err => {
        alert("Error: Unhandled Exception Occured!");
        console.log(err);
    });
}

export default function Watermark() {
    const location = useLocation();
    const history = useHistory();
    const willMount = useRef(true);

    if (willMount.current) {
        if (!location.state) history.goBack();
        willMount.current = false;
    }

    const [modalIsOpen, setIsOpen] = useState(false);
    const [vidUrl, setVidUrl] = useState(location.state.url);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <div>
                <p>Upload company logo (png format) to add as watermark</p>

                <label className="transition duration-500 ease-in-out mt-5 flex flex-col items-center py-4 bg-white text-blue-600 rounded-lg uppercase border border-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white">
                    <i className="fa fa-cloud-upload-alt fa-2x"></i>
                    <span className="mt-2 text-base leading-normal">Select a file</span>
                    <input onChange={onChangeHandler} type='file' id="logo" className="hidden" />
                </label>

                <div id="preview_wrapper" className="hidden">
                    <img alt="Watermark Preview" className="rounded my-5 w-64 mx-auto" src="" />
                    <button onClick={() => apply(location.state.url, setIsOpen, setVidUrl)} className="block bg-indigo-600 text-white py-2 rounded w-64 mx-auto">Preview Video</button>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
            >
                <div className="flex flex-col">
                    <ReactPlayer
                        controls
                        width="720px"
                        height="400px"
                        url={vidUrl}
                    />
                    <button onClick={() => saveChanges(vidUrl, location.state.index, history)} className="bg-indigo-600 text-white px-8 py-2 rounded mt-5">Apply & Save Changes</button>
                </div>
            </Modal>
        </div>
    )
}
