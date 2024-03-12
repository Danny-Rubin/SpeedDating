import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import Button from "@mui/material/Button";
import loading_gif from '../../../assets/heart-loader.gif'
import './loading-video-chat.css'
import {post, get} from 'aws-amplify/api';
import wavy_background from "../../../assets/wavy_background.png";

async function findMatch() {
    console.log('ask server to find match');
    const localStorageItems = Object.keys(localStorage);
    console.log(localStorageItems.filter(key => key.endsWith('accessToken')))
    try {
        const restOperation = post({
            apiName: 'matches',
            path: '/matches/find',
            options:
                {
                    headers:
                        {
                            'Content-Type': 'application/json',
                            'authorization': "Bearer " + localStorage.getItem(localStorageItems.filter(key => key.endsWith('accessToken'))[0])
                        }
                }
        });
        const {body} = await restOperation.response;
        return body.json();

    } catch (error) {
        console.log('GET call failed: ', error);
    }
}

async function getToken() {
    console.log('get token from server');
    const localStorageItems = Object.keys(localStorage);
    if (!localStorage.getItem('meeting_id'))
        return null;

    try {
        const restOperation = get({
            apiName: 'matches',
            path: '/matches/getToken/' + localStorage.getItem('meeting_id'),
            options:
                {
                    headers:
                        {
                            'Content-Type': 'application/json',
                            'authorization': "Bearer " + localStorage.getItem(localStorageItems.filter(key => key.endsWith('accessToken'))[0])
                        }
                }
        });
        const {body} = await restOperation.response;
        return body.json();

    } catch (error) {
        console.log('GET call failed: ', error);
    }
}

const LoadingVideoChat = () => {
    const navigate = useNavigate();
    const [gotInQ, setGotInQ] = useState(false);
    const [matched, setMatched] = useState(false);

    useEffect(() => {

        findMatch()
            .then(response => {
                console.log(response);
                localStorage.setItem("meeting_id", response["meetingId"]);
                setMatched(response["hasMatch"])
                setGotInQ(true);
            })

    }, []); // The empty dependency array means the effect runs once when the component mounts

    useEffect(() => {
        const interval = setInterval(() => {

            if (gotInQ) {
                console.log("meeting id exists start fetching for token");
                getToken()
                    .then(response => {
                        console.log(response);
                        if (response["hasMatch"]) {
                            navigate('/video-chat?token=' + response["token"] + "&session_id=" + localStorage.getItem('meeting_id'));
                        }
                    })
            }

        }, 5000); // 5000 milliseconds = 5 seconds


        // Clean up the interval on unmount to avoid memory leaks
        return () => clearInterval(interval);
    }, [navigate, gotInQ]); // Empty dependency array to run the effect only once on mount

    return (
        <div className="loading-video-chat-main main-div" style={{backgroundImage: `url(${wavy_background})`}}>
            <div className="loading-video-chat-card mycard">
                <div>
                    <h2 className="loading-video-title">
                        {(!matched && !gotInQ) ? "Looking for a match..."  : (gotInQ && !matched) ? "Your data is being processed..." : "Match Found! Loading..."}
                    </h2>
                </div>
                <div className="loading-video-loader">
                    <img className="loader" src={loading_gif} alt="Looking for a match..."/>
                </div>
                <div className="loading-video-cancel">
                    <Button href="./homepage" className="cancel-loading-btn"
                            style={{backgroundColor: '#fa3ac56b'}}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default LoadingVideoChat;