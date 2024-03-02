// Header.js
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import text_logo from '../../assets/flash-flirt-text.png'
import './header.css'
import {ExitToApp, Person} from "@mui/icons-material";
import {signOut } from 'aws-amplify/auth';
import {useNavigate} from 'react-router-dom'





const Header = () => {
    const navigate = useNavigate();

    const handleSignOut= ()=>{
        signOut().then(()=>{
            navigate('/login');
        }).catch (error=>{
            console.log('error signing out: ', error);
        })
    };


    return (
        <AppBar color="primary" className="header-main">
            <Toolbar className="header-toolbar">
                <div className="left-options">
                    <div className="header-logout">
                        <Button color="inherit" onClick={handleSignOut} className="header-logout-btn">
                            <ExitToApp/>
                            Logout
                        </Button>
                    </div>
                </div>
                <div className="header-text-logo">
                    <Button edge="start" color="inherit" aria-label="text-logo" className="text-logo-btn"
                            href="./homepage" style={{ backgroundColor: 'transparent' }}>
                        <img src={text_logo} className="text-logo"/>
                    </Button>
                </div>
                <div className="right-options">
                    <div className="header-edit-profile">
                        <Button color="inherit" href="/user-form" className="header-profile-btn">
                            <Person/>
                            Profile
                        </Button>
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
