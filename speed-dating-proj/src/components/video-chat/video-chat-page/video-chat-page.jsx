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
import {fetchAuthSession} from 'aws-amplify/auth';
import {getRequest, postRequest} from "../../../services/amplify-api-service";
import { generateClient } from 'aws-amplify/api';
import {onUpdateMatch} from '../../../graphql/subscriptions';
import {useLocation} from "react-router-dom";


const matchesApiName = 'matches';
const extendMeetingPath = '/matches/extendMeeting/';
const mutualConsentExtendPath = '/matches/mutualConsentExtendMeeting/';

const VideoChatPage = () => {
    const navigate = useNavigate();
    const meetingId = localStorage.getItem('meeting_id');
    const location = useLocation();


    const initialTimer = 3 * 60; // 3 minutes in seconds
    const [maxTime, setMaxTime] = useState(initialTimer);
    const [timer, setTimer] = useState(initialTimer);
    const [timeExtended, setTimeExtended] = useState(false);
    const [didExtendTime, setDidExtendTime] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [isTourRunning, setTourRunning]= useState(false);
    const [username, setUsername]= useState('');

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
        const client = generateClient();
        const searchParams = new URLSearchParams(location.search);
        const sessionIdParam = searchParams.get("session_id");

        const variables = {
            filter: {
                session_id: {eq: sessionIdParam},
                user1WantsToExtendMeeting: { eq: true },
                user2WantsToExtendMeeting: { eq: true }

            }
        };
        const mutualExtendSub = client
            .graphql({ query: onUpdateMatch })
            .subscribe({
                next: ({ data }) => console.log(data),
                error: (error) => console.warn(error)
            });


        return () => {
            mutualExtendSub.unsubscribe();
        };
    }, []);


    useEffect(() => {
        currentAuthenticatedUser().then(()=>{});
    }, []);

    const currentAuthenticatedUser = async ()=>
    {
        try{
            const session = await fetchAuthSession({forceRefresh:true});
            const currAccessToken = session.tokens.accessToken.toString();
            const username = session.tokens.accessToken.payload.username;
            setAccessToken(currAccessToken);
            setUsername(username);
        }
        catch(err){
            console.log(err);
        }
    };




    useEffect(() => {
        if (timer <= 5 && didExtendTime && !timeExtended){
            checkIfTimeWasExtended();
        }
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
        navigate('/finished-chat');
    };

    const handleRequestAnother3Minutes = async () => {
        console.log('Requesting another 3 minutes from server.. ');
        try{
            await postRequest(matchesApiName, `${extendMeetingPath}${meetingId}`,{} ,accessToken);
            setDidExtendTime(true);
        }
        catch (e) {
            console.log(e);
        }
    };

    const checkIfTimeWasExtended = ()=>{
        console.log('checking if mutual consent to extend time');
        getRequest(matchesApiName, `${mutualConsentExtendPath}${meetingId}`, accessToken)
            .then((response)=> {
                if (response['mutualConsent']){
                    handleAddAnother3Mintes();
                }
                else {
                    navigate('/finished-chat');
                }
            })
            .catch((e)=>console.log(e));
    };

    const handleAddAnother3Mintes = ()=>{
        const newTime = timer + 3*60;
        setMaxTime(newTime);
        setTimer(newTime); // adds 3 more minutes
        setTimeExtended(true);
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
                    <Meeting username={username}/>
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
                             disabled={didExtendTime} onClick={handleRequestAnother3Minutes}>
                            +3
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
