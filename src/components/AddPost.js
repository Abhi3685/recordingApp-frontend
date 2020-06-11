import React, { useState } from 'react'
import moment from 'moment'
import axios from 'axios';
import firebase from 'firebase/app';
import { db } from '../firebase';

export default function AddPost({ pageId, setAddPost }) {
    const [uploadImages, setUploadImages] = useState([]);
    const [uploadVideos, setUploadVideos] = useState([]);

    function handleDiscardPost() {
        setUploadImages([]);
        setUploadVideos([]);
        setAddPost(false);
    }

    function addPost(attachmentURLs) {
        var postObj = {
            text: document.getElementById("postText").value,
            attachments: attachmentURLs,
            createdAt: moment().format("DD/MM/YYYY HH:mm")
        };
        db.collection('pages').doc(pageId).update({
            posts: firebase.firestore.FieldValue.arrayUnion(postObj)
        }).then(() => {
            document.getElementById("attachmentPreviewWrapper").innerHTML = '';
            document.getElementById("postText").value = '';
            handleDiscardPost();
        }).catch(err => {
            alert(err);
            console.log(err);
        });
    }

    function handleAddPost() {
        var total = uploadImages.length + uploadVideos.length;
        var attachmentURLs = [];
        console.log("Uploading Attachments");

        uploadImages.forEach(image => {
            var formData = new FormData();
            formData.append("upload_preset", "fjssudg9");
            formData.append("file", image);

            axios.post('https://api.cloudinary.com/v1_1/dhhtvk50h/upload', formData)
                .then(res => {
                    attachmentURLs.push(res.data.secure_url);
                    if (attachmentURLs.length === total) {
                        console.log("Updating Page Timeline");
                        addPost(attachmentURLs);
                    }
                })
                .catch(err => {
                    alert(err);
                    console.log(err);
                });
        });

        uploadVideos.forEach(video => {
            var formData = new FormData();
            formData.append("upload_preset", "fjssudg9");
            formData.append("file", video);

            axios.post('https://api.cloudinary.com/v1_1/dhhtvk50h/upload', formData)
                .then(res => {
                    attachmentURLs.push(res.data.secure_url);
                    if (attachmentURLs.length === total) {
                        console.log("Updating Page Timeline");
                        addPost(attachmentURLs);
                    }
                })
                .catch(err => {
                    alert(err);
                    console.log(err);
                });
        });
    }

    function handleAttachment() {
        var file = document.getElementById("postAttachment").files[0];
        var container = document.getElementById("attachmentPreviewWrapper");
        if (!file) return;
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function (e) {
                var img = new Image();
                img.src = reader.result;
                container.appendChild(img);
                setUploadImages([...uploadImages, reader.result]);
            }
        } else if (file.type === 'video/mp4') {
            if (file.size / 1024 / 1024 / 1024 > 1) return alert('File is too large (1GB Max)');
            var video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.controls = true;
            container.appendChild(video);
            setUploadVideos([...uploadVideos, file]);
        } else {
            alert('File Type Not Supported! Only jpeg, png and mp4 files are allowed.');
        }
        document.getElementById("postAttachment").value = '';
    }

    return (
        <div className="newPostWrapper">
            <h2 className="font-bold text-2xl mb-3 text-center">Create Post</h2>
            <hr />
            <textarea id="postText" className="w-full mt-5 border-2 rounded-lg border-gray-400 p-3 focus:outline-none focus:border-indigo-600" rows="5" placeholder="Add an insight of what's new coming up ..."></textarea><br />
            <div className="text-center">
                <button onClick={handleAddPost} className="bg-indigo-600 text-white px-8 py-2 rounded mt-2">Add Post</button>
                <label className="px-8 py-2 bg-indigo-600 rounded cursor-pointer text-white ml-5">
                    <span>Add Image/Video</span>
                    <input onChange={handleAttachment} type='file' id="postAttachment" className="hidden" />
                </label>
                <button onClick={handleDiscardPost} className="bg-red-600 text-white px-6 py-2 rounded mt-2 ml-5">Discard Post</button>
            </div>
            <br />
            <div style={{ width: '800px', whiteSpace: 'nowrap', overflowX: 'auto' }} id="attachmentPreviewWrapper" className="mt-5 mx-auto"></div>
        </div>
    )
}
