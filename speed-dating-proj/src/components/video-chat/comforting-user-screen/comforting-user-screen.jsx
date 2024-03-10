import Button from "@mui/material/Button";
import './comforting-user-screen.css'
import React from "react";
import wavy_background from "../../../assets/wavy_background.png";

const ComfortingUserScreen = () => {

    return (
        <div className="finished-video-chat-main main-div" style={{backgroundImage: `url(${wavy_background})`}}>
            <div className="finished-video-chat-card mycard">
                <div className="finished-video-text">
                    <h2 className="finished-video-title">
                        <div className="spark-title">Hey there!</div>
                        <div className="comforting-text">
                            It looks like your date ended a bit earlier than expected.
                            <br/>
                            No worries, there are plenty of matches waiting to meet someone as awesome as you.
                            <br/>
                            <br/>
                            Ready for another chance at finding a connection?
                        </div>
                    </h2>
                </div>
                <div >
                    <div className="finished-video-button">
                        <Button className="next-date-button"
                                href='/loading-chat'
                                style={{backgroundColor:'rgb(255 77 150)'}}>
                            Bring in on!
                        </Button>
                    </div>
                    <div className="finished-video-button">
                        <Button className="dont-share-details-button"
                                href='/homepage'
                                style={{backgroundColor:'rgba(250,0,29,0.75)'}}>
                            Need a break
                        </Button>
                    </div>
                </div>
                <div className="finished-video-tip-text">
                    Your perfect match may be just around the corner!
                </div>
            </div>
        </div>
    );
};

export default ComfortingUserScreen;