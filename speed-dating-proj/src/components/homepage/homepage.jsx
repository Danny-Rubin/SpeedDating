// HomePage.js
import React, {useEffect, useState} from 'react';
import { Button } from '@mui/material';
import Header from "../header/header";
import "./homepage.css"
import start_dating from '../../assets/start-dating.png'
import love_texting from  '../../assets/love-texting.png'
import wavy_background from '../../assets/wavy_background.png'
import {homepage_steps} from "../tour/tour-steps-provider";
import Joyride from 'react-joyride';
import IconButton from "@mui/material/IconButton";
import {Info} from "@mui/icons-material";


const HomePage = () => {

    const [isTourRunning, setTourRunning]= useState(false);

    const handleTourStart = (event) => {
        event.preventDefault();
        setTourRunning(true);
    };
    const handleJoyrideCallback = (data) => {
        localStorage.setItem('hasCompletedHomepageTour', 'true');
        setTourRunning(false);

    };

    useEffect(()=>{
        setTourRunning(true);
    },[isTourRunning]);


    return (
        <div className="main-div">
            <Header/>
            <IconButton className="info-button" onClick={handleTourStart}
                        style={{position:'absolute', top:'80px', right:'0'}}>
                <Info>Start Tour</Info>
            </IconButton>
            <div className="homepage-body main-div" style={{backgroundImage: `url(${wavy_background})`}}>
                <div className="start-dating-button-main">
                    <Button
                        className="start-dating-button"
                        variant="contained"
                        style={{borderRadius: 200, padding: 40, backgroundColor: '#ff6ba2'}}
                        href="/loading-chat">
                        <img src={start_dating} className="start-dating-image"/>
                        <div className="start-dating-text">Start Dating</div>
                    </Button>
                </div>
                <div className="shared-details-button-main">
                    <Button
                        className="shared-details-button"
                        variant="contained"
                        style={{borderRadius: 200, backgroundColor:'#fed4e4'}}
                        href="/shared-details">
                        <img src={love_texting} className="shared-details-image"/>
                        <div className="shared-details-text">Contacts</div>
                    </Button>
                </div>
            </div>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                run={isTourRunning || false}
                showSkipButton
                steps={homepage_steps}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                }}
            />
        </div>
    );
};

export default HomePage;
