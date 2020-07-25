import React from 'react'
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Moment from 'react-moment';
import firebase from "firebase/app";

import { db } from '../firebase';
import moreIcon from '../assets/images/moreIcon.png';
import doodle from '../assets/images/videos_doodle.png';
import { formatTime, API_URL, toggleMenu } from '../utils';
import DesignElement from '../assets/images/DesignElement1.png';
import { videoActionClasses, videoActionClasses2, recordVideoBtnClasses } from '../utils/classes';

function Videos({ videos, setVideos, recordVideo }) {
    const history = useHistory();

    const handleDelete = (video_Obj, index) => {
        db.collection('users').doc(localStorage.getItem("UUID")).update({
            videos: firebase.firestore.FieldValue.arrayRemove(video_Obj)
        }).then(() => {
            var newVideos = [...videos];
            newVideos.splice(index, 1);
            setVideos(newVideos);
            Axios.delete(API_URL + "/video/" + video_Obj.publicId);
        }).catch(err => {
            alert("Error: Unhandled Exception Occured!");
            console.log(err);
        });
    }

    return (
        <React.Fragment>
            <img src={doodle} alt="" className="absolute hidden xl:block" style={{ zIndex: -10, width: '250px', bottom: 30, right: 10 }} />
            <img src={DesignElement} alt="" className="absolute hidden transform rotate-90 xl:block" style={{ zIndex: -10, width: '220px', top: 140, right: 5 }} />
            <div className="z-10 contentWrapper">
                <div className="py-4 mx-8 text-xl border-b border-gray-300 contentHeader font-montserratBold">
                    My <span className="text-purple-700">Videos</span>
                </div>
                <div className="absolute inset-0 pt-6 pb-10 pl-8 overflow-auto content" style={{ marginTop: 70 }}>
                    {
                        videos.length > 0 ?
                            <div className="grid grid-flow-row gap-10 mr-10 font-montserratRegular sm:grid-cols-2 lg:grid-cols-3 xl:mr-64">
                                {videos.map((video, index) =>
                                    <div className="relative" key={index}>
                                        <div className="relative rounded-lg shadow-md cursor-pointer" onClick={() => history.push('/player/' + video.publicId)}>
                                            <img src={video.thumb} alt="" className="rounded-lg" />
                                            <div className="absolute inset-0 rounded-lg thumb-overlay" style={{ background: "rgba(0, 0, 0, 0.1)" }}></div>
                                        </div>
                                        <p className="mt-3 text-lg font-montserratBold">{video.name.length < 25 ? video.name : (video.name.substr(0, 25) + " . . .")}</p>
                                        <div className="flex justify-between mr-3">
                                            <p className="text-gray-600">{formatTime(video.duration)} • <Moment fromNow>{video.createdAt}</Moment></p>
                                            <img src={moreIcon} alt="" onClick={toggleMenu} className="transform rotate-90 cursor-pointer" />
                                        </div>
                                        <div className="absolute hidden py-2 bg-gray-100 rounded shadow-lg menuWrapper" style={{ bottom: 30, right: 5 }}>
                                            <button className={videoActionClasses} onClick={() => { history.push('/trim', { ...video, index }); }}>Trim</button>
                                            <button className={videoActionClasses} onClick={() => { history.push('/addText', { ...video, index }); }}>Add Subtitle</button>
                                            <button className={videoActionClasses} onClick={() => { history.push('/watermark', { ...video, index }); }}>Watermark</button>
                                            <button className={videoActionClasses2} onClick={() => handleDelete(video, index)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            :
                            <div className="flex flex-col items-center justify-center h-full opacity-75">
                                <p className="mb-5 text-xl font-bold">You don’t have any videos <span role="img" aria-label="">😭</span></p>
                                <button className={recordVideoBtnClasses} style={{ width: '180px' }} onClick={recordVideo}>Record a Video</button>
                            </div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default Videos;
