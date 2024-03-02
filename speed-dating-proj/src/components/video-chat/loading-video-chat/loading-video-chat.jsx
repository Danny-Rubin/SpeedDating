import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import Button from "@mui/material/Button";
import loading_gif from '../../../assets/heart-loader.gif'
import './loading-video-chat.css'
import {getRequest} from "../../../services/amplify-api-service";
import wavy_background from "../../../assets/testing-background.png";

const matchesApiName = 'matches';
const findMatchPath = '/matches/find';


const LoadingVideoChat = () => {
    const navigate = useNavigate();

    useEffect(() => {

        getRequest(matchesApiName, findMatchPath)
            .then(response =>
            {
                console.log(response);
                navigate('/video-chat?token=' + response["token"] + "&session_id=" + response["session_id"]);
            })
            .catch(err=>{
                console.log(`error getting matched. the error: ${err}`)
            })

    }, [navigate]); // The empty dependency array means the effect runs once when the component mounts

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