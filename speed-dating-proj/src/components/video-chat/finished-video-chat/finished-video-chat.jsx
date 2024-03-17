import Button from "@mui/material/Button";
import './finished-video-chat.css'
import  {useNavigate} from 'react-router-dom'
import React, {useEffect, useState} from "react";
import wavy_background from "../../../assets/wavy_background.png";
import {postRequest} from "../../../services/amplify-api-service";
import {fetchAuthSession} from 'aws-amplify/auth';
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";
import ReportIcon from '@mui/icons-material/Report';
import {useLocation} from "react-use";


const matchesApiName = 'matches';
const shareDetailsPath = '/matches/shareDetails/';
const reportPath = 'todo enter when BE is ready';

const FinishedVideoChat = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(undefined);
    const meetingId = localStorage.getItem('meeting_id');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const location = useLocation();




    useEffect(() => {
        currentAuthenticatedUser().then(()=>console.log('success'));
        const searchParams = new URLSearchParams(location.search);
        const endedEarlyParam = searchParams.get("endEarly");
        if (endedEarlyParam != null){
            setSnackbarOpen(true);
        }

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

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleReport = () => {
        setSnackbarOpen(false);
        if (meetingId)
            postRequest(matchesApiName, `${reportPath}${meetingId}`,{}, accessToken)
                .then(()=>console.log('Report successful!'))
                .catch((e)=> console.log(e));
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleReport}>
                Report
            </Button>
        </React.Fragment>
    );


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
            <Snackbar
                anchorOrigin={{vertical:'top', horizontal:'center'}}
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                autoHideDuration={10000}
            >
                <Alert
                    severity="error"
                    sx={{ width: '100%' }}
                    iconMapping={{
                        error: <ReportIcon fontSize="inherit" />,
                    }}
                    action={action}
                >
                    Inappropriate behavior?
                    <br/>Help us maintain a safe space
                </Alert>
            </Snackbar>
        </div>
    );
};

export default FinishedVideoChat;