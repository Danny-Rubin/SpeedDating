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
        {img: profile_instructions_logo, title: 'Create a Profile', text: 'Here’s where the magic starts! The more we know about you, the better we can match you with the right singles.'},
        {img: pic_instructions_logo, title: 'Upload Quality Photo', text: 'Seriously! This is the number one thing you can do to increase your chances after your speed date. Make sure the photo shows the real you!'},
        {img: dating_instructions_logo, title: 'Start Dating!', text: 'Start searching your love partner in a speed dating session. The dating are on camera, so make sure youre camera ready.'},
        {img: contact_instructions_logo, title: 'Contact Who You Liked!', text: 'After a dating you can contact a person you liked, in case the liked you too, and keep the magic going!'},
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
                    <div>Introducing your new favorite speed dating site!</div>
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
                    write some stuff. bla bla bla.
                </div>
            </div>
            <div className="instruction-part">
                <h2>Ready? its easy peasy</h2>
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
