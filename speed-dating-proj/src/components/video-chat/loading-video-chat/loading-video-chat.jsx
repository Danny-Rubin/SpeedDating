import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import Button from "@mui/material/Button";
import loading_gif from '../../../assets/heart-loader.gif'
import './loading-video-chat.css'
import {post, get} from 'aws-amplify/api';
import wavy_background from "../../../assets/wavy_background.png";

async function findMatch() {
    console.log('ask server to find match');
    const localStorageItems = Object.keys(localStorage)
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

    if (!localStorage.getItem('meeting_id'))
        return null;

    try {
        const restOperation = get({
            apiName: 'matches',
            path: '/matches/getToken/{' + localStorage.getItem('meeting_id') + '}'
        });
        const {body} = await restOperation.response;
        return body.json();

    } catch (error) {
        console.log('GET call failed: ', error);
    }
}

const LoadingVideoChat = () => {
    const navigate = useNavigate();


    useEffect(() => {

        findMatch()
            .then(response => {
                console.log(response);
                localStorage.setItem("meeting_id", response["meeting_id"]);
                // window.location.href = '/video-chat?token=' + response["user1_token"] + "&session_id=" + response["meeting_id"];
            })

    }, []); // The empty dependency array means the effect runs once when the component mounts

    // useEffect(() => {
    //
    //     getToken()
    //         .then(response => {
    //             console.log(response);
    //             if (response["has_match"]) {
    //                 navigate('/video-chat?token=' + response["token"] + "&session_id=" + localStorage.getItem('meeting_id'));
    //             }
    //         })
    //
    // }, [navigate]); // The empty dependency array means the effect runs once when the component mounts

    return (
        <div className="loading-video-chat-main main-div" style={{backgroundImage: `url(${wavy_background})`}}>
            <div className="loading-video-chat-card mycard">
                <div>
                    <h2 className="loading-video-title">
                        Looking for a match...
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