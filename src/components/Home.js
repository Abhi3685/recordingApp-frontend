import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import DesignElement1 from '../assets/images/DesignElement1.png';
import DesignElement2 from '../assets/images/DesignElement2.png';
import home1 from '../assets/images/home1.png';
import home2 from '../assets/images/home2.png';
import home3 from '../assets/images/home3.png';
import home4 from '../assets/images/home4.png';
import home5 from '../assets/images/home5.png';
import home6 from '../assets/images/home6.png';
import Navbar from './Navbar';

function Home() {
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem("UUID"))
            history.replace('/dashboard');
    }, [history])

    return (
        <React.Fragment>
            <Navbar />
            <img alt="" className="absolute right-0 hidden sm:block" src={DesignElement1} style={{ top: 150, width: 200 }} />
            <img alt="" className="absolute hidden lg:block" src={DesignElement2} style={{ bottom: 20, left: '33%' }} />
            <div className="mainWrapper flex flex-col lg:flex-row px-6 sm:px-16">
                <div className="leftWrapper flex flex-col w-full sm:w-3/5 lg:w-1/3 pl-2 pr-16 mt-20 mr-32">
                    <div className="brandWrapper mb-10">
                        <h1 className="brandName font-montserratExtraBold" style={{ fontSize: 60 }}>RECCA</h1>
                    </div>
                    <div className="brandDescription mb-10 lg:mb-48">
                        <p className="font-montserratMediumLight">
                            The expressiveness of video with the convenience of messaging.
                            Communicate more effectively wherever you work with Recca.
                        </p>
                    </div>
                    <div className="actionBtnWrapper flex justify-between w-64 mx-auto">
                        <button onClick={() => history.push('/signin')} className="bg-indigo-600 font-bold text-white px-8 py-2 rounded">Sign in</button>
                        <button onClick={() => history.push('/signup')} className="border border-indigo-600 font-bold text-indigo-600 px-8 py-2 rounded">Sign up</button>
                    </div>
                </div>
                <div className="rightWrapper mt-16 mb-12 lg:mt-24 xl:mt-16 flex flex-1">
                    <div>
                        <img alt="" src={home1} className="lg:h-32 xl:h-40" />
                        <img alt="" src={home2} className="lg:h-32 xl:h-40" />
                        <img alt="" src={home3} className="lg:h-32 xl:h-40" />
                    </div>
                    <div>
                        <img alt="" src={home5} className="lg:invisible lg:h-32 xl:h-40" />
                        <img alt="" src={home4} className="lg:h-32 xl:h-40" />
                        <img alt="" src={home5} className="invisible lg:visible lg:h-32 xl:h-40" />
                    </div>
                    <div>
                        <img alt="" src={home6} className="lg:invisible lg:h-32 xl:h-40" />
                        <img alt="" src={home6} className="invisible lg:h-32 xl:h-40" />
                        <img alt="" src={home6} className="invisible lg:visible lg:h-32 xl:h-40" />
                    </div>
                </div>
            </div>
            <div className="footer lg:hidden border-t py-5">
                <p className="text-center text-gray-700">&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
            </div>
        </React.Fragment>
    )
}

export default Home;
