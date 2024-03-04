// VideoChatPage.js
import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import './video-chat-page.css';
import Meeting from "../video-display/meeting";
import {useNavigate} from 'react-router-dom'
import wavy_background from "../../../assets/wavy_background.png";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import {Close, Info} from "@mui/icons-material";
import {videochat_steps} from '../../tour/tour-steps-provider';
import Joyride, {STATUS} from 'react-joyride';

const VideoChatPage = () => {
    const navigate = useNavigate();

    const initialTimer = 3 * 60; // 3 minutes in seconds
    const [maxTime, setMaxTime] = useState(initialTimer);
    const [timer, setTimer] = useState(initialTimer);
    const [didExtendTime, setDidExtendTime] = useState(false);

    const [isTourRunning, setTourRunning]= useState(false);

    const handleTourStart = (event) => {
        event.preventDefault();
        setTourRunning(true);
    };
    const handleJoyrideCallback = (data) => {
        if (data.action === 'close' || [STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)){
            setTourRunning(false);
        }
    };


    useEffect(() => {
        if (timer <= 0) {
            handleTimerEnd();
        }
    }, [timer]);

    const handleTimerEnd = ()=>{
        console.log('timer ended, chat finished');
        navigate('/finished-chat');
    };


    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    const normalise = (value) => ((value) * 100) / (maxTime);

    const tellServerImLeaving = ()=>{
        // todo implement
    };

    const stopDating = ()=>{
        tellServerImLeaving();
        navigate('/');
    };

    const handleNextConversation = () => {
        tellServerImLeaving();
        navigate('/finished-chat')
    };

    const handleRequestAnother5Minutes = () => {
        setDidExtendTime(true);
        const newTime = timer + 5*60;
        setMaxTime(newTime);
        setTimer(newTime); // adds 5 more minutes
        // todo Implement logic to request another 5 minutes from server
        console.log('Requesting another 5 minutes');
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <div className="video-chat-page-main main-div" style={{backgroundImage: `url(${wavy_background})`}}>
            <div className="video-chat-card mycard">
                <IconButton aria-label="close" onClick={stopDating} className="close-button" size="small"
                            style={{position: 'absolute', top:'20px', left:'9%', width:'20px', height: '20px', backgroundColor:'#ffb8d3'}}>
                    <Close fontSize="inherit"/>
                </IconButton>
                <div className="video-chat-container">
                    <Meeting/>
                </div>
            </div>
            <div className="video-chat-actions-card mycard">
                <IconButton className="info-button" color="secondary" onClick={handleTourStart}
                            style={{position:'absolute', bottom:'10%', left:'7%'}}>
                    <Info>Start Tour</Info>
                </IconButton>
                <div className="video-chat-timer">
                    <Box display='flex' justifyContent='center' alignItems='center'>
                        <CircularProgress variant="determinate" value={normalise(timer)} />
                        <Typography position='absolute' style={{fontSize:'small'}}>{formatTime(timer)}</Typography>
                    </Box>
                    <div className="add-time-btn">
                        <Fab variant="contained" color="secondary" style={{width: '40px', height: '40px'}}
                             disabled={didExtendTime} onClick={handleRequestAnother5Minutes}>
                            +5
                        </Fab>
                    </div>
                </div>

                <div className="video-chat-action-btns">
                    <div className="next-conversation-btn">
                        <Button variant="contained" color="secondary" onClick={handleNextConversation}>
                            Next Date
                        </Button>
                    </div>
                </div>
            </div>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                run={isTourRunning}
                showSkipButton
                steps={videochat_steps}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                }}
            />
        </div>
    );
};

export default VideoChatPage;
