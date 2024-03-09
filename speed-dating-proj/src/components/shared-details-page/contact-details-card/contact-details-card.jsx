import React from "react";
import SendWhatsAppBtn from "../send-whatsapp-button/send-whatsapp-button";
import './contact-details-card.css';
import person_avatar from '../../../assets/person-love.png'

const ContactDetailsCard = ({contact, handleClick}) => {

    return (
        <div className={"mycard details-card-container details-card-"+contact.profileId}>
            <header className="details-card-header">
                <img className="person-avatar" src={person_avatar} alt={contact.profileId} />
            </header>
            <h1 className="bold-text">
                {contact.name}
                <div className="normal-text">{contact.dateOfBirth}</div>
            </h1>
            <h2 className="normal-text">{contact.location}</h2>
            <div className="contact-details">
                <div className="phone-number">
                    <h1 className="bold-text">{contact.phone}</h1>
                </div>
                <div className="send-whatsapp">
                    <SendWhatsAppBtn phone={contact.phone} handleClick={handleClick}/>
                </div>
            </div>
        </div>
    );
};

export default ContactDetailsCard;