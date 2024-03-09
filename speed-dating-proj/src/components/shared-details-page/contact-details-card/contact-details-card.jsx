import React, {useEffect, useState} from "react";
import SendWhatsAppBtn from "../send-whatsapp-button/send-whatsapp-button";
import './contact-details-card.css';
import person_avatar from '../../../assets/person-love.png'
import IconButton from "@mui/material/IconButton";
import { getUrl} from 'aws-amplify/storage';
import {Facebook, Instagram} from "@mui/icons-material";

const instaPattern =  new RegExp('/(?:(?:http|https):\\/\\/)?(?:www\\.)?(?:instagram\\.com|instagr\\.am)\\/([A-Za-z0-9-_\\.]+)/');;

const ContactDetailsCard = ({contact, handleClick, handleSocialClick}) => {
    const isInsta = (url)=>{
        return instaPattern.test(url)
    };

    const [profilePicUrl, setProfilePicUrl] = useState(person_avatar);

    useEffect(()=>{
        updateImgUrl().then();
    }, []);

    const updateImgUrl = async()=> {
        try{
            let url = await getUrl({
                key: `${contact.profileId}.jpeg`,
                options: {
                    accessLevel: 'guest', // can be 'private', 'protected', or 'guest' but defaults to `guest`
                    targetIdentityId: contact.profileId, // id of another user, if `accessLevel` is `guest`
                    download: false
                }
            });
            setProfilePicUrl(url.url.href);
        }
        catch (e) {

        }
    };

    const isCurrInsta = isInsta(contact.social);

    return (
        <div className={"mycard details-card-container details-card-"+contact.profileId}>
            <header className="details-card-header">
                <img className="person-avatar" src={profilePicUrl} alt={contact.profileId} />
            </header>
            <h1 className="bold-text">
                {contact.profileId}
                <div className="normal-text">{contact.dateOfBirth}</div>
            </h1>
            <h2 className="normal-text">{contact.location}</h2>
            <div className="contact-details">
                <div className="send-whatsapp">
                    <SendWhatsAppBtn phone={contact.phone} handleClick={handleClick}/>
                </div>
                <div className="goto-social">
                    <IconButton onClick={handleSocialClick} disabled={contact.social === ''}
                                color={isCurrInsta? 'secondary' : 'info'}>
                        {isCurrInsta ? (<Instagram />) : (<Facebook />)}
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ContactDetailsCard;