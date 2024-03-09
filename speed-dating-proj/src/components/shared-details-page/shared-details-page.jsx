import Header from "../header/header";
import React, {useEffect, useState} from "react";
import ContactDetailsCard from "./contact-details-card/contact-details-card";
import './shared-details-page.css'
import SendMessage from "./send-whatsapp-button/send-message";
import {getRequest} from "../../services/amplify-api-service";
import {fetchAuthSession} from 'aws-amplify/auth';

const matchesApiName = "matches";
const getContactsPath = "/matches/sharedProfilesList";

const SharedDetailsPage = ({setIsLoggedIn}) => {

    const [contactsData, setContactsData] = useState([
        {'name': 'noa', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':1},
        {'name': 'michal', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':2},
        {'name': 'danny', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':3},
        {'name': 'ido', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':4},
        {'name': 'rotem', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':5},
        {'name': 'noa', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':6},
        {'name': 'bon', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':7},
        {'name': 'jovi', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':8},
        {'name': 'miki', 'phone': '0527799973', 'city':'DisneyLand', 'age':22, 'id':9},
        {'name': 'mouse', 'phone': '0527799973', 'city':'DisneyLand', 'age':22, 'id':10},
        {'name': 'cher', 'phone': '0527799973', 'city':'TLV', 'age':22, 'id':11},
    ]);
     //const [contactsData, setContactsData] = useState([]);

    useEffect (() => {
        currentAuthenticatedUser()
            .then(()=>console.log('success'));

    }, []);

    const currentAuthenticatedUser = async ()=>
    {
        try{
            const session = await fetchAuthSession({forceRefresh:true});
            const currAccessToken = session.tokens.accessToken.toString();
            const contactDetails = await getRequest(matchesApiName, getContactsPath, currAccessToken);
            if (contactDetails){
                //setContactsData(contactDetails);
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


    return (
        <div className="shared-details-page-main main-div">
            <div className={"header-part"}>
                <Header setIsLoggedIn={setIsLoggedIn}/>
            </div>
            <div className="shared-details-content">
            {
                (contactsData && contactsData.length) ?
                    <div className="shared-details-items">
                        {showPopup}
                        {contactsData.map((contact) => (
                            <ContactDetailsCard key={contact.id} contact={contact} handleClick={()=>handleWhatsappClick(contact.phone)}/>
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