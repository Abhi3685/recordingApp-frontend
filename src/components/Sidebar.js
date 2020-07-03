import React from 'react'
import { useHistory } from 'react-router-dom';

import userAvatar from '../assets/images/userAvatar_sidebar.png';

export default function Sidebar({ user, newVideoHandler }) {
    const history = useHistory();

    return (
        <div className="absolute top-0 bottom-0 flex flex-col justify-between sidebar" style={{ width: '260px', marginTop: 70, boxShadow: "4px 0 2px -2px #ddd" }}>
            <div className="flex flex-col items-center justify-center h-64 avatar-wrapper">
                <img src={userAvatar} alt="" className="w-32" />
                <p className="mt-3 uppercase font-montserratBold">{user}</p>
            </div>
            <div className="flex flex-col">
                <button onClick={() => { }} className="py-2 mx-4 mb-5 transition duration-300 ease-in border border-indigo-600 rounded text-indigo-600 hover:text-white hover:bg-indigo-500">New Video</button>
                <button onClick={() => { localStorage.removeItem("UUID"); localStorage.removeItem("username"); history.push("/"); }} className="py-2 mx-4 mb-5 text-red-500 transition duration-300 ease-in border border-red-500 rounded hover:text-white hover:bg-red-500">Log out</button>
            </div>
        </div>
    )
}
