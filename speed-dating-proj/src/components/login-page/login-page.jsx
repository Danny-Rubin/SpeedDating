import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import '@aws-amplify/ui-react/styles.css';
import config from '../../amplifyconfiguration.json';
import { useNavigate } from "react-router-dom";
import login_background from '../../assets/login-background.jpg'
import {fetchAuthSession} from 'aws-amplify/auth';


import {
    Authenticator,
    ThemeProvider,
    View,
    useTheme
} from "@aws-amplify/ui-react";

import { LoginHeader } from "./login-header";
import {getRequest} from "../../services/amplify-api-service";



Amplify.configure(config);
const profileApiName = 'profiles';

function LoginPage({setIsLoggedIn}) {

    const navigate = useNavigate();


    useEffect(() => {
        // Subscribe to the event
        const hubListenerCancelToken = Hub.listen('auth', ({ payload }) => {
            if (payload.event === 'signedIn'){
                setIsLoggedIn(true);
                navigateByProfileState();
            }
        });

        return () => {
            // Unsubscribe from the event when the component is unmounted
            hubListenerCancelToken()
        };
    }, [navigate]);

    const navigateByProfileState = ()=>
    {
        fetchAuthSession({forceRefresh:true})
            .then((session)=>{
                const currAccessToken = session.tokens.accessToken.toString();
                return getRequest(profileApiName, profileApiName, currAccessToken);
            }).then(userProfile=>{
            if (userProfile){
                navigate('/homepage');
            }
            else{

            }
        }).catch(err=>{
            navigate("/user-form");
        });
    };


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
        <div className="login-page-main main-div" style={{backgroundSize: 'cover', backgroundImage: `url(${login_background})`
        , overflow:'scroll'}}>
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
