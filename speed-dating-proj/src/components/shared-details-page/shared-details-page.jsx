import Header from "../header/header";
import React, {useEffect, useState} from "react";
import ContactDetailsCard from "./contact-details-card/contact-details-card";
import './shared-details-page.css'
import SendMessage from "./send-whatsapp-button/send-message";
import {getRequest} from "../../services/amplify-api-service";
import {fetchAuthSession} from 'aws-amplify/auth';
import Loader from "../loader/loader";

const matchesApiName = "matches";
const getContactsPath = "/matches/sharedProfilesList";

const SharedDetailsPage = ({setIsLoggedIn}) => {

    const [contactsData, setContactsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect (() => {
        currentAuthenticatedUser()
            .then(()=>setIsLoading(false));

    }, []);

    const currentAuthenticatedUser = async ()=>
    {
        try{
            const session = await fetchAuthSession({forceRefresh:true});
            const currAccessToken = session.tokens.accessToken.toString();
            const contactDetails = await getRequest(matchesApiName, getContactsPath, currAccessToken);
            if (contactDetails){
                setContactsData(contactDetails.res);
                console.log(contactDetails);
            }
        }
       catch(err){
            console.log(err);
        }
    };


    const togglePopUp = ()=>{
        setShowPopup(!showPopup);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [sendToPhone, setSendToPhone] = useState('0527799973');



    const handleWhatsappClick = (phone)=>{
        setSendToPhone(phone);
        togglePopUp();
    };

    const handleSocialClick = (socialUrl)=>{
        window.open(
            socialUrl,
            '_blank'
        );
    };

    if (isLoading){
        return (<Loader/>)
    }
    return (<div className="shared-details-page-main main-div">
                <div className={"header-part"}>
                    <Header setIsLoggedIn={setIsLoggedIn}/>
                </div>
                <div className="shared-details-content">
                    {
                        (contactsData && contactsData.length) ?
                            <div className="shared-details-items">
                                {showPopup}
                                {contactsData.map((contact) => (
                                    <ContactDetailsCard key={contact.profileId} contact={contact}
                                                        handleClick={()=>handleWhatsappClick(contact.phone)}
                                                        handleSocialClick={()=>handleSocialClick(contact.social)}
                                    />
                                ))}
                            </div>
                            :
                            <div className="no-contacts-txt">
                                <div>You dont have any contacts</div>
                                <div>Go dating and find new love interests!</div>
                            </div>

                    }
                </div>
                <SendMessage key={showPopup} show={showPopup} handleClose={togglePopUp} phone={sendToPhone}/>
            </div>
    );
};

export default SharedDetailsPage;