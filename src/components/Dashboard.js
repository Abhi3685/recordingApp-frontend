import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import { db } from '../firebase';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Videos from './Videos'
import NewVideo from './NewVideo';
import loader from '../assets/images/loader.gif';

export default function Dashboard() {
    const history = useHistory();
    const [videos, setVideos] = useState([]);
    const [user, setUser] = useState("");
    const [newVideo, setNewVideo] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("UUID"))
            history.replace('/');

        db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
            setUser(doc.data().fullname);
            setVideos(doc.data().videos);
            setLoading(false);
        }).catch(() => window.location.reload());
    }, []);

    return (
        <>
            {loading && <div className="absolute z-50 flex items-center justify-center w-full h-full bg-white" style={{ opacity: 0.98 }}>
                <img src={loader} alt="" className="w-8/12" />
            </div>}
            <Navbar newVideoHandler={() => setNewVideo(true)} />
            <Sidebar user={user} newVideoHandler={() => setNewVideo(true)} />
            <div className="fixed inset-0 parentWrapper" style={{ marginLeft: '260px', marginTop: '73px' }}>
                <Videos videos={videos} setVideos={setVideos} recordVideo={() => setNewVideo(true)} />
            </div>
            <NewVideo visible={newVideo} hide={() => setNewVideo(false)} />
        </>
    )
}
