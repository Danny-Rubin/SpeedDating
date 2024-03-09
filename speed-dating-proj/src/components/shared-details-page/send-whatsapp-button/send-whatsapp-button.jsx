import React from "react";
import './send-whatsapp-button.css'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import IconButton from "@mui/material/IconButton";



const SendWhatsAppBtn = ({phone, handleClick}) => {


    return (
        <div className={ "whatsapp-main whatsapp-"+phone}>
            <div className="send-whatsapp-btn-main">
                <IconButton color="success" size="large" onClick={handleClick} disabled={phone === ''}>
                    <WhatsAppIcon />
                </IconButton>
            </div>
        </div>
    );
};

export default SendWhatsAppBtn;