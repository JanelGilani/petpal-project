import { useState, useEffect } from "react";
import React from "react";
import { Button, Form, Input, message, Radio } from 'antd';
import { FaPaw, FaHeart, FaCheckCircle } from "react-icons/fa";
import '../styles/register.css';
import NavBar from "./Navbar";
import Footer from "./Footer";
const { TextArea } = Input;

export default function Register() {
    const [seeker, setSeeker] = useState({
        username: "",
        email: "",
        password: "",
        seeker_name: "",
        location: "",
    });
    const [shelter, setShelter] = useState({
        username: "",
        email: "",
        password: "",
        shelter_name: "",
        location: "",
        registration_number: "",
        license: "",
    });
    const [userType, setUserType] = useState("seeker");

    const [messageApi, contextHolder] = message.useMessage();

    const error = (err) => {
        message.open({
            type: 'error',
            content: err,
        });
    };
    const success = () => {
        message.open({
            type: 'success',
            content: 'User registered',
        });
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setShelter({ ...shelter, license: reader.result });
        };
    };

    const handleChange = (e) => {
        if (userType === "seeker") {
            setSeeker({ ...seeker, [e.target.name]: e.target.value });
        }
        else {
            setShelter({ ...shelter, [e.target.name]: e.target.value });
        }
    };

    const handleNameChange = (e) => {
        if (userType === "seeker") {
            setSeeker({ ...seeker, seeker_name: e.target.value });
        }
        else {
            setShelter({ ...shelter, shelter_name: e.target.value });
        }
    }

    const validateRegistration = (values) => {
        console.log("seeker");
        if (values.password !== values.confirmPassword) {
            error("Passwords do not match");
        }
        else {
            if (userType === "seeker") {
                registerSeeker(seeker);
            }
            else {
                registerShelter(shelter);
            }
        }
    }

    function clearForm() {
        setSeeker({
            username: "",
            email: "",
            password: "",
            seeker_name: "",
            location: "",
        });
        setShelter({
            username: "",
            email: "",
            password: "",
            shelter_name: "",
            location: "",
            registration_number: "",
            license: "",
        });

        // Clear form fields
        document.getElementById("signup-form").reset();
    }

    async function registerSeeker(details) {
        try {
            const response = await fetch('http://localhost:8000/accounts/petseekers/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(details)
            });
            const data = await response.json();
            if (response.status === 400) {
                error(data["detail"]);
            } else {
                success();
            }
        } catch (err) {
            console.log(err);
            error("Something went wrong");
        }
        clearForm();
    }

    async function registerShelter(details) {
        try {
            const response = await fetch('http://localhost:8000/accounts/shelters/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(details)
            });
            const data = await response.json();
            console.log(data);
            if (data.error) {
                error(data.error);
            } else {
                success();
                clearForm();
            }
        } catch (err) {
            console.log(err);
            error("Something went wrong");
        }
    }

    return (
        <div className="content">
            <NavBar />
            <div className="signup-main">
                <div className="left-signup">
                    <Form
                        id="signup-form"
                        className="ui form"
                        onFinish={validateRegistration}  // Change to onFinish
                    >
                        <h2>Sign Up</h2>
                        {
                            userType === "shelter" ?
                                <div id="shelter-fields" className="field hidden">
                                    <div className="field">
                                        <label htmlFor="shelter-name">Shelter Name</label>
                                        <Input type="text" className="form-control" id="shelter-name" name="shelter_name" onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="username">Username</label>
                                        <Input type="text" className="form-control" id="username" name="username" required onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="location">Shelter Address</label>
                                        <Input type="text" className="form-control" id="location" name="location" onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="email">Email</label>
                                        <Input type="email" className="form-control" id="email" name="email" required onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="password">Password</label>
                                        <Input type="password" className="form-control" id="password" name="password" required onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="confirm-password">Confirm Password</label>
                                        <Input type="password" className="form-control" id="confirm-password" name="confirm-password" required onChange={handleNameChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="registration-number">Mission Statement</label>
                                        <TextArea
                                            rows={4}
                                            maxLength={6}
                                            className="form-control"
                                            id="mission-statement"
                                            name="mission_statement"
                                            onChange={handleChange}
                                        />                                    </div>
                                </div>
                                : <div id="seeker-fields" className="field hidden">
                                    <div className="field">
                                        <label htmlFor="full-name">Full Name</label>
                                        <Input type="text" className="form-control" id="seeker-name" name="seeker_name" required onChange={handleNameChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="username">Username</label>
                                        <Input type="text" className="form-control" id="username" name="username" required onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="confirm-password">Location</label>
                                        <Input type="text" className="form-control" id="location" name="location" required onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="email">Email</label>
                                        <Input type="email" className="form-control" id="email" name="email" required onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="password">Password</label>
                                        <Input type="password" className="form-control" id="password" name="password" required onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="confirm-password">Confirm Password</label>
                                        <Input type="password" className="form-control" id="confirm-password" name="confirm-password" required onChange={handleChange} />
                                    </div>
                                </div>
                        }
                        <div className="grouped fields">
                            <label>I am a:</label>
                            <div className="field">
                                <Radio.Group onChange={handleUserTypeChange} value={userType}>
                                    <Radio value="seeker" name="user-type">Pet Seeker</Radio>
                                    <Radio value="shelter" name="user-type">Pet Shelter</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className="field">
                            <Button type="primary" htmlType="submit" className="btn btn-primary">Sign Up</Button>
                        </div>
                    </Form>
                </div>
                <div className="right-signup">
                    <div className="benefit-icons">
                        <div className="benefit-icon">
                            <FaPaw className="fa-4x" size={80} />
                            <h5>We Offer</h5>
                            <p>Find your perfect pet from a wide selection of adorable animals.</p>
                        </div>
                        <div className="benefit-icon">
                            <FaCheckCircle className="fa-4x" size={80} />
                            <h5>We Care</h5>
                            <p>Experience a quick and hassle-free adoption process with PetPal.</p>
                        </div>
                        <div className="benefit-icon">
                            <FaHeart className="fa-4x" size={80} />
                            <h5>You Give</h5>
                            <p>Give a loving home to a furry friend and make a difference by being a difference.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
