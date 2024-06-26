import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    MeetingProvider,
    useMeeting,
    useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import {useLocation} from "react-router-dom";
import "./Meeting.css"; // Import CSS file for styling
import {CiVideoOff, CiVideoOn, CiMicrophoneOn, CiMicrophoneOff} from "react-icons/ci";
import Snackbar from "@mui/material/Snackbar/Snackbar";

function ParticipantView(props) {
    const micRef = useRef(null);
    const {webcamStream, micStream, webcamOn, micOn, isLocal, displayName} =
        useParticipant(props.participantId);
    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("videoElem.current.play() failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);


    return (
        <>
            <div className="participant-view">
                <audio ref={micRef} autoPlay playsInline muted={isLocal}/>
                {webcamOn && (
                    <ReactPlayer
                        style={{}}
                        playsinline
                        pip={false}
                        light={false}
                        controls={false}
                        height={"100%"}
                        width={"100%"}
                        muted={true}
                        playing={true}
                        url={videoStream}
                        onError={(err) => {
                            console.log(err, "participant video error");
                        }}
                    />

                )}

            </div>
        </>
    );
}

function MySmallView(props) {
    const micRef = useRef(null);
    const {webcamStream, micStream, webcamOn, micOn, isLocal} =
        useParticipant(props.participantId);
    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("videoElem.current.play() failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);


    return (
        <div className="participant-view">
            <audio ref={micRef} autoPlay playsInline muted={isLocal}/>
            {webcamOn && (
                <ReactPlayer
                    style={{}}
                    playsinline
                    pip={false}
                    light={false}
                    controls={false}
                    height={"100%"}
                    width={"100%"}
                    muted={true}
                    playing={true}
                    url={videoStream}
                    onError={(err) => {
                        console.log(err, "participant video error");
                    }}
                />

            )}

        </div>
    );
}

function MeetingView(props) {
    const [joined, setJoined] = useState(null);
    const [webCamOnState, setWebCamOnState] = useState(true);
    const [micOnState, setMicOnState] = useState(true);
    const [aloneSnackbarOpen, setAloneSnackbarOpen] = useState(false);
    //Get the method which will be used to join the meeting.
    //We will also get the participants list to display all participants
    const {toggleMic, toggleWebcam, leave} = useMeeting();
    const {join, participants, localParticipant} = useMeeting({
        //callback for when meeting is joined successfully
        onMeetingJoined: () => {
            setJoined("JOINED");
        }
    });
    const joinMeeting = () => {
        setJoined("JOINING");
        join();
    };

    function toggleWebCamWrapper(state) {
        console.log(webCamOnState);
        setWebCamOnState(state);
        toggleWebcam();
    }

    function toggleMicWrapper(state) {
        console.log(state);
        setMicOnState(state);
        toggleMic();
    }

    function leftAlone(){
        setAloneSnackbarOpen(true);
    }


    useEffect(() => {
        return () => {
            // This function will be called when the component unmounts (i.e., when navigating away)
            leave();
        };
    }, []);

    useEffect(() => {
        let timer;
        if (participants.size === 2) {
            props.startTimer();
        }
        if (participants.size === 1){
            timer = setTimeout(() => {
                leftAlone();
            }, 17000); // 17000 milliseconds = 17 seconds

        }
        return () => clearTimeout(timer);
    }, [participants.size]);

    const handleCloseAloneSnackbar = () => {
        setAloneSnackbarOpen(false);
    };


    function Controls() {


        return (
            <div className="controls">

                <button onClick={() => toggleMicWrapper(!micOnState)}>
                    {micOnState ? <CiMicrophoneOn color={"#ffffff"}/> : <CiMicrophoneOff color={"#ffffff"}/>}
                </button>
                <button onClick={() => toggleWebCamWrapper(!webCamOnState)}>
                    {webCamOnState ? <CiVideoOn color={"#ffffff"}/> : <CiVideoOff color={"#ffffff"}/>}
                </button>
                <Snackbar
                    anchorOrigin={{vertical:'top', horizontal:'center'}}
                    open={aloneSnackbarOpen}
                    onClose={handleCloseAloneSnackbar}
                    autoHideDuration={8000}
                    message="Looks like you're alone, feel free to go to the next date."
                >
                </Snackbar>
            </div>

        );
    }

    return (
        <div className="meeting-view">
            {joined && joined === "JOINED" ? (
                <>
                    <div className="participants-container">
                        {participants.size === 1 ? (
                            <div className="other-participant-container">
                                {[...participants.keys()].map((participantId) => (
                                    <ParticipantView
                                        participantId={participantId}
                                        key={participantId}
                                    />
                                ))}
                            </div>
                        ) : participants.size === 2 ? (
                            <>
                                {[...participants.keys()].filter(id => id !== localParticipant.id).map((participantId) => (
                                    <>
                                        <div className="other-participant-container">
                                            <div style={{color:'white'}}>{props.matchName}</div>
                                            <ParticipantView
                                                participantId={participantId}
                                            />
                                            <div className="local-participant-container">
                                                <MySmallView
                                                    participantId={localParticipant.id}
                                                />
                                            </div>
                                        </div>



                                    </>
                                ))}
                            </>
                        ) : (
                            <>
                            </>
                        )}

                    </div>
                    <div className="controls-container">
                        <Controls/>
                    </div>
                </>
            ) : joined && joined === "JOINING" ? (
                <h2>Joining the meeting...</h2>
            ) : (
                <button onClick={joinMeeting}>Join the meeting</button>
            )}
        </div>
    );
}

function Meeting({username, startTimer}) {
    const [token, setToken] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [matchName, setMatchName] = useState(null);
    const location = useLocation();


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenParam = searchParams.get("token");
        const matchNameParam = searchParams.get("match");
        const sessionIdParam = searchParams.get("session_id");
        if (tokenParam) {
            setToken(tokenParam);
        }
        if (sessionIdParam) {
            setSessionId(sessionIdParam);
        }
        if(matchNameParam){
            setMatchName(matchNameParam);
        }
    }, [location]);

    return (
        <div className="meeting-container">
            {!token || !sessionId ? (
                <div></div>
            ) : (
                <div style={{height: '100%', width: '100%'}}>
                    <MeetingProvider
                        config={{
                            meetingId: sessionId,
                            micEnabled: true,
                            webcamEnabled: true,
                            name: username,
                        }}
                        token={token}

                    >
                        {<MeetingView startTimer={startTimer} matchName={matchName}/>}
                    </MeetingProvider>
                </div>
            )}
        </div>
    );
}

export default Meeting;