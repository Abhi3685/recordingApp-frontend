import React from 'react'
import { useHistory } from 'react-router-dom';

import userAvatar from '../assets/images/userAvatar_sidebar.png';

export default function Sidebar({ user, active, setActive, newVideoHandler, newPageHandler }) {
    const history = useHistory();

    return (
        <div className="absolute top-0 bottom-0 flex flex-col justify-between sidebar" style={{ width: '260px', marginTop: 70, boxShadow: "4px 0 2px -2px #ddd" }}>
            <div className="flex flex-col items-center justify-center h-64 border-b avatar-wrapper">
                <img src={userAvatar} alt="" className="w-32" />
                <p className="mt-3 uppercase font-montserratBold">{user}</p>
            </div>
            <div className="font-montserratRegular">
                <p className="px-5 mb-3 font-montserratBold">Dashboard</p>
                <p onClick={() => setActive("videos")} className={"mb-1 px-5 py-1 mx-4 transition duration-300 ease-in rounded cursor-pointer " + (active === 'videos' ? "text-white bg-blue-600" : "hover:bg-blue-400 hover:text-white")}><i className="mr-2 fa fa-angle-right"></i> My Videos</p>
                <p onClick={() => setActive("pages")} className={"px-5 py-1 mx-4 transition duration-300 ease-in rounded cursor-pointer " + (active === 'pages' ? "text-white bg-blue-600" : "hover:bg-blue-400 hover:text-white")}><i className="mr-2 fa fa-angle-right"></i> My Pages</p>
            </div>
            <hr />
            <div className="font-montserratRegular">
                <p className="px-5 mb-3 font-montserratBold">Create</p>
                <p onClick={newVideoHandler} className="px-5 py-1 mx-4 mb-1 transition duration-300 ease-in rounded cursor-pointer hover:bg-blue-500 hover:text-white"><i className="mr-2 fa fa-plus-circle"></i> New Video</p>
                <p onClick={newPageHandler} className="px-5 py-1 mx-4 transition duration-300 ease-in rounded cursor-pointer hover:bg-blue-500 hover:text-white"><i className="mr-2 fa fa-plus-circle"></i> New Page</p>
            </div>
            <button onClick={() => { localStorage.removeItem("UUID"); localStorage.removeItem("username"); history.push("/"); }} className="py-2 mx-4 mt-10 mb-5 text-red-500 transition duration-300 ease-in border border-red-500 rounded hover:text-white hover:bg-red-500">Log out</button>
        </div>
    )
}
