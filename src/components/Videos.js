import React from 'react'
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Moment from 'react-moment';

import { db } from '../firebase';
import firebase from "firebase/app";
import logo from '../assets/loader.gif';
import moreIcon from '../assets/images/moreIcon.png';
import doodle from '../assets/images/videos_doodle.png';
import { formatTime } from '../utils';
import DesignElement from '../assets/images/DesignElement1.png';

function toggleMenu(e) {
    var menuRef = e.target.parentElement.parentElement.querySelector(".menuWrapper");
    if (menuRef.style.display === 'none' || menuRef.style.display === '') {
        var menus = document.querySelectorAll(".menuWrapper");
        menus.forEach(menu => {
            menu.style.display = 'none';
        });
        menuRef.style.display = 'block';
    } else {
        menuRef.style.display = 'none';
    }
}

function Videos({ videos, setVideos, recordVideo }) {
    let history = useHistory();

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
        <>
            <img src={doodle} alt="" className="hidden xl:block absolute" style={{ zIndex: -10, width: '250px', bottom: 30, right: 10 }} />
            <img src={DesignElement} alt="" className="hidden xl:block absolute transform rotate-90" style={{ zIndex: -10, width: '220px', top: 140, right: 5 }} />
            <div className="contentWrapper z-10">
                <div className="contentHeader border-b border-gray-300 py-4 px-8 text-xl font-montserratBold">
                    My <span className="text-purple-700">Videos</span>
                </div>
                <div className="absolute inset-0 content overflow-auto pl-8 pt-6 pb-10" style={{ marginTop: 70 }}>
                    {
                        videos.length > 0 ?
                            <div className="grid font-montserratRegular grid-flow-row sm:grid-cols-2 lg:grid-cols-3 gap-10 mr-10 xl:mr-64">
                                {videos.map((video, index) =>
                                    <div className="relative" key={index}>
                                        <div className="relative rounded-lg shadow-md cursor-pointer" onClick={() => history.push('/player/' + video.publicId)}>
                                            <img src={video.thumb} alt="" className="rounded-lg" />
                                            <div className="thumb-overlay absolute inset-0 rounded-lg" style={{ background: "rgba(0, 0, 0, 0.1)" }}></div>
                                        </div>
                                        <p className="text-lg mt-3 font-montserratBold">{video.name.length < 25 ? video.name : (video.name.substr(0, 25) + " . . .")}</p>
                                        <div className="flex mr-3 justify-between">
                                            <p className="text-gray-600">{formatTime(video.duration)} • <Moment fromNow>{video.createdAt}</Moment></p>
                                            <img src={moreIcon} onClick={toggleMenu} className="cursor-pointer transform rotate-90" />
                                        </div>
                                        <div className="absolute hidden py-2 bg-gray-100 rounded shadow-lg menuWrapper" style={{ bottom: 30, right: 5 }}>
                                            <button className="block w-full px-5 mb-1 hover:bg-gray-400" onClick={() => { history.push('/trim', { ...video, index }); }}>Trim</button>
                                            <button className="block w-full px-5 mb-1 hover:bg-gray-400" onClick={() => { history.push('/addText', { ...video, index }); }}>Add Subtitle</button>
                                            <button className="block w-full px-5 mb-1 hover:bg-gray-400" onClick={() => { history.push('/watermark', { ...video, index }); }}>Watermark</button>
                                            <button className="block w-full px-5 mb-1 text-red-400 hover:bg-red-400 hover:text-white" onClick={() => handleDelete(video, index)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            :
                            <div className="flex flex-col items-center opacity-75 justify-center h-full">
                                <p className="mb-5 text-xl font-bold">You don’t have any videos <span role="img" aria-label="">😭</span></p>
                                <button className="transition duration-300 ease-in px-8 py-2 text-indigo-600 border rounded shadow-md mb-24 border-indigo-600 hover:text-white hover:bg-indigo-600" style={{ width: '180px' }} onClick={recordVideo}>Record a Video</button>
                            </div>
                    }
                </div>
            </div>

            {/* 
            <div className="w-screen h-screen bg-gray-300 config_wrapper" style={{ position: 'absolute', top: 0, left: 0, display: 'none' }}>
                <div className="max-w-xs p-3 m-5 bg-gray-200 rounded shadow-md">
                    <label>Recording Mode</label><br />
                    <div className="relative inline-block w-full mb-3">
                        <select onChange={handleModeChange} className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline" name="mode_options">
                            <option>Screen + Cam</option>
                            <option>Screen Only</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    <label>Microphone Audio</label><br />
                    <div className="relative inline-block w-full mb-5">
                        <select className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline" name="isAudioEnabled">
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>

                    <button className="block w-full px-8 py-2 mb-2 text-white bg-indigo-600 rounded shadow-md" onClick={() => { getConfig(history); }}>Start Recording</button>
                    <button className="block w-full px-8 py-2 mb-3 text-white bg-red-600 rounded shadow-md" onClick={() => { clearConfig(); document.querySelector(".config_wrapper").style.display = 'none'; }}>Cancel</button>

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
            </div> */}
        </>
    )
}

export default Videos;