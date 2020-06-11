import React, { useEffect, useState } from 'react'
import RecordRTC from 'recordrtc';
import Draggable from 'react-draggable';
import { useHistory } from 'react-router-dom';
import { db } from '../firebase';
import Moment from 'react-moment';
import Modal from 'react-modal';
import firebase from "firebase/app";
import AddPost from './AddPost';
import Axios from 'axios';

var recorder, video, dragCircle, myCamera;

function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (camera) {
        callback(camera);
    }).catch(function (error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}

var start = () => {
    captureCamera(function (camera) {
        myCamera = camera;
        video.muted = true;
        video.volume = 0;
        video.srcObject = camera;

        recorder = RecordRTC(camera, {
            type: 'video',
            disableLogs: true
        });

        recorder.startRecording();
    });
}

function getConfig(history) {
    var mode = document.getElementsByName("mode_options")[0].value;
    var isAudioEnabled = document.getElementsByName("isAudioEnabled")[0].value === "Yes" ? 1 : 0;
    var camPosition = dragCircle.getBoundingClientRect();
    var top = camPosition.top;
    var left = camPosition.left;
    history.push('/recorder', {
        mode, isAudioEnabled, top, left
    });
    clearConfig();
}

function clearConfig() {
    if (recorder) {
        recorder.stopRecording(function () {
            myCamera.getTracks().forEach(function (track) {
                track.stop();
            });
        });
    }
}

function formatTime(secs) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")
}

function toggleMenu(e) {
    var menuRef = e.target.parentElement.querySelector(".menuWrapper");
    if (menuRef.style.display === 'none' || menuRef.style.display === '') {
        menuRef.style.display = 'block';
    } else {
        menuRef.style.display = 'none';
    }
}

