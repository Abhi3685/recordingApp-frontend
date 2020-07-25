import React from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { Player, BigPlayButton, LoadingSpinner } from 'video-react';

import Navbar from './Navbar';
import DesignElement4 from '../assets/images/DesignElement4.png';
import DesignElement3 from '../assets/images/DesignElement3.png';
import { leftIconClasses, playerModalClasses } from '../utils/classes';

const CustomPlayer = () => {
    const { videoId } = useParams();
    const history = useHistory();

    return (
        <React.Fragment>
            <div className="absolute inset-0" style={{ background: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 p-3 ml-4 w-24 lg:w-32" />
                <img src={DesignElement4} alt="" className="absolute right-0 p-3 w-24 lg:w-32 mr-4" style={{ top: 75 }} />

                <div className={playerModalClasses} style={{ height: "calc(100% - 150px)" }}>
                    <img src={DesignElement3} alt="" className="absolute top-0 w-32 transform rotate-90" style={{ right: -20 }} />
                    <img src={DesignElement3} alt="" className="absolute bottom-0 w-32 transform -rotate-90" style={{ left: -20 }} />

                    <i onClick={() => history.goBack()} className={leftIconClasses} />
                    <div className="w-full mx-auto lg:w-9/12">
                        <Player crossOrigin="anonymous">
                            <source src={"https://res.cloudinary.com/dhhtvk50h/video/upload/" + videoId + ".mkv"} />
                            <track
                                label="English"
                                kind="subtitles"
                                srcLang="en"
                                src={new URLSearchParams(useLocation().search).get("subtitle")}
                                default
                            />
                            <BigPlayButton position="center" />
                            <LoadingSpinner />
                        </Player>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CustomPlayer;
