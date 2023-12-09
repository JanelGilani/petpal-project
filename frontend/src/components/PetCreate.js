import React from "react";
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import '../styles/pet-create.css';
import NavBar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, json } from "react-router-dom";
import Error from "./404.js";


export default function PetCreate() {
    const { Option } = Select;
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const shelter_id = location.pathname.split("/")[2]
    const [messageApi, contextHolder] = message.useMessage();
    // console.log(auth);
    const error = (err) => {
        message.open({
            type: 'error',
            content: err,
        });
    };
    const success = () => {
        message.open({
            type: 'success',
            content: 'Pet registered',
        });
        navigate("/manage-shelter");
    };

    const [petDetails, setPetDetails] = useState({
        name: "",
        age: 0,
        species: "",
        breed: "",
        size: "",
        description: "",
        location: "",
        color: "",
        size: "",
        gender: "",
    });

    if (auth.objectId === "seeker") {
        return <Error error={403} />;
    } else if (!auth.authenticated) {
        return <Error error={401} />;
    }

    const handleFormChange = (key, value) => {
        setPetDetails({ ...petDetails, [key]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(petDetails);
        try {
            const response = await fetch("http://localhost:8000/pets/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
                body: JSON.stringify(petDetails),
            });
    
            const data = await response.json();
            console.log(data);
            if (data.error) {
                error(data.error);
            } else {
                success();
            }
        } catch (err) {
            console.error(err);
            message.error("Something went wrong!");
        }
    };
    
    return (
        <div class="content">
            <NavBar />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-7">
                        <form className="adoption-form" onSubmit={handleSubmit}>
                            <p style={{ fontSize: "30px", fontWeight: "bold" }}>Pet Creation</p>
                            <div className="form-group">
                                <label htmlFor="name">Pet Name</label>
                                <input
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    required
                                    type="text"
                                    onChange={(e) => handleFormChange("name", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input className="form-control" id="age" name="age" required type="number"
                                    onChange={(e) => handleFormChange("age", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="species">Species</label>
                                <input className="form-control" id="species" name="species" required type="text"
                                    onChange={(e) => handleFormChange("species", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="breed">Breed</label>
                                <input className="form-control" id="breed" name="breed" required type="text"
                                    onChange={(e) => handleFormChange("breed", e.target.value)} />
                            </div>
                            <div className="form-group d-inline-flex flex-column">
                                <label htmlFor="size">Size</label>
                                <Select
                                    id="size"
                                    name="size"
                                    onChange={(value) => handleFormChange("size", value)}
                                    style={{ width: 120 }}
                                    required
                                >
                                    <Option value="Small">Small</Option>
                                    <Option value="Medium">Medium</Option>
                                    <Option value="Large">Large</Option>
                                </Select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description of the Pet</label>
                                <textarea className="form-control" id="description" name="description" required
                                    onChange={(e) => handleFormChange("description", e.target.value)}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input className="form-control" id="location" name="location" required type="text"
                                    onChange={(e) => handleFormChange("location", e.target.value)} />
                            </div>

                            <div className="form-group d-inline-flex flex-column">
                                <label htmlFor="color">Colour</label>
                                <Select
                                    id="color"
                                    name="color"
                                    onChange={(value) => handleFormChange("color", value)}
                                    style={{ width: 190 }}
                                    required
                                >
                                    <Option value="Black">Black</Option>
                                    <Option value="White">White</Option>
                                    <Option value="Brown">Brown</Option>
                                    <Option value="Grey">Golden</Option>
                                    <Option value="Golden">Other</Option>
                                </Select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender" className="mb-2" style={{ marginRight: "20px" }}>Gender</label>
                                <Select
                                    id="gender"
                                    name="gender"
                                    onChange={(value) => handleFormChange("gender", value)}
                                    style={{ width: 120 }}
                                    required
                                >
                                    <Option value="Male">Male</Option>
                                    <Option value="Female">Female</Option>
                                </Select>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Application</button>
                        </form>
                    </div>
                    <div className="col-lg-5">
                        <div className="upload-image">
                            <Upload>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}