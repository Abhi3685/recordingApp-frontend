import React from 'react'
import DesignElement1 from '../assets/images/DesignElement1.png';
import DesignElement2 from '../assets/images/DesignElement2.png';
import home1 from '../assets/images/home1.png';
import home2 from '../assets/images/home2.png';
import home3 from '../assets/images/home3.png';
import home4 from '../assets/images/home4.png';
import home5 from '../assets/images/home5.png';
import home6 from '../assets/images/home6.png';
import Navbar from './Navbar';

export default function Home() {
    return (
        <>
            <Navbar />
            <img src={DesignElement1} style={{ position: 'absolute', right: 0, top: 150, width: 200 }} />
            <img src={DesignElement2} style={{ position: 'absolute', bottom: 20, left: 500 }} />
            <div className="mainWrapper mt-20 ml-24 mr-40 float-left" style={{ width: 400 }}>
                <div className="brandWrapper mb-10">
                    <h1 className="brandName font-montserratExtraBold" style={{ fontSize: 60 }}>POPPI</h1>
                </div>
                <div className="brandDescription mb-48">
                    <p className="font-montserratMediumLight text-justify">
                        The expressiveness of video with the convenience of messaging.
                        Communicate more effectively wherever you work with Loom.
                    </p>
                </div>
                <div className="actionBtnWrapper flex justify-between w-64 mx-auto">
                    <button className="transition duration-300 ease-in bg-indigo-600 font-bold text-white px-8 py-2 rounded">Sign in</button>
                    <button className="transition duration-300 ease-in border border-indigo-600 font-bold text-indigo-600 px-8 py-2 rounded">Sign up</button>
                </div>
            </div>
            <div className="galleryWrapper mt-24 mb-10">
                <div className="float-left">
                    <img src={home1} className="w-64 h-40" />
                    <img src={home2} className="w-64 h-40" />
                    <img src={home3} className="w-64 h-40" />
                </div>
                <div className="pt-40 float-left">
                    <img src={home4} className="w-64 h-40" />
                    <img src={home5} className="w-64 h-40" />
                </div>
                <div style={{ paddingTop: 320 }}>
                    <img src={home6} className="w-64 h-40" />
                </div>
            </div>
        </>
    )
}
