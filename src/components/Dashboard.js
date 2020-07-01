import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import { db } from '../firebase';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Videos from './Videos'
import Pages from './Pages'

export default function Dashboard() {
    const history = useHistory();
    const [videos, setVideos] = useState([]);
    const [pages, setPages] = useState([]);
    const [user, setUser] = useState("");
    const [activeSubRoute, setSubRoute] = useState("pages");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isAddPostActive, setAddPost] = useState(false);
    const [currPage, setCurrPage] = useState("");

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
            <Navbar />
            <Sidebar user={user} active={activeSubRoute} setActive={setSubRoute} />
            <div className="parentWrapper fixed inset-0" style={{ marginLeft: '260px', marginTop: '73px' }}>
                {activeSubRoute === 'videos' && <Videos videos={videos} />}
                {activeSubRoute === 'pages' && <Pages pages={pages} />}
            </div>
        </>
    )
}
