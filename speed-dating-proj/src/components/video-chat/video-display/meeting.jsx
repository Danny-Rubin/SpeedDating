import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    MeetingProvider,
    useMeeting,
    useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import {useLocation} from "react-router-dom";
import "./Meeting.css"; // Import CSS file for styling
import { CiVideoOff, CiVideoOn, CiMicrophoneOn , CiMicrophoneOff  } from "react-icons/ci";
function ParticipantView(props) {
    const micRef = useRef(null);
    const {webcamStream, micStream, webcamOn, micOn, isLocal, displayName} =
        useParticipant(props.participantId);
    let style = {maxWidth:'260px', maxHeight: '360px', width:'auto', height:'auto'};
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
                    style={{maxWidth:'250px', maxHeight: '360px', width:'auto', height:'auto'}}
                    playsinline
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={videoStream}
                    onError={(err) => {
                        console.log(err, "participant video error");
                    }}
                />

            )}
            <h2 style={{marginTop: '35px'}}>{displayName}</h2>
        </div>
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
        <div className="participant-view" style={{position: 'fixed', top:'41%'}}>
            <audio ref={micRef} autoPlay playsInline muted={isLocal}/>
            {webcamOn && (
                <ReactPlayer
                    style={{maxWidth:'100px', maxHeight: '200px', width:'auto', height:'auto'}}
                    playsinline
                    pip={false}
                    light={false}
                    controls={false}
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
    //Get the method which will be used to join the meeting.
    //We will also get the participants list to display all participants
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

    useEffect(()=>{
        if(participants.size === 2){
            props.startTimer();
        }
    }, [participants.size]);

    function Controls() {
        const { toggleMic, toggleWebcam} = useMeeting();
        return (
            <div className="controls">

                <button  onClick={() => toggleMic()}>
                    {localParticipant.micOn ? <CiMicrophoneOff color={"#ffffff"}/> : <CiMicrophoneOn color={"#ffffff"}/>}
                </button>
                <button onClick={() => toggleWebcam()}>
                    {localParticipant.webcamOn ? <CiVideoOff color={"#ffffff"}/> : <CiVideoOn color={"#ffffff"}/>}
                </button>
            </div>
        );
    }

    return (
        <div className="meeting-view">
            {joined && joined === "JOINED" ? (
                <div style={{height:'100%'}}>
                    <div className="participants-container">
                        {participants.size === 1 ? (
                            <div style={{height:'100%'}}>
                                {[...participants.keys()].map((participantId) => (
                                    <ParticipantView
                                        participantId={participantId}
                                        key={participantId}
                                    />
                                ))}
                            </div>
                        ) : participants.size === 2 ? (
                            <div style={{height:'100%'}}>
                                {[...participants.keys()].filter(id => id !== localParticipant.id).map((participantId) => (
                                    <div style={{display:'inline-block'}} key={participantId}>
                                        <ParticipantView
                                            participantId={participantId}
                                        />
                                        <MySmallView
                                            participantId={localParticipant.id}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div/>
                        )}

                        <Controls/>
                    </div>
                </div>
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
    const location = useLocation();


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenParam = searchParams.get("token");
        const sessionIdParam = searchParams.get("session_id");
        console.log(tokenParam);
        console.log(sessionIdParam);
        if (tokenParam) {
            setToken(tokenParam);
        }

        if (sessionIdParam) {
            setSessionId(sessionIdParam);
        }
    }, [location]);

    return (
        <div className="meeting-container">
            {!token || !sessionId ? (
                <div></div>
            ) : (
                <div style={{height:'100%'}}>
                    <MeetingProvider
                        config={{
                            meetingId: sessionId,
                            micEnabled: true,
                            webcamEnabled: true,
                            name: username,
                        }}
                        token={token}
                    >
                        {<MeetingView startTimer={startTimer}/>}
                    </MeetingProvider>
                </div>
            )}
        </div>
    );
}

export default Meeting;