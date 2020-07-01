import React from 'react'
import { useHistory } from 'react-router-dom'

import Navbar from './Navbar'
import aboutBanner from '../assets/images/about.png'

export default function About() {
    const history = useHistory();

    return (
        <>
            <Navbar />
            <div className="mx-5 mt-24 sm:mx-16 lg:flex">
                <div className="flex flex-col justify-between pl-5 pr-5 sm:pr-20 lg:w-4/5 xl:w-3/5">
                    <p className="mb-5 text-xl font-semibold font-montserratMedium">Welcome! We're so glad you're here.<span role="img" aria-label="">💖</span></p>
                    <p className="mb-10 font-montserratRegular">POPPI is a video recording tool that helps you get your message across through instantly shareable videos.
                    With POPPI, you can record your camera, microphone, and desktop simultaneously. Your video is then instantly available to share through cloud technology. </p>
                    <div className="text-center font-montserratRegular">
                        <p className="mb-2">Questions, comments, concerns? Contact us <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => history.push("/contact")}>here</span> <span role="img" aria-label="">👈</span></p>
                        <p>Happy recording! <span role="img" aria-label="">🎥</span> <span role="img" aria-label="">😄</span></p>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-16 lg:mt-0">
                    <img src={aboutBanner} alt="" className="rounded-lg shadow-lg" />
                </div>
            </div>
            <div className="py-5 mt-16 border-t lg:mt-16 footer">
                <p className="text-center text-gray-700">&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
            </div>
        </>
    )
}
