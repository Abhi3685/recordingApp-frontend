import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import { db } from '../firebase';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Videos from './Videos'
import Pages from './Pages'
import NewVideo from './NewVideo';
import NewPage from './NewPage';

export default function Dashboard() {
    const history = useHistory();
    const [videos, setVideos] = useState([]);
    const [pages, setPages] = useState([]);
    const [user, setUser] = useState("");
    const [activeSubRoute, setSubRoute] = useState("videos");
    const [newVideo, setNewVideo] = useState(false);
    const [newPage, setNewPage] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("UUID"))
            history.replace('/');

        db.collection('users').doc(localStorage.getItem("UUID")).get().then(doc => {
            setUser(doc.data().fullname);
            setVideos(doc.data().videos);
            setPages(doc.data().pages);
            // document.querySelector(".loader").style.display = 'none';
        }).catch(() => window.location.reload());
    }, []);

    return (
        <>
            <Navbar newVideoHandler={() => setNewVideo(true)} />
            <Sidebar user={user} active={activeSubRoute} setActive={setSubRoute} newVideoHandler={() => setNewVideo(true)} newPageHandler={() => setNewPage(true)} />
            <div className="parentWrapper fixed inset-0" style={{ marginLeft: '260px', marginTop: '73px' }}>
                {activeSubRoute === 'videos' && <Videos videos={videos} setVideos={setVideos} recordVideo={() => setNewVideo(true)} />}
                {activeSubRoute === 'pages' && <Pages pages={pages} setPages={setPages} createPage={() => setNewPage(true)} />}
            </div>
            <NewVideo visible={newVideo} hide={() => setNewVideo(false)} />
            <NewPage visible={newPage} hide={() => setNewPage(false)} user={user} pages={pages} setPages={setPages} />
        </>
    )
}
