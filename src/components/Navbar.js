import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

import userAvatar from '../assets/images/userAvatar.png';

export default function Navbar({ newVideoHandler }) {
    const token = localStorage.getItem("UUID");
    const name = localStorage.getItem("username");
    const history = useHistory();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex items-center justify-between px-10 py-5 border-b bg-white border-gray-300 navbarWrapper sm:px-20">
            <div className="logoWrapper font-montserratBlack">
                <p className="text-xl font-bold">LOGO</p>
            </div>
            <div className="hidden navMenuWrapper font-montserratBold sm:block">
                {
                    token ?
                        <div onClick={() => history.push("/dashboard")} className="flex items-center cursor-pointer navMenu">
                            <img alt="" src={userAvatar} style={{ width: '30px' }} />
                            <p className="ml-5">{name}</p>
                        </div> :
                        <div className="navMenu">
                            <span className="cursor-pointer hover:underline" onClick={() => history.push('/')}>Home</span>
                            <span className="mx-20 cursor-pointer hover:underline md:mx-40" onClick={() => history.push('/about')}>About</span>
                            <span className="cursor-pointer hover:underline" onClick={() => history.push('/contact')}>Contact</span>
                        </div>
                }
            </div>
            <div className="z-50 block mobileMenuWrapper font-montserratBold sm:hidden">
                <i className="fa fa-bars" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ fontSize: '20px' }}></i>
                {
                    isMobileMenuOpen && <div className="absolute z-50 p-5 mx-5 bg-gray-200 rounded shadow-md" style={{ top: 60, left: 0, right: 0 }}>
                        {
                            token ?
                                <div>
                                    <div onClick={() => history.push("/dashboard")} className="flex items-center border-b pb-4 mb-4 border-gray-400 navMenu">
                                        <img alt="" src={userAvatar} style={{ width: '30px' }} />
                                        <p className="ml-5">{name}</p>
                                    </div>
                                    <div className="font-montserratRegular border-b pb-4 mb-4 border-gray-400">
                                        <p className="mb-3 font-montserratBold">Dashboard</p>
                                        <p className="px-5 py-1 mb-1 text-white transition duration-300 ease-in bg-blue-500 rounded cursor-pointer"><i className="mr-2 fa fa-angle-right"></i> My Videos</p>
                                        <p className="px-5 py-1 transition duration-300 ease-in rounded cursor-pointer hover:bg-blue-500 hover:text-white"><i className="mr-2 fa fa-angle-right"></i> My Pages</p>
                                    </div>
                                    <div className="font-montserratRegular border-b pb-4 mb-5 border-gray-400">
                                        <p className="mb-3 font-montserratBold">Create</p>
                                        <p onClick={newVideoHandler} className="px-5 py-1 mb-1 transition duration-300 ease-in rounded cursor-pointer hover:bg-blue-500 hover:text-white"><i className="mr-2 fa fa-plus-circle"></i> New Video</p>
                                        <p className="px-5 py-1 transition duration-300 ease-in rounded cursor-pointer hover:bg-blue-500 hover:text-white"><i className="mr-2 fa fa-plus-circle"></i> New Page</p>
                                    </div>
                                    <button onClick={() => { localStorage.removeItem("UUID"); localStorage.removeItem("username"); history.push("/"); }} className="py-2 w-full text-red-500 transition duration-300 ease-in border border-red-500 rounded hover:text-white hover:bg-red-500">Log out</button>
                                </div> :
                                <div className="navMenu">
                                    <p onClick={() => history.push('/')} className="mb-2">Home</p>
                                    <p onClick={() => history.push('/about')} className="mb-2">About</p>
                                    <p onClick={() => history.push('/contact')} className="">Contact</p>
                                </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}
