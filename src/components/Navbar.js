import React, { useState } from 'react'
import userAvatar from '../assets/images/userAvatar.png';
import { useHistory } from 'react-router-dom';

export default function Navbar() {
    const token = localStorage.getItem("UUID");
    const name = localStorage.getItem("username");
    const history = useHistory();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="navbarWrapper flex items-center justify-between mx-10 sm:mx-20 mt-5 mb-5">
            <div className="logoWrapper font-montserratBlack">
                <p className="font-bold text-xl">LOGO</p>
            </div>
            <div className="navMenuWrapper font-montserratBold hidden sm:block">
                {
                    token ?
                        <div className="navMenu flex items-center">
                            <img src={userAvatar} style={{ width: '30px' }} />
                            <p className="ml-5">{name}</p>
                        </div> :
                        <div className="navMenu">
                            <span className="hover:underline cursor-pointer" onClick={() => history.push('/')}>Home</span>
                            <span className="hover:underline mx-20 md:mx-40 cursor-pointer" onClick={() => history.push('/about')}>About</span>
                            <span className="hover:underline cursor-pointer" onClick={() => history.push('/contact')}>Contact</span>
                        </div>
                }
            </div>
            <div className="mobileMenuWrapper font-montserratBold block sm:hidden">
                <i className="fa fa-bars" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ fontSize: '20px' }}></i>
                {
                    isMobileMenuOpen && <div className="absolute shadow-md bg-gray-400 mx-5 rounded p-5" style={{ top: 60, left: 0, right: 0 }}>
                        {
                            token ?
                                <div className="navMenu flex items-center">
                                    <img src={userAvatar} style={{ width: '30px' }} />
                                    <p className="ml-5">{name}</p>
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
