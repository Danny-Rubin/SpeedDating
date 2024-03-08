import Button from "@mui/material/Button";
import './finished-video-chat.css'
import  {useNavigate} from 'react-router-dom'
import React, {useEffect, useState} from "react";
import wavy_background from "../../../assets/wavy_background.png";
import {getRequest, postRequest} from "../../../services/amplify-api-service";
import {fetchAuthSession} from 'aws-amplify/auth';


const matchesApiName = 'matches';
const shareDetailsPath = '/matches/shareDetails/';

const FinishedVideoChat = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(undefined);
    const meetingId = localStorage.getItem('meeting_id');


    useEffect(() => {
        currentAuthenticatedUser().then(()=>console.log('success'));
    }, []);

    const currentAuthenticatedUser = async ()=>
    {
        try{
            const session = await fetchAuthSession({forceRefresh:true});
            const currAccessToken = session.tokens.accessToken.toString();
            setAccessToken(currAccessToken);
        }
        catch(err){
            console.log(err);
        }
    };



    const onShareClicked = ()=>{
            if (meetingId)
                postRequest(matchesApiName, `${shareDetailsPath}${meetingId}`,{}, accessToken)
                    .then(()=>console.log('success!'))
                    .catch((e)=> console.log(e));
            console.log('no meeting id found');
            navigate('/loading-chat');

    };

    const onDontShareClicked = ()=>{
        navigate('/loading-chat');
    };

    return (
        <div className="finished-video-chat-main main-div" style={{backgroundImage: `url(${wavy_background})`}}>
            <div className="finished-video-chat-card mycard">
                <div className="finished-video-text">
                    <h2 className="finished-video-title">
                        <div className="spark-title">Feeling a spark?</div>
                        <div className="share-details-text">
                            Share your contact and keep the romance alive</div>
                    </h2>
                </div>
                <div >
                    <div className="finished-video-button">
                        <Button className="share-details-button"
                                onClick={onShareClicked}
                                style={{backgroundColor:'rgb(255 77 150)'}} >
                            Yes!
                        </Button>
                    </div>
                    <div className="finished-video-button">
                        <Button className="dont-share-details-button"
                                onClick={onDontShareClicked}
                                style={{backgroundColor:'rgba(250,0,29,0.75)'}}>
                            Not Feeling It
                        </Button>
                    </div>
                </div>
                <div className="finished-video-tip-text">
                    Remember, love could be just a text away
                </div>
            </div>
        </div>
    );
};

export default FinishedVideoChat;