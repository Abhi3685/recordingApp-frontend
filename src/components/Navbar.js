import React from 'react'

export default function Navbar() {
    return (
        <div className="navbarWrapper flex items-center justify-between mx-10 sm:mx-20 my-5">
            <div className="logoWrapper font-montserratBlack">
                <p className="font-bold text-xl">LOGO</p>
            </div>
            <div className="navMenuWrapper font-montserratBold">
                <div className="navMenu">
                    <span className="underline">Home</span>
                    <span className="mx-40">About</span>
                    <span>Contact</span>
                </div>
            </div>
        </div>
    )
}
