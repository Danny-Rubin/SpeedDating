import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserForm from "./components/user-form/user-form";
import LoginPage from "./components/login-page/login-page";
import HomePage from "./components/homepage/homepage";
import VideoChatPage from "./components/video-chat/video-chat-page/video-chat-page";
import React, {useEffect, useState} from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoadingVideoChat from "./components/video-chat/loading-video-chat/loading-video-chat";
import FinishedVideoChat from "./components/video-chat/finished-video-chat/finished-video-chat";
import SharedDetailsPage from "./components/shared-details-page/shared-details-page";
import { getCurrentUser } from 'aws-amplify/auth';
import LandingPage from "./components/login-page/landing-page/landing-page";



const theme = createTheme({
    palette: {
        primary: {
            main: '#ffb8d3'
        },
        secondary: {
            main: '#90243a'
        }
    }
});


const App = () => {

    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        currentAuthenticatedUser();
    }, [isLoggedIn]);

    const currentAuthenticatedUser = ()=>
    {
        getCurrentUser().then(data=>{
            setLoggedIn(true);

        }).catch(err=>{
            setLoggedIn(false)
        })
    };

    const setIsLoggedIn = (isLoggedIn) => {
        setLoggedIn(isLoggedIn);
    };

  return (
      <ThemeProvider theme={theme}>
          <Router>
              <div style={{height:'100%', overflow:'hidden'}}>
                    <Routes>
                    {
                        isLoggedIn?
                            <Route path="/" element={<HomePage setIsLoggedIn={setIsLoggedIn}/>}/>
                            :
                            <Route path="/" element={<LandingPage/>}/>
                    }
                        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/> }/>
                        <Route path="/user-form" element={<UserForm setIsLoggedIn={setIsLoggedIn}/>}/>
                        <Route path="/homepage" element={<HomePage setIsLoggedIn={setIsLoggedIn}/>}/>
                        <Route path="/loading-chat" element={<LoadingVideoChat/>}/>
                        <Route path="/finished-chat" element={<FinishedVideoChat/>}/>
                        <Route path="/video-chat" element={<VideoChatPage/>}/>
                        <Route path="/shared-details" element={<SharedDetailsPage setIsLoggedIn={setIsLoggedIn}/>} />
                    </Routes>
                  </div>
          </Router>
      </ThemeProvider>
  );
};

export default App;
