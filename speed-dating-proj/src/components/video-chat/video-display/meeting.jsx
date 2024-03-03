import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    MeetingProvider,
    useMeeting,
    useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import {useLocation} from "react-router-dom";

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
        <div>
            <audio ref={micRef} autoPlay playsInline muted={isLocal}/>
            {webcamOn && (
                <ReactPlayer
                    playsinline // very very imp prop
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

function MeetingView() {
    const [joined, setJoined] = useState(null);
    //Get the method which will be used to join the meeting.
    //We will also get the participants list to display all participants
    const {join, participants} = useMeeting({
        //callback for when meeting is joined successfully
        onMeetingJoined: () => {
            setJoined("JOINED");
        }
    });
    const joinMeeting = () => {
        setJoined("JOINING");
        join();
    };

    return (
        <div className="container">
            {joined && joined === "JOINED" ? (
                <div>
                    {[...participants.keys()].map((participantId) => (
                        <ParticipantView
                            participantId={participantId}
                            key={participantId}
                        />
                    ))}
                </div>
            ) : joined && joined === "JOINING" ? (
                <p>Joining the meeting...</p>
            ) : (
                <button onClick={joinMeeting}>Join the meeting</button>
            )}
        </div>
    );
}

function Meeting() {

    const [token, setToken] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenParam = searchParams.get('token');
        const sessionIdParam = searchParams.get('session_id');
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
        <div>
            {!token || !sessionId ? (
                <div></div>
            ) : (
                <div>
                    <MeetingProvider
                        config={{
                            meetingId: sessionId,
                            micEnabled: true,
                            webcamEnabled: true,
                            name: "עידו's Org",
                        }}
                        token={token}
                    >
                        {<MeetingView/>}
                    </MeetingProvider>
                </div>
            )
            }
        </div>

    );

}

export default Meeting;