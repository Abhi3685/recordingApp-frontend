import React from 'react'
import Axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { db } from '../firebase';

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

function apply(url, pid, index, history) {
    const formData = new FormData();
    formData.append('logo', document.getElementById("logo").files[0], localStorage.getItem("UUID"));
    formData.append('userId', localStorage.getItem("UUID"));
    formData.append('pid', pid);
    formData.append('vid_url', url);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    Axios.post("http://localhost:8000/watermark", formData, config)
        .then((res) => {
            if (res.data.code && res.data.code == 'Success') {
                db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
                    var userVids = doc.data().videos;
                    var name = doc.data().name;
                    userVids[index].url = res.data.secure_url.substr(0, res.data.secure_url.length - 3) + 'mp4';
                    userVids[index].thumb = res.data.secure_url.substr(0, res.data.secure_url.length - 3) + 'jpg';

                    db.collection('users').doc(localStorage.getItem("UUID")).set({
                        name,
                        videos: userVids
                    }).then(() => {
                        setTimeout(() => { history.push('/'); }, 2500);
                        console.log('Processing Success! Redirecting to dashboard!');
                    });
                });
            } else {
                alert('Error: Unhandled Exception Occured!');
                console.log(res);
            }
        }).catch((error) => {
            alert("Error: " + error);
        });
}

export default function Watermark() {
    const location = useLocation();
    const history = useHistory();

    return (
        <div className="ml-5 mt-5">

            <p>Upload company logo (png format) to add as watermark</p>

            <label className="transition duration-500 ease-in-out mt-5 w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow-lg uppercase border border-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white">
                <i className="fa fa-cloud-upload-alt fa-2x"></i>
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input onChange={onChangeHandler} type='file' id="logo" className="hidden" />
            </label>

            <div id="preview_wrapper" className="hidden">
                <img className="rounded my-5" src="" />
                <button onClick={() => apply(location.state.url, location.state.publicId, location.state.index, history)} className="bg-indigo-600 text-white px-8 py-2 rounded">Embed Watermark</button>
            </div>

        </div>
    )
}
