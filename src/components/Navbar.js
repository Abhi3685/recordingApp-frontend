import React, { useState } from 'react'
import userAvatar from '../assets/images/userAvatar.png';
import { useHistory } from 'react-router-dom';

export default function Navbar() {
    const token = localStorage.getItem("UUID");
    const name = localStorage.getItem("username");
    const history = useHistory();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex items-center justify-between mx-10 mt-5 mb-5 navbarWrapper sm:mx-20">
            <div className="logoWrapper font-montserratBlack">
                <p className="text-xl font-bold">LOGO</p>
            </div>
            <div className="hidden navMenuWrapper font-montserratBold sm:block">
                {
                    token ?
                        <div className="flex items-center navMenu">
                            <img src={userAvatar} style={{ width: '30px' }} />
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
                    isMobileMenuOpen && <div className="absolute z-50 p-5 mx-5 bg-gray-400 rounded shadow-md" style={{ top: 60, left: 0, right: 0 }}>
                        {
                            token ?
                                <div className="flex items-center navMenu">
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
