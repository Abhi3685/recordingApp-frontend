import React from 'react'
import { useParams } from 'react-router-dom'
import {
    Player,
    BigPlayButton,
    LoadingSpinner,
    ControlBar,
    ReplayControl,
    ForwardControl,
    CurrentTimeDisplay,
    TimeDivider,
    PlaybackRateMenuButton,
    VolumeMenuButton
} from 'video-react';

import Navbar from './Navbar';
import DesignElement4 from '../assets/images/DesignElement4.png';

const CustomPlayer = () => {
    let { videoId } = useParams();

    return (
        <>
            <div className="absolute inset-0" style={{ background: "#5A67D9" }}>
                <Navbar />
                <img src={DesignElement4} alt="" className="absolute bottom-0 left-0 p-3 ml-4 w-24 lg:w-32" />
                <img src={DesignElement4} alt="" className="absolute right-0 p-3 w-24 lg:w-32 mr-4" style={{ top: 75 }} />
                <div className="w-11/12 flex items-center md:9/12 lg:w-4/6 mx-auto mt-8 bg-white lg:bg-transparent shadow-lg" style={{ height: "calc(100% - 130px)" }}>
                    <Player
                        poster={"https://res.cloudinary.com/dhhtvk50h/video/upload/" + videoId + ".jpg"}
                        src={"https://res.cloudinary.com/dhhtvk50h/video/upload/" + videoId + ".mkv"}
                        crossOrigin="anonymous"
                    >
                        <track label="English" kind="subtitles" srcLang="en" src={"http://localhost:8000/" + videoId + ".vtt"} default></track>
                        <BigPlayButton position="center" />
                        <LoadingSpinner />
                        <ControlBar autoHide={false}>
                            <ReplayControl seconds={10} order={1.1} />
                            <ForwardControl seconds={10} order={1.2} />
                            <CurrentTimeDisplay order={4.1} />
                            <TimeDivider order={4.2} />
                            <PlaybackRateMenuButton rates={[2, 1, 0.5, 0.25]} order={7.1} />
                            <VolumeMenuButton disabled />
                        </ControlBar>
                    </Player>
                </div>
            </div>
        </>
    )
}

export default CustomPlayer;
