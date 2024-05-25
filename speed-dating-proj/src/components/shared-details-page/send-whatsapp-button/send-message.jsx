import React, {useEffect, useRef, useState} from "react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import './send-message.css';



const SendMessage = ({handleClose, show, phone}) => {
    const CHARACTER_LIMIT = 100;

    const [showState, setShow] = useState(show);
    const showHideClassName = showState ? 'popup display-flex' : 'popup display-none';


    useEffect(() => { setShow(show) }, [show]);


    const [numberEmptyError, setNumberEmptyError] = useState(false);
    const [messageEmptyError, setMessageEmptyError] = useState(false);

    const [formData, setFormData] = useState({
        mobileNumber: phone,
        message: "",
    });

    const ref = useRef(null);

    const { mobileNumber, message } = formData;

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target) && showState) {
            handleClose();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);



    const onChange = (e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (mobileNumber.length < 1) {
            setNumberEmptyError(true);
            setTimeout(() => setNumberEmptyError(false), 3000);
        } else if (message.length < 1) {
            setMessageEmptyError(true);
            setTimeout(() => setMessageEmptyError(false), 3000);
        } else {
            // Regex expression to remove all characters which are NOT alphanumeric,
            // then convert to israeli format with country code
            let number = '972' + mobileNumber.replace(/[^\w\s]/gi, "").replace(/ /g, "").substring(1);

            // Appending the phone number to the URL
            let url = `https://wa.me/${number}`;
            url += `?text=${encodeURI(message)}`;
            window.open(url);
            handleClose()
        }
    };

    return (
        <div className={showHideClassName} >
            <div className='popup-main'>
                <div className='whatsapp-card app' ref={ref}>
                    <div className='title flex_middle'>
                        <div style={{ marginRight: "0.5em" }}>
                            <WhatsAppIcon style={{backgroundColor: 'white' ,color: '#08db42' ,borderRadius: '50%'}}/>
                        </div>
                        <div>Send Message</div>
                    </div>
                    {numberEmptyError && (
                        <div className='errors'>Mobile number cannot be empty!</div>
                    )}
                    {messageEmptyError && (
                        <div className='errors'>Message cannot be empty!</div>
                    )}
                    {!numberEmptyError && !messageEmptyError && (
                        <div className='errors-null'/>
                    )}
                    <div className='search_contact app'>
                        <Input
                            error={numberEmptyError}
                            label='Mobile Number'
                            placeholder='Mobile Number'
                            name='mobileNumber'
                            value={mobileNumber}
                            onChange={onChange}
                            size='small'
                            style={{
                                margin: "1em 0em",
                            }}
                            required
                        />
                    </div>
                    <div className='message app' style={{ marginTop: "1.5em" }}>
                        <Input
                            multiline
                            maxRows={4}
                            label='Message'
                            placeholder='Hi! I had a great time meeting you...'
                            size='small'
                            name='message'
                            value={message}
                            onChange={onChange}
                            required
                            error={message.length > CHARACTER_LIMIT - 1 || messageEmptyError}
                        />
                    </div>
                    <div style={{ marginTop: "1.5em" }}>
                        <Button
                            onClick={onSubmit}
                            variant='outlined'
                            color='success'
                            size='small'
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMessage;
