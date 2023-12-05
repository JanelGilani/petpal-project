import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Error from "./404.js";
import '../styles/pet-details.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Descriptions } from 'antd';
import { Card, Button, Space, Divider, Typography, Avatar } from 'antd';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import Logo from '../img/logo.png';
const { Title, Text } = Typography;


export default function PetDetails() {
    const [pet, setPet] = useState(null);
    const [shelter, setShelter] = useState(null);
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const pet_id = location.pathname.split("/")[2];
    
    useEffect(() => {
        if (!auth.authenticated) {
            return <Error error={401} />;
        }

        async function fetchData() {
            try {
                const petRes = await fetch(`http://localhost:8000/pets/details/${pet_id}/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.token}`
                    },
                });
                const petData = await petRes.json();

                if (petRes.status !== 200) {
                    alert(petData.detail);
                } else {
                    setPet(petData);
                }

                if (petData && petData.shelter) {
                    const shelterRes = await fetch(`http://localhost:8000/accounts/shelters/profile/${petData.shelter}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${auth.token}`
                        }
                    });
                    const shelterData = await shelterRes.json();
                    setShelter(shelterData);
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, [pet_id, auth]);
    
    return (
        <div className="content">
            <Navbar />
            <div className="pet-details content">
                {
                    pet && shelter &&
                    <div className="pet-details content">
                        <h1 className="title"> Hi, My name is {pet.name}</h1>
                        <div className="grid-container">
                            <div className="card pet-image">
                                {
                                    pet.image ?
                                        <img src={pet.image} alt="pet" />
                                        :
                                        <img src={Logo} alt="pet" />
                                }
                            </div>
                            <div className="card pet-info">
                                <h5 className="card-title mb-3 text-xl">My Info</h5>
                                <Descriptions column={1}>
                                    <Descriptions.Item labelStyle={{ fontSize: '20px' }} contentStyle={{ fontSize: '20px' }} label="Breed">{pet.breed}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontSize: '20px' }} contentStyle={{ fontSize: '20px' }} label="Age">{pet.age}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontSize: '20px' }} contentStyle={{ fontSize: '20px' }} label="Size">{pet.size}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontSize: '20px' }} contentStyle={{ fontSize: '20px' }} label="Characteristic">{pet.description}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontSize: '20px' }} contentStyle={{ fontSize: '20px' }} label="Color">{pet.color}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontSize: '20px' }} contentStyle={{ fontSize: '20px' }} label="Location">{pet.location}</Descriptions.Item>
                                    <Descriptions.Item labelStyle={{ fontSize: '20px' }} contentStyle={{ fontSize: '20px' }} label="Gender">{pet.gender}</Descriptions.Item>
                                </Descriptions>
                            </div>

                            <div className={"card pet-status " + pet.status + " border-0"}>
                                <h1 className="custom-font" style={{ color: 'white' }}>{pet.status}</h1>
                            </div>
                            <div className="card adoption-detail">
                                <Title level={3} style={{ color: 'rgb(77, 71, 81)' }}>GoDoggy Adoption Center</Title>
                                <Divider />
                                <Space direction="vertical" size="large">
                                    <Space>
                                        <EnvironmentOutlined style={{ fontSize: '1.5em', color: 'black' }} />
                                        <Text strong>Address:</Text>
                                        <Text>{shelter.location}</Text>
                                    </Space>
                                    <Space>
                                        <MailOutlined style={{ fontSize: '1.5em', color: 'black' }} />
                                        <Text strong>Email:</Text>
                                        <Text>{shelter.user.email}</Text>
                                    </Space>
                                    <Space>
                                        <PhoneOutlined style={{ fontSize: '1.5em', color: 'black' }} />
                                        <Text strong>Phone:</Text>
                                        <Text>+123 456 7890</Text>
                                    </Space>
                                </Space>
                                <Divider />
                                <Button type="primary" className="adopt-button">
                                    Adopt Me
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <Footer />
        </div>
    );
}       