import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import { db } from '../firebase';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Videos from './Videos'
import NewVideo from './NewVideo';

export default function Dashboard() {
    const history = useHistory();
    const [videos, setVideos] = useState([]);
    const [user, setUser] = useState("");
    const [newVideo, setNewVideo] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("UUID"))
            history.replace('/');

        db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
            setUser(doc.data().fullname);
            setVideos(doc.data().videos);
            // document.querySelector(".loader").style.display = 'none';
        }).catch(() => window.location.reload());
    }, []);

    return (
        <>
            <Navbar newVideoHandler={() => setNewVideo(true)} />
            <Sidebar user={user} newVideoHandler={() => setNewVideo(true)} />
            <div className="parentWrapper fixed inset-0" style={{ marginLeft: '260px', marginTop: '73px' }}>
                <Videos videos={videos} setVideos={setVideos} recordVideo={() => setNewVideo(true)} />
            </div>
            <NewVideo visible={newVideo} hide={() => setNewVideo(false)} />
        </>
    )
}
