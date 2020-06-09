import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import axios from 'axios';
import firebase from 'firebase/app';
import moment from 'moment';

export default function Page() {
    let { pageId } = useParams();
    const [pageName, setPageName] = useState("");
    const [posts, setPosts] = useState([]);
    const [uploadImages, setUploadImages] = useState([]);
    const [uploadVideos, setUploadVideos] = useState([]);

    useEffect(() => {
        db.collection('pages').doc(pageId).get().then(page => {
            if (!page.exists) { alert('Error: No such document!'); return; }
            setPageName(page.data().name);
            setPosts(page.data().posts);
        });
    }, [pageId]);

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
            setPosts([...posts, postObj]);
            setUploadImages([]);
            setUploadVideos([]);
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
                        console.log("Updating Timeline");
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
                        console.log("Updating Timeline");
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
    }

    return (
        <>
            <div className="text-center">
                <h2 className="text-2xl text-center font-bold my-5">{pageName}</h2>
                <hr /><br />

                <div className="newPostWrapper">
                    <textarea id="postText" className="border-2 rounded-lg border-gray-400 p-3 focus:outline-none" rows="5" cols="80" placeholder="Add an insight of what's new coming up ..."></textarea><br />
                    <button onClick={handleAddPost} className="bg-indigo-600 text-white px-8 py-2 rounded mt-2">Add Post</button>
                    <label className="px-8 py-2 bg-indigo-600 rounded cursor-pointer text-white ml-5">
                        <span>Add Image/Video</span>
                        <input onChange={handleAttachment} type='file' id="postAttachment" className="hidden" />
                    </label><br />
                    <div style={{ width: '800px', whiteSpace: 'nowrap', overflowX: 'auto' }} id="attachmentPreviewWrapper" className="mt-5 mx-auto"></div>
                </div>
            </div>
            <br />
            <div className="prevPostsWrapper mx-auto" style={{ width: '600px' }}>
                <h2 className="text-2xl font-bold my-5">Update Timeline</h2>
                {
                    posts.map((post, index) =>
                        <div className="bg-gray-400 rounded p-3 mb-5" key={index}>
                            <p className="mb-2">{post.createdAt}</p>
                            <hr className="border-gray-800" />
                            <pre className="mt-2">
                                <h2>{post.text}</h2>
                            </pre>
                            <div style={{ whiteSpace: 'nowrap', overflowX: 'auto' }} className="attachmentsWrapper">
                                {
                                    post.attachments.map((attachment, index) => {
                                        var ext = attachment.split('.').pop();
                                        if (ext === 'jpg' || ext === 'png') {
                                            return (
                                                <img key={index} style={{
                                                    objectFit: 'cover',
                                                    width: '180px',
                                                    height: '150px',
                                                    display: 'inline-block',
                                                    margin: '5px',
                                                    borderRadius: '10px'
                                                }} src={attachment} />
                                            );
                                        } else {
                                            return (
                                                <video key={index} src={attachment}
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '180px',
                                                        height: '150px',
                                                        display: 'inline-block',
                                                        margin: '5px',
                                                        borderRadius: '10px'
                                                    }}></video>
                                            );
                                        }
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}
