import React from "react";
import './landing-page.css';
import InstructionCube from "./instruction-cube/instruction-cube";
import Button from "@mui/material/Button";
import text_logo from "../../../assets/flash-flirt-text.png";
import profile_instructions_logo from '../../../assets/profile-instruction.png';
import pic_instructions_logo from '../../../assets/pic-instructions.png';
import dating_instructions_logo from '../../../assets/dating-instruction.png';
import contact_instructions_logo from '../../../assets/contact-instruction.png';
import x from '../../../assets/flying.png';
import y from '../../../assets/back-to-back.png';

const LandingPage = () => {
    const instructionsData = [
        {img: profile_instructions_logo, title: 'Create a Profile', text: 'Here’s where the magic starts! Provide us a few details about you we will match you by.'},
        {img: pic_instructions_logo, title: 'Upload a Quality Photo', text: 'Seriously! This is the number one thing you can do to increase your chances after your speed date. Make sure the photo shows the real you!'},
        {img: dating_instructions_logo, title: 'Start Dating!', text: 'Start searching your love partner in a speed dating session. The dates are on camera, so make sure you\'re camera ready.'},
        {img: contact_instructions_logo, title: 'Contact Who You Liked!', text: 'After a dating session you can contact a person you liked, in case they liked you too, and keep the magic going!'},
    ];

    return (
        <div className="landing-page-main">
            <div className="landing-header">
                <div className="FlashFlirt-title">
                    <img src={text_logo} className="text-logo"/>
                </div>
                <div className="goto-login">
                    <Button href={'/login'} style={{backgroundColor:'rgb(209 0 144)', color: 'white', textAlign: 'center'}}>
                        Get Started
                    </Button>
                </div>
            </div>
            <div className="title-part section">
                <div className="landing-title-wrapper">
                    <h1 className="lading-title">
                    Meet
                    <span className="text-to-color"> people,</span><br/>
                    not profiles.
                    </h1>
                    <div>Are you ready to ignite sparks and find your perfect match in record time? Look no further than
                        FlashFlirt – the ultimate destination for exhilarating speed dating video sessions.</div>
                </div>
                <div className="cute-pic">
                    <img src={x}  className="section-pic"/>
                </div>
            </div>
            <div className="middle-part section">
                <div className="middle-part-photo-wrapper">
                    <img src={y} className="section-pic"/>
                </div>
                <div className="middle-part-text">
                    <span className="middle-part-title">Discover the Magic of Speed Dating</span>
                    <br/>
                    Experience the thrill of meeting potential love interests face-to-face through our innovative video chat platform.
                    Say goodbye to endless swiping and hello to real connections in real time!
                </div>
            </div>
            <div className="instruction-part">
                <h2>Ready? this is how it works</h2>
                <div className="instruction-wrapper">
                    {instructionsData.map((instructionData)=>(
                          <InstructionCube props={instructionData} key={instructionData.title}/>
                      ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
