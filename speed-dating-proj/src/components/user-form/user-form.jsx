import React, {useEffect, useState} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import Header from "../header/header";
import './user-form.css'
import {fetchAuthSession} from 'aws-amplify/auth';
import Typography from "@mui/material/Typography";
import {useNavigate} from 'react-router-dom';
import {getRequest, postRequest, putRequest} from "../../services/amplify-api-service";
import { uploadData, getUrl} from 'aws-amplify/storage';
import person_avatar from "../../assets/person-love.png";

const locationList = ['North', 'Center', 'South'];
const attractionList = ['Female', 'Male', 'Both'];
const genderList = ['Male', 'Female', 'Other'];
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const requiredFields = ['location', 'gender', 'attraction','dateOfBirth'];
const profileApiName = "profiles";
const path = "profiles";


const UserForm = ({setIsLoggedIn}) => {
    const [isNewUser, setIsNewUser] = useState(true);
    const [accessToken, setAccessToken] = useState(undefined);
    const [profileId, setProfileId] = useState(undefined);
    const [profilePicUrl, setProfilePicUrl] = useState(undefined);

    const [formData, setFormData] = useState({
        location: '',
        gender: '',
        attraction: '',
        dateOfBirth: '',
        phone: '',
        profilePicFile: '',
        social: ''
    });

    const [errors, setErrors] = useState({
        location: null,
        gender: null,
        attraction: null,
        dateOfBirth: null,
        phone: null,
        profilePicFile: null,
        social: null,
        contact: null
    });

    const navigate = useNavigate();


    useEffect(() => {
        currentAuthenticatedUser();
    }, []);

    const currentAuthenticatedUser = ()=>
    {

        fetchAuthSession({forceRefresh:true})
            .then((session)=>{
                const currAccessToken = session.tokens.accessToken.toString();
                setAccessToken(currAccessToken);
                setProfileId(session.tokens.accessToken.payload.username);
                updateImgUrl(session.tokens.accessToken.payload.username);
                return getRequest(profileApiName, path, currAccessToken);
            }).then(userProfile=>{
                if (userProfile){
                    setIsNewUser(false);
                    setFormData(userProfile);
                }
            }).catch(err=>{
                setIsNewUser(true);
                console.log(err);
            });
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

    const updateImgUrl = async(username=profileId)=> {
        try{
            let url = await getUrl({
                key: `${username}.jpeg`,
                options: {
                    accessLevel: 'guest', // can be 'private', 'protected', or 'guest' but defaults to `guest`
                    targetIdentityId: profileId, // id of another user, if `accessLevel` is `guest`
                    download: false
                }
            });
            setProfilePicUrl(url.url.href);
        }
        catch (e) {

        }
    };

    const handleImgFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        // File type validation
        if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
            set_error('profilePicFile', "Invalid file type. Please upload a JPEG, PNG, or GIF image.");
            return;
        }
        set_error('profilePicFile', undefined);



        try {

            const result = await uploadData({

                key: `${profileId}.jpeg`,

                data: selectedFile,

                options: {

                    accessLevel: 'guest', // defaults to `guest` but can be 'private' | 'protected' | 'guest'

                }

            }).result;


            setFormData((prevData) => ({
                ...prevData,
                ['profilePicFile']: `${profileId}.jpeg`,
            }));


            await updateImgUrl();


        } catch (error) {

            console.log('Error : ', error);

        }
    };


    function validatePhoneNumber(phoneNumber) {

        if(!phoneNumber){
            return true;
        }

        const israeliPhonePattern = /^(00972|0|\\+972)[5][0-9]{8}$/;

        return israeliPhonePattern.test(phoneNumber);
    }

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;

        const phone = value.trim();

        setFormData((prevData) => ({
            ...prevData,
            [name]: phone,
        }));

        // phone validation
        if (!validatePhoneNumber(phone)){
            set_error(name, "Illegal phone number");
            return;
        }

        set_error(name, undefined);
        set_error('contact', undefined);
    };

    function validateSocialNetwork(url) {
        // Remove whitespace from the beginning and end of the phone number
        if(!url){
            return true;
        }

        // Regular expression pattern for a simple phone number format
        const facebookPattern = new RegExp('(?:(?:http|https):\\/\\/)?(?:www.)?facebook.com\\/(?:(?:\\w)*#!\\/)?(?:pages\\/)?(?:[?\\w\\-]*\\/)?(?:profile.php\\?id=(?=\\d.*))?([\\w\\-]*)?\n');
        const instaPattern =  new RegExp('/(?:(?:http|https):\\/\\/)?(?:www\\.)?(?:instagram\\.com|instagr\\.am)\\/([A-Za-z0-9-_\\.]+)/');;

        return instaPattern.test(url) || facebookPattern.test(url);
    }

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        const social = value.trim();


        setFormData((prevData) => ({
            ...prevData,
            [name]: social,
        }));

        // phone validation
        if (!validateSocialNetwork(social)){
            set_error(name, "Illegal social network profile url");
            return;
        }
        set_error(name, undefined);
        set_error('contact', undefined);


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

        if (!formData.phone && !formData.social){
            set_error('contact',"You are required to fill your phone number or a social media profile so people can get in touch with you.");
            return;
        }

        postRequest(profileApiName, path, formData, accessToken)
            .then(()=>{
                navigate('/homepage');
            }).catch((error)=>{
                console.log(`error updating profile at server. Error: ${error}`)
            });
    };

    return (
        <div className="user-form-main main-div">
            {
                !isNewUser &&
                <div className="user-form-header-div">
                    <Header setIsLoggedIn={setIsLoggedIn}/>
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
                                    <Button variant="outlined"  component="span" size='small'
                                            style={{boxShadow: '1px 1px 1px #ffb0d1', color:'rgba(0, 0, 0, 0.87)',
                                            textAlign: 'center'}}>
                                        Upload File
                                    </Button>
                                </label>
                            </FormControl>
                                <div>
                                    {profilePicUrl ? (<img className="profile-img" src={profilePicUrl}/>)
                                        : (<img className="profile-img"  src={person_avatar}/>)}
                                </div>
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
                        <div className="contact-field-error">
                            {errors.contact && (
                                <Typography variant="body2" color="error" mt={2} className="error-msg">
                                    {errors.contact}
                                </Typography>
                            )}
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
                                value={formData.phone || ''}
                                name="phone"
                                onChange={handlePhoneChange}
                                type="tel"
                                pattern="[0-9]{10}"
                                placeholder="Enter phone number"
                            />

                        </div>
                        <div className="social-field-error">
                            {errors.social && (
                                <Typography variant="body2" color="error" mt={2} className="error-msg">
                                    {errors.social}
                                </Typography>
                            )}
                        </div>
                        <div className="social-field">
                            <InputLabel className="social-title">Social Media Link:</InputLabel>
                            <TextField
                                value={formData.social || ''}
                                name="social"
                                onChange={handleSocialChange}
                                placeholder="Instagram or Facebook profile url"
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
