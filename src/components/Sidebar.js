import React from 'react'
import { useHistory } from 'react-router-dom';

import userAvatar from '../assets/images/userAvatar_sidebar.png';

export default function Sidebar({ user, newVideoHandler }) {
    const history = useHistory();

    const logoutHandler = () => {
        localStorage.removeItem("UUID");
        localStorage.removeItem("username");
        history.push("/");
    }

    return (
        <div className="absolute top-0 bottom-0 flex flex-col justify-between sidebar" style={{ width: '260px', marginTop: 70, boxShadow: "4px 0 2px -2px #ddd" }}>
            <div className="flex flex-col items-center border-b justify-center h-64 avatar-wrapper">
                <img src={userAvatar} alt="" className="w-32" />
                <p className="mt-3 uppercase font-montserratBold">{user}</p>
            </div>
            <p className="font-montserratSemiBold mx-6 text-lg mb-48 rounded" style={{ color: '#5A67D9' }}><i className="fa fa-angle-right mr-3" />My Videos</p>
            <div className="flex flex-col">
                <button onClick={newVideoHandler} className="py-2 mx-4 mb-3 transition duration-300 ease-in bg-indigo-600 rounded text-white hover:bg-indigo-500"><i className="fa fa-video-camera mr-3" />New Video</button>
                <button onClick={logoutHandler} className="py-2 mx-4 mb-5 text-white transition duration-300 ease-in bg-red-600 rounded hover:bg-red-500"><i className="fa fa-sign-out mr-3" />Log out</button>
            </div>
        </div>
    )
}
