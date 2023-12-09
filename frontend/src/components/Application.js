import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Error from "./404.js";
import { useLocation, useNavigate } from "react-router-dom";
import {message } from 'antd';

export default function PetApplication() {
    const auth = useSelector((state) => state.auth);
    const [messageApi, contextHolder] = message.useMessage(); 
    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname;
    const petId = url.split("/")[2];
    const [petDetails, setPetDetails] = useState([]);
    const [PetApplication, setPetApplication] = useState({
        name: "",
        email: "",
        address: "",
        pettype: "",
        petage: "",
        ownedBefore: "",
        plantoprovide: "",
        reason: "",
        emergencycontact: "",
        emergencyemail: "",
        acknowledge: "",
        seeker_user: "",
        shelter_user: "",
        pet: "",
    });

    const error = (err) => {
        message.open({
            type: 'error',
            content: err,
        });
    };
    const success = () => {
        message.open({
            type: 'success',
            content: 'Application Created Successfully',
        });
        navigate(-1);
    };

    useEffect(() => {
        async function getPetData() {
            try {
                const res = await fetch(`http://localhost:8000/pets/details/${petId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth.token}`,
                    }
                });
                const data = await res.json();
                console.log(data);
                if (res.status !== 200) {
                    alert(data.detail);
                }
                else {
                    setPetDetails(data);
                    setPetApplication({
                        ...PetApplication,
                        pettype: data.species,
                        petage: data.age,
                        seeker_user: auth.userId,
                        shelter_user: data.shelter,
                        pet: data.id
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }
        getPetData();
    }, []);


    if (!auth.authenticated) {
        return <Error />;
    }

    const handleFormChange = (key, value) => {
        setPetApplication({ ...PetApplication, [key]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        petDetails && setPetApplication({ ...PetApplication, pettype: petDetails.species, petage: petDetails.age, seeker_user: auth.userId, shelter_user: petDetails.shelter, pet_id: petDetails.id });
        console.log(PetApplication);
        try {
            const response = await fetch("http://localhost:8000/applications/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
                body: JSON.stringify(PetApplication),
            });

            const data = await response.json();
            console.log(data);
            if (response.status !== 201) {
                error(data.detail);
            }
            else {
                success();
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="content">
            <Navbar />
            {
                petDetails &&
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-lg-7">
                            <form className="adoption-form" onSubmit={handleSubmit}>
                                <p style={{ fontSize: '30px', fontWeight: 'bold' }}>Adoption Application</p>
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input type="text" className="form-control" id="name" name="name" required onChange={(e) => handleFormChange("name", e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" className="form-control" id="email" name="email" required onChange={(e) => handleFormChange("email", e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Home Address</label>
                                    <input type="text" className="form-control" id="address" name="address" required onChange={(e) => handleFormChange("address", e.target.value)}/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pettype" value>Pet Type</label>
                                    <input type="text" className="form-control" id="pettype" name="pettype" value={petDetails.species} disabled />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Pet Age</label>
                                    <input type="number" className="form-control" id="age" name="age" value={petDetails.age} required disabled />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="own">Have you owned pets before? If so, what happened to them?</label>
                                    <textarea className="form-control" rows={4} id="own" placeholder="Enter Your answer here" required onChange={(e) => handleFormChange("ownedbefore", e.target.value)}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="plan">How do you plan to provide for your new pet's exercise and mental stimulation needs?</label>
                                    <textarea className="form-control" rows={4} id="plan" placeholder="Enter Your answer here" required onChange={(e) => handleFormChange("plantoprovide", e.target.value)}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reason">Reason for adoption</label>
                                    <textarea className="form-control" rows={4} id="reason" placeholder="Enter Your reason here" required onChange={(e) => handleFormChange("reason", e.target.value)}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ename">Emergency contact name</label>
                                    <input type="text" className="form-control" id="ename" name="ename" required onChange={(e) => handleFormChange("emergencycontact", e.target.value)} maxLength="12"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="eemail">Emergency contact email address</label>
                                    <input type="email" className="form-control" id="eemail" name="eemail" required onChange={(e) => handleFormChange("emergencyemail", e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <input type="checkbox" id="agreement" name="agreement" value="Bike" onChange={(e) => handleFormChange("acknowledge", true)}/>
                                    <label htmlFor="agreement"> I acknowledge and agree to the shelter or rescue organization's adoption policies, including spaying/neutering, return policies, and commitment to providing proper care and love.</label><br />
                                </div>

                                <button type="submit" className="btn btn-primary">Submit Application</button>
                            </form>
                        </div>
                        <div className="col-lg-4">
                            <p style={{ fontSize: '30px', fontWeight: 'bold' }}>Learn About Adoption</p>
                            {/* ... your cards and content */}
                        </div>
                    </div>
                </div>
            }
            <Footer />
        </div>
    );
}
