import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import '@aws-amplify/ui-react/styles.css';
import config from '../../amplifyconfiguration.json';
import { useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom
import wavy_pinks from '../../assets/4K_129.mp4'


import {
    Authenticator,
    ThemeProvider,
    View,
    useTheme
} from "@aws-amplify/ui-react";

import { LoginHeader } from "./login-header";



Amplify.configure(config);

function LoginPage() {

    const navigate = useNavigate();


    useEffect(() => {
        // Subscribe to the event
        const hubListenerCancelToken = Hub.listen('auth', ({ payload }) => {
            if (payload.event === 'signedIn'){
                // todo noa check if user has profile so navigate to homepage
                // todo otherwise navigate to user-form page.
                navigate("/user-form");
            }
        });


        return () => {
            // Unsubscribe from the event when the component is unmounted
            hubListenerCancelToken()
        };
    }, [navigate]);


    const components = {
        SignIn: {
            Header : LoginHeader
        },
        SignUp: {
            Header: LoginHeader
        }

    };

    const { tokens } = useTheme();
    const theme = {
        name: 'flashflirt',
        tokens: {
            colors:{
                background:
                    {
                        secondary: {value: '#90243a'}
                    },
                primary: {value: '#90243a'},
                secondary: {value: '#90243a'},

            },
            components:{
                button:{
                    primary: {
                        backgroundColor: { value: '{colors.background.secondary}' },
                    },
                    link: {
                        color: { value: '{colors.background.secondary}' },
                    },
                },
                tabs: {
                    item: {
                        color: tokens.colors.neutral['80'],
                        _active: {
                            borderColor: tokens.colors.neutral['100'],
                            color: '{colors.background.secondary}',
                        },
                    },
                }

            }
        }
    };



    return (
        <div className="login-page-main main-div" style={{backgroundColor: '#ffecdf'}}>
            <video id="background-video" autoPlay loop muted style={{objectFit: 'cover', position: 'fixed', height: "inherit", width: "inherit"}}>
                <source src={wavy_pinks} type="video/mp4"/>
            </video>
            <ThemeProvider theme={theme}>
                <View padding="xxl" style={{position:'relative'}}>
                    <Authenticator components={components} theme={theme}>
                    </Authenticator>
                </View>
            </ThemeProvider>
        </div>
    );
}
export default LoginPage;
