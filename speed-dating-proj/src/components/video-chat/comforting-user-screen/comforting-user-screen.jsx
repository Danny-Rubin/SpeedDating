import Button from "@mui/material/Button";
import './comforting-user-screen.css'
import  {useNavigate} from 'react-router-dom'
import React from "react";
import wavy_background from "../../../assets/wavy_background.png";

const ComfortingUserScreen = () => {
    const navigate = useNavigate();

    const onNextDateClicked = ()=>{
        // todo send to server
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
                            Move on to the next date
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