import React from "react";
import './instruction-cube.css';
const InstructionCube = ({props}) => {

    return (
        <div className="instruction-cube-main">
            <div className="img-wrapper">
                <div className="image-data-wrapper">
                    <img src={props.img} className="img"/>
                </div>
            </div>
            <div className="title-wrapper">
                <span>{props.title}</span>
            </div>
            <div className="text-wrapper">
                <span>{props.text}</span>
            </div>
        </div>
    );
};

export default InstructionCube;