function Home() {
    let history = useHistory();
    const [videos, setVideos] = useState([]);
    const [pages, setPages] = useState([]);
    const [user, setUser] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isAddPostActive, setAddPost] = useState(false);
    const [currPage, setCurrPage] = useState("");

    useEffect(() => {
        video = document.querySelector('video');
        dragCircle = document.querySelector('.dragCircle');
        if (localStorage.getItem("UUID")) {
            db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
                if (!doc.exists) { alert('Error: No such document!'); return; }
                setUser(doc.data().fullname);
                setVideos(doc.data().videos);
                setPages(doc.data().pages);
            });
        }
    }, []);

    function handleCreatePage() {
        var page_name = document.getElementById("page_name").value;

        db.collection('pages').add({ name: page_name, posts: [] }).then(docRef => {
            var pageObj = {
                id: docRef.id,
                name: page_name
            };
            db.collection('users').doc(localStorage.getItem("UUID")).update({
                pages: firebase.firestore.FieldValue.arrayUnion(pageObj)
            }).then(() => {
                setIsOpen(false);
                setPages([...pages, pageObj]);
            });
        });
    }

    function handleModeChange(e) {
        if (e.target.value === 'Screen Only') {
            document.querySelector(".dragCircle").style.display = 'none';
            clearConfig();
        } else {
            start();
            document.querySelector(".dragCircle").style.display = 'block';
        }
    }

    function handleDelete(video_Obj, index) {
        db.collection('users').doc(localStorage.getItem("UUID")).update({
            videos: firebase.firestore.FieldValue.arrayRemove(video_Obj)
        }).then(() => {
            var newVideos = [...videos];
            newVideos.splice(index, 1);
            setVideos(newVideos);
            Axios.delete("http://localhost:8000/video/" + video_Obj.publicId);
        }).catch(err => {
            alert("Error: Unhandled Exception Occured!");
            console.log(err);
        });
    }

    return (
        <div className="parent">
            {
                localStorage.getItem("UUID") == null ?
                    <div className="flex flex-col text-center h-screen justify-center">
                        <h1 style={{ fontSize: '70px', fontWeight: 'bold', textTransform: 'uppercase' }}>Recorder App</h1>
                        <p className="mb-10 text-lg">The expressiveness of video with the convenience of messaging.
                            <br />Communicate more effectively wherever you work.</p>
                        <div>
                            <button onClick={() => history.push('signin')} className="transition duration-300 ease-in bg-indigo-600 shadow-xl hover:shadow-none text-white px-10 py-2 rounded mx-2">Sign In</button>
                            <button onClick={() => history.push('signup')} className="transition duration-300 ease-in bg-indigo-600 shadow-xl hover:shadow-none text-white px-10 py-2 rounded mx-2">Sign Up</button>
                        </div>
                    </div> :
                    <>
                        <div className="absolute flex flex-col justify-between sidebar border-r-2 border-gray-300 h-screen w-64">
                            <div className="mt-3">
                                <button className="shadow-md block mx-auto w-56 bg-indigo-600 text-white px-8 py-2 rounded mb-3" onClick={() => { start(); document.querySelector(".config_wrapper").style.display = 'block'; }}>New Video</button>
                                <button className="shadow-md block mx-auto w-56 bg-indigo-600 text-white px-8 py-2 rounded" onClick={() => setIsOpen(true)}>Create Product Page</button>
                            </div>
                            <div>
                                <p className="text-center mb-2">Logged in as <span className="font-bold">{user}</span></p>
                                <button onClick={() => { localStorage.removeItem("UUID"); window.location.reload(); }} className="shadow-md block mx-auto w-56 mb-3 bg-indigo-600 text-white px-8 py-2 rounded">Logout</button>
                            </div>
                        </div>
                        <div className="mainWrapper ml-64 pl-5 pt-2" style={{ minWidth: '1100px' }}>
                            <div className="myVideosWrapper mb-10">
                                <h1 className="text-2xl font-bold">My Videos</h1>
                                <hr className="w-40 mt-2 mb-6 border-gray-500" />
                                {
                                    videos.length > 0 ?
                                        <div className="grid grid-flow-row grid-cols-3 gap-5 mr-10">
                                            {videos.map((video, index) =>
                                                <div className="relative" key={index}>
                                                    <img onClick={() => history.push('/player/' + video.publicId)} alt="Video Thumbnail" width="100%" className="rounded shadow-md cursor-pointer" src={video.thumb} />
                                                    <h2 className="font-bold text-lg mt-3">{video.name}</h2>
                                                    <p className="text-gray-600">{formatTime(video.duration)} • <Moment fromNow>{video.createdAt}</Moment></p>
                                                    <i onClick={toggleMenu} className="fa fa-bars cursor-pointer absolute" style={{ fontSize: 25, bottom: 10, right: 10 }}></i>
                                                    <div className="hidden menuWrapper absolute bg-gray-300 rounded shadow-lg p-2" style={{ bottom: 45, right: 5 }}>
                                                        <button className="block w-full hover:bg-gray-400 rounded px-5 mb-1" onClick={() => { history.push('/trim', { ...video, index }); }}>Trim</button>
                                                        <button className="block w-full hover:bg-gray-400 rounded px-5 mb-1" onClick={() => { history.push('/addText', { ...video, index }); }}>Add Text</button>
                                                        <button className="block w-full hover:bg-gray-400 rounded px-5 mb-1" onClick={() => { history.push('/watermark', { ...video, index }); }}>Watermark</button>
                                                        <button className="block text-red-400 w-full hover:bg-red-400 hover:text-white rounded px-5 mb-1" onClick={() => handleDelete(video, index)}>Delete</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        :
                                        <div className="flex flex-col h-56 justify-center items-center mx-auto" style={{ width: '500px' }}>
                                            <p className="font-bold text-xl mb-5">You don’t have any videos 😭</p>
                                            <button className="bg-indigo-600 text-white shadow-md px-8 py-2 rounded" style={{ width: '180px' }} onClick={() => { start(); document.querySelector(".config_wrapper").style.display = 'block'; }}>Record a Video</button>
                                        </div>
                                }
                            </div>
                            <div className="myPagesWrapper my-10">
                                <h1 className="text-2xl font-bold">My Product Pages</h1>
                                <hr className="w-64 mt-2 mb-6 border-gray-500" />
                                {
                                    pages.length > 0 ?
                                        <div className="grid grid-flow-row grid-cols-3 gap-5 mr-10">
                                            {pages.map((page, index) =>
                                                <div className="cursor-pointer bg-gray-200 rounded p-3 border-2 border-gray-500" key={index}>
                                                    <h2 className="mb-3 transition duration-500 ease-in-out text-lg">{page.name}</h2>
                                                    <div className="pageActions mb-2">
                                                        <a className="mr-2 bg-indigo-600 text-white rounded px-5 py-2" onClick={() => { setCurrPage(page.id); setAddPost(true) }}>Add Post</a>
                                                        <a className="bg-indigo-600 text-white rounded px-5 py-2" onClick={() => history.push('/page/' + page.id)}>View Page</a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        :
                                        <div className="flex flex-col h-56 justify-center items-center mx-auto" style={{ width: '500px' }}>
                                            <p className="font-bold text-xl mb-5">You don’t have any pages 😭</p>
                                            <button onClick={() => setIsOpen(true)} className="bg-indigo-600 text-white shadow-md px-8 py-2 rounded" style={{ width: '200px' }}>Create New Page</button>
                                        </div>
                                }
                            </div>
                        </div>

                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={() => setIsOpen(false)}
                            style={{
                                content: {
                                    top: '50%',
                                    left: '50%',
                                    right: 'auto',
                                    bottom: 'auto',
                                    marginRight: '-50%',
                                    transform: 'translate(-50%, -50%)'
                                }
                            }}
                            ariaHideApp={false}
                            contentLabel="Create Product Page"
                        >
                            <form className="px-8 pt-6">
                                <div className="mb-4 text-left">
                                    <label className="block text-gray-800 tracking-wide mb-2" htmlFor="page_name">
                                        Product Page Name
                                    </label>
                                    <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="page_name" name="page_name" type="text" />
                                </div>
                                <button onClick={handleCreatePage} className="transition duration-500 ease-in-out bg-indigo-600 mb-2 w-full hover:bg-indigo-700 text-white py-2 px-4 rounded focus:outline-none" type="button">
                                    Create Page
                                </button>
                                <button onClick={() => setIsOpen(false)} className="transition duration-500 ease-in-out bg-red-600 mb-5 w-full hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none" type="button">
                                    Cancel
                                </button>
                            </form>
                        </Modal>

                        <Modal
                            isOpen={isAddPostActive}
                            onRequestClose={() => setAddPost(false)}
                            style={{
                                content: {
                                    top: '50%',
                                    left: '50%',
                                    right: 'auto',
                                    bottom: 'auto',
                                    marginRight: '-50%',
                                    transform: 'translate(-50%, -50%)'
                                }
                            }}
                            ariaHideApp={false}
                            contentLabel="Add New Post"
                        >
                            <AddPost pageId={currPage} setAddPost={setAddPost} />
                        </Modal>

                        <div className="config_wrapper bg-gray-300 w-screen h-screen" style={{ position: 'absolute', top: 0, left: 0, display: 'none' }}>
                            <div className="rounded bg-gray-200 shadow-md max-w-xs p-3 m-5">
                                <label>Recording Mode</label><br />
                                <div className="inline-block relative w-full mb-3">
                                    <select onChange={handleModeChange} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" name="mode_options">
                                        <option>Screen + Cam</option>
                                        <option>Screen Only</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                                <label>Microphone Audio</label><br />
                                <div className="inline-block relative w-full mb-5">
                                    <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" name="isAudioEnabled">
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>

                                <button className="block shadow-md w-full mb-2 bg-indigo-600 text-white px-8 py-2 rounded" onClick={() => { getConfig(history); }}>Start Recording</button>
                                <button className="block shadow-md w-full mb-3 bg-red-600 text-white px-8 py-2 rounded" onClick={() => { clearConfig(); document.querySelector(".config_wrapper").style.display = 'none'; }}>Cancel</button>

                                <Draggable bounds=".config_wrapper">
                                    <div className="dragCircle" style={{
                                        position: 'absolute',
                                        top: 400, left: 0,
                                        width: '300px',
                                        backgroundColor: '#000',
                                        overflow: 'hidden',
                                        height: '300px',
                                        borderRadius: '50%',
                                        cursor: 'move',
                                        margin: 10
                                    }}>
                                        <video autoPlay style={{ width: '100%', height: '100%', transform: `scale(1.35) rotateY(180deg)` }}></video>
                                    </div>
                                </Draggable>
                            </div>
                        </div>
                    </>
            }

        </div >
    )
}

export default Home;