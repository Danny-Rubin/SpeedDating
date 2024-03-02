// HomePage.js
import React from 'react';
import { Button } from '@mui/material';
import Header from "../header/header";
import "./homepage.css"
import start_dating from '../../assets/start-dating.png'
import love_texting from  '../../assets/love-texting.png'
import wavy_background from '../../assets/testing-background.png'

const HomePage = () => {


    return (
        <div className="main-div">
            <Header/>
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
        </div>

    );
};

export default HomePage;
