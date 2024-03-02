import React, {useEffect, useState} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import Header from "../header/header";
import './user-form.css'
import {getCurrentUser} from 'aws-amplify/auth';
import Typography from "@mui/material/Typography";
import {useNavigate} from 'react-router-dom';
import {getRequest, postRequest, putRequest} from "../../services/amplify-api-service";
import wavy_background from "../../assets/testing-background.png";


const locationList = ['North', 'Center', 'South'];
const attractionList = ['Female', 'Male', 'Both'];
const genderList = ['Male', 'Female', 'Other'];
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const requiredFields = ['location', 'gender', 'attraction','dateOfBirth','phone'];
const profileApiName = "profiles";
const path = "/profiles/";


const UserForm = () => {
    const [userId, setUserId] = useState(undefined);
    const [isNewUser, setIsNewUser] = useState(true);

    // todo here get from server current profile state.
    const [formData, setFormData] = useState({
        location: '',
        gender: '',
        attraction: '',
        dateOfBirth: '',
        phone: '',
        profilePicFile: ''
    });

    const [errors, setErrors] = useState({
        location: null,
        gender: null,
        attraction: null,
        dateOfBirth: null,
        phone: null,
        profilePicFile: null
    });

    const navigate = useNavigate();


    useEffect(() => {
        currentAuthenticatedUser();
    }, []);

    const currentAuthenticatedUser = ()=>
    {
        getCurrentUser()
            .then(data=>{
                setUserId(data.userId);
                return getRequest(profileApiName, `${path}${data.userId}`);
            }).then(userProfile=>{
                if (userProfile){
                    setIsNewUser(false);
                }
                console.log(userProfile)
                // todo noa: when get works update formData state accordingly
            }).catch(err=>{
                setIsNewUser(true);
                console.log(err);
            })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const set_error = (key,error)=>{
        setErrors((prevData) => ({
            ...prevData,
            [key]: error
        }));
    };

    const handleImgFileChange = (e) => {
        const selectedFile = e.target.files[0];
        // File type validation
        if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
            set_error('profilePicFile', "Invalid file type. Please upload a JPEG, PNG, or GIF image.");
            return;
        }
        set_error('profilePicFile', undefined);

        setFormData((prevData) => ({
            ...prevData,
            ['profilePicFile']: selectedFile,
        }));
    };

    function validatePhoneNumber(phoneNumber, minLength=7, maxLength=15) {
        // Remove whitespace from the beginning and end of the phone number
        phoneNumber = phoneNumber.trim();

        // Regular expression pattern for a simple phone number format
        const israeliPhonePattern = /^(00972|0|\\+972)[5][0-9]{8}$/;

        return israeliPhonePattern.test(phoneNumber);
        // todo noa decide if we want international numbers? currently just israeli

        //const phonePattern = /^\+?[0-9]+$/;
        //return phonePattern.test(phoneNumber) && phoneNumber.length >= minLength && phoneNumber.length <= maxLength;
    }

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // phone validation
        if (!validatePhoneNumber(value)){
            set_error(name, "Illegal phone number");
            return;
        }

        set_error(name, undefined);

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        for (let requiredField in requiredFields){
            if (formData[requiredField] || !errors[requiredField])
                continue;
            set_error(requiredField,"This field is required")
        }

        for (let field in errors){
            if (errors[field]){
                return;
            }
        }

        // todo noa: send to server
        console.log('Form Data:', formData);
        //let request = undefined;
        // todo noa when BE works.
        // if (isNewUser){
        //     request = postRequest(profileApiName, path, formData);
        // }
        // else{
        //     request = putRequest(profileApiName, `${path}${userId}`, formData);
        // }

        let request = postRequest(profileApiName, `${path}${userId}`, formData);
        request.then(()=>{
            navigate('homepage');
            }).catch((error)=>{
                console.log(`error updating profile at server. Error: ${error}`)
            });
    };

    return (
        <div className="user-form-main main-div">
            {
                !isNewUser &&
                <div className="user-form-header-div">
                    <Header/>
                </div>

            }
            <div className="main-title-div mycard">
                <label className="form-title">Profile Details</label>
            </div>
            <div className="main-form-div mycard  main-div">
                <div className="form-main">
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="profile-pic-error">
                            {errors.profilePicFile && (
                                <Typography variant="body2" color="error" mt={2} className="error-msg">
                                    {errors.profilePicFile}
                                </Typography>
                            )}
                        </div>
                        <div className="profile-pic-field">
                            <InputLabel className="profile-pic-title">Profile Picture</InputLabel>
                            <div className="profile-pic-buttons">
                            <FormControl>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    name="profilePicFile"
                                    onChange={handleImgFileChange}
                                    style={{display: 'none'}}
                                />
                                <label htmlFor="image-upload">
                                    <Button variant="outlined"  component="span"
                                            style={{boxShadow: '1px 1px 1px #ffb0d1', color:'rgba(0, 0, 0, 0.87)'}}>
                                        Choose File
                                    </Button>
                                </label>
                            </FormControl>
                            <Button variant="contained" color="primary" disabled={!formData.profilePicFile}>
                                Upload
                            </Button>
                            </div>
                        </div>
                        <div className="gender-field-error">
                            {errors.gender && (
                                <Typography variant="body2" color="error" mt={2} className="error-msg">
                                    {errors.gender}
                                </Typography>
                            )}
                        </div>
                        <div className="gender-field">
                            <FormControl required>
                                <InputLabel className="gender-title">Gender:</InputLabel>
                                <Select name="gender" value={formData.gender || ''} onChange={handleChange}>
                                    {genderList.map((gender) => (
                                        <MenuItem value={gender} key={gender}>{gender}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="attraction-field-error">
                            {errors.attraction && (
                                <Typography variant="body2" color="error" mt={2} className="error-msg">
                                    {errors.attraction}
                                </Typography>
                            )}
                        </div>
                        <div className="attraction-field">
                            <FormControl required>
                                <InputLabel className="attraction-title">Attraction:</InputLabel>
                                <Select name="attraction" value={formData.attraction || ''} onChange={handleChange}>
                                    {attractionList.map((attraction) => (
                                        <MenuItem value={attraction} key={attraction}>{attraction}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="location-field-error">
                            {errors.location && (
                                <Typography variant="body2" color="error" mt={2} className="error-msg">
                                    {errors.location}
                                </Typography>
                            )}
                        </div>
                        <div className="location-field">
                            <FormControl required>
                                <InputLabel className="location-title">Location:</InputLabel>
                                <Select name="location" value={formData.location || ''} onChange={handleChange}>
                                    {locationList.map((location) => (
                                        <MenuItem value={location} key={location}>{location}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="dateOfBirth-field-error">
                            {errors.dateOfBirth && (
                                <Typography variant="body2" color="error" mt={2} className="error-msg">
                                    {errors.dateOfBirth}
                                </Typography>
                            )}
                        </div>
                        <div className="birthday-field">
                            <InputLabel className="birthday-title">Date of Birth:*</InputLabel>
                            <TextField
                                required
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="phone-field-error">
                            {errors.phone && (
                                <Typography variant="body2" color="error" mt={2} className="error-msg">
                                    {errors.phone}
                                </Typography>
                            )}
                        </div>
                        <div className="phone-number-field">
                            <InputLabel className="phone-number-title">Phone number:</InputLabel>
                            <TextField
                                required
                                value={formData.phone || ''}
                                name="phone"
                                onChange={handlePhoneChange}
                                type="tel"
                                pattern="[0-9]{10}"
                                placeholder="Enter phone number"
                            />

                        </div>
                        <div className="save-btn-main">
                            <Button type="submit" color="secondary" className="save-btn" size="large">Save</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
