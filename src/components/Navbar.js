import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom';

import userAvatar from '../assets/images/userAvatar_sidebar.png';
import logo from '../assets/images/logo.png';
import { navbarLogoutBtnClasses } from '../utils/classes';

function Navbar() {
    const token = localStorage.getItem("UUID");
    const name = localStorage.getItem("username");
    const history = useHistory();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const logoutHandler = useCallback(() => {
        localStorage.removeItem("UUID");
        localStorage.removeItem("username");
        history.push("/");
    }, [history]);

    return (
        <div className="flex items-center justify-between px-5 py-5 bg-white border-b border-gray-300 sm:px-12">
            <div className="flex items-center" style={{ margin: '-50px 0' }}>
                <img alt="" src={logo} style={{ width: '85px' }} />
                <p className="text-xl font-montserratExtraBold" style={{ color: '#787ECF' }}>RECCA</p>
            </div>
            <div className="hidden font-montserratBold sm:block">
                {
                    token ?
                        <div className="flex items-center">
                            <img alt="" src={userAvatar} style={{ width: '30px' }} />
                            <p className="ml-4">{name}</p>
                        </div> :
                        <div>
                            <span className="cursor-pointer hover:underline" onClick={() => history.push('/')}>Home</span>
                            <span className="mx-20 cursor-pointer hover:underline md:mx-40" onClick={() => history.push('/about')}>About</span>
                            <span className="cursor-pointer hover:underline" onClick={() => history.push('/contact')}>Contact</span>
                        </div>
                }
            </div>
            <div className="z-50 block font-montserratBold mobileMenu sm:hidden">
                <i className="fa fa-bars" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ fontSize: '20px' }}></i>
                {
                    isMobileMenuOpen &&
                    <div className="absolute left-0 right-0 z-50 p-5 mx-5 bg-gray-200 rounded shadow-md" style={{ top: 60 }}>
                        {
                            token ?
                                <div>
                                    <div className="flex items-center justify-center pb-4">
                                        <img alt="" src={userAvatar} style={{ width: '30px' }} />
                                        <p className="ml-4">{name}</p>
                                    </div>
                                    <button onClick={logoutHandler} className={navbarLogoutBtnClasses}>Log out</button>
                                </div> :
                                <div>
                                    <p onClick={() => history.push('/')}>Home</p>
                                    <p onClick={() => history.push('/about')} className="my-2">About</p>
                                    <p onClick={() => history.push('/contact')}>Contact</p>
                                </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar
